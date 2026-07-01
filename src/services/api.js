import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.5.199:8000/api';
const CLIENT_SCHEMA = import.meta.env.VITE_CLIENT_SCHEMA || 'client_01';
const SOURCE_TYPE = 'db_latest';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const defaultPayload = {
  clientschema: CLIENT_SCHEMA,
  sourcetype: SOURCE_TYPE,
  limit: 5000,
};

// All documents share do_type=0. Differentiation is by do_domaine + do_piece prefix:
//   Vente Factures : do_domaine=[0], piece_prefix='F'
//   Vente BL       : do_domaine=[0], piece_prefix='BL'
//   Vente Devis    : do_domaine=[0], piece_prefix='D'
//   Achat Factures : do_domaine=[1], piece_prefix='FBL'
//   Retours        : do_domaine=[0], piece_prefix='BR'
export const fetchDocuments = async (domaine, piecePrefix, dateFrom, dateTo) => {
  try {
    const payload = {
      ...defaultPayload,
      do_domaine: domaine,
      date_from: dateFrom,
      date_to: dateTo,
    };
    const response = await apiClient.post('/referentiel/documents-entete', payload);
    const allDocs = response.data?.data || [];
    // Filter client-side by piece prefix if provided
    if (piecePrefix) {
      return allDocs.filter(doc =>
        doc.do_piece && doc.do_piece.startsWith(piecePrefix)
      );
    }
    return allDocs;
  } catch (error) {
    console.error('Error fetching documents:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchStock = async () => {
  try {
    const payload = {
      ...defaultPayload,
      qte_min: 0.01,
    };
    const response = await apiClient.post('/referentiel/stock-depot', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching stock:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchComptesTiers = async (type) => {
  try {
    const payload = {
      ...defaultPayload,
      ct_type: [type],
    };
    const response = await apiClient.post('/referentiel/comptes-tiers', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching comptes tiers:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchCollaborateurs = async () => {
  try {
    const payload = {
      ...defaultPayload,
      co_vendeur: 1,
    };
    const response = await apiClient.post('/referentiel/collaborateurs', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching collaborateurs:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchLignesFacture = async (dateFrom, dateTo) => {
  try {
    const payload = {
      ...defaultPayload,
      do_domaine: [0],
      date_from: dateFrom,
      date_to: dateTo,
      with_entete: true,
    };
    const response = await apiClient.post('/referentiel/documents-ligne', payload);
    const allLignes = response.data?.data || [];
    // Keep only lines from Factures Vente (piece starts with 'F')
    return allLignes.filter(ligne =>
      ligne.do_piece && ligne.do_piece.startsWith('F')
    );
  } catch (error) {
    console.error('Error fetching document lignes:', error.response?.data || error.message);
    throw error;
  }
};

export const calculateCA = (factures) =>
  factures.reduce((sum, doc) => sum + (doc.do_totalhtnet || 0), 0);

export const calculateMargeBrute = (ca, facturesAchat) => {
  const totalAchats = facturesAchat.reduce((sum, doc) => sum + (doc.do_totalhtnet || 0), 0);
  return ca - totalAchats;
};

export const calculateValeurStock = (stockData) =>
  stockData.reduce((sum, item) => {
    const qte = parseFloat(item.as_qtesto) || 0;
    const prixAch = parseFloat(item.ar_prixach || item.ar_punet) || 0;
    return sum + (qte * prixAch);
  }, 0);

export const calculateTauxConversion = (devis, factures) => {
  if (devis.length === 0) return 0;
  return (factures.length / devis.length) * 100;
};

export const calculateCAByFamille = (lignesFacture) => {
  const caParFamille = {};
  lignesFacture.forEach((ligne) => {
    const famille = ligne.fa_codefamille || 'Non cat\u00e9goris\u00e9';
    caParFamille[famille] = (caParFamille[famille] || 0) + (ligne.dl_montantht || 0);
  });
  return Object.keys(caParFamille)
    .map((name) => ({ name, value: caParFamille[name] }))
    .sort((a, b) => b.value - a.value);
};
