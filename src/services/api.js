import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.5.199:8000/api';
const CLIENT_SCHEMA = 'client_01';
const SOURCE_TYPE = 'db_latest'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const defaultPayload = {
  client_schema: CLIENT_SCHEMA,
  source_type: SOURCE_TYPE,
  limit: 5000,
};

export const fetchDocuments = async (domaine, piecePrefix, dateFrom, dateTo) => {
  try {
    const payload = {
      ...defaultPayload,
      do_domaine: domaine,
      do_type: [0],
      date_from: dateFrom,
      date_to: dateTo,
    };
    const response = await apiClient.post('/referentiel/documents-entete', payload);
    const docs = response.data?.data || [];
    if (piecePrefix) {
      return docs.filter(doc => doc.do_piece && doc.do_piece.startsWith(piecePrefix));
    }
    return docs;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchStock = async () => {
  try {
    const payload = { ...defaultPayload, qte_min: 0.01 };
    const response = await apiClient.post('/referentiel/stock-depot', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

export const fetchComptesTiers = async (type) => {
  try {
    const payload = { ...defaultPayload, ct_type: [type] };
    const response = await apiClient.post('/referentiel/comptes-tiers', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching comptes tiers:', error);
    throw error;
  }
};

export const fetchCollaborateurs = async () => {
  try {
    const payload = { ...defaultPayload, co_vendeur: 1 };
    const response = await apiClient.post('/referentiel/collaborateurs', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching collaborateurs:', error);
    throw error;
  }
};

export const fetchLignesFacture = async (dateFrom, dateTo) => {
  try {
    const payload = {
      ...defaultPayload,
      do_domaine: [0],
      do_type: [6, 7],
      date_from: dateFrom,
      date_to: dateTo,
      with_entete: true,
    };
    const response = await apiClient.post('/referentiel/documents-ligne', payload);
    const docs = response.data?.data || [];
    // Only return Facture lines (which start with 'F' for ventes)
    return docs.filter(doc => doc.do_piece && doc.do_piece.startsWith('F'));
  } catch (error) {
    console.error('Error fetching document lignes:', error);
    throw error;
  }
};

// Calculate CA (Total HT Net of Factures Vente)
export const calculateCA = (factures) =>
  factures.reduce((sum, doc) => sum + (doc.do_totalhtnet || 0), 0);

// Calculate Marge Brute (CA - Achats)
export const calculateMargeBrute = (ca, facturesAchat) => {
  const totalAchats = facturesAchat.reduce((sum, doc) => sum + (doc.do_totalhtnet || 0), 0);
  return ca - totalAchats;
};

// Calculate Valeur du Stock
export const calculateValeurStock = (stockData) =>
  stockData.reduce((sum, item) => {
    const qte = parseFloat(item.as_qtesto) || 0;
    const prixAch = parseFloat(item.ar_prixach || item.ar_punet) || 0;
    return sum + (qte * prixAch);
  }, 0);

// Calculate Taux de Conversion
export const calculateTauxConversion = (devis, factures) => {
  if (devis.length === 0) return 0;
  return (factures.length / devis.length) * 100;
};

// CA by Famille
export const calculateCAByFamille = (lignesFacture, stockData = []) => {
  // Create mapping of ar_ref to fa_codefamille from stockData
  const refToFamille = {};
  stockData.forEach(item => {
    if (item.ar_ref) {
      refToFamille[item.ar_ref] = item.fa_codefamille || 'Non catégorisé';
    }
  });

  const caParFamille = {};
  lignesFacture.forEach((ligne) => {
    // Try to get family from the mapping, fallback to ligne.fa_codefamille or 'Non catégorisé'
    const famille = refToFamille[ligne.ar_ref] || ligne.fa_codefamille || 'Non catégorisé';
    caParFamille[famille] = (caParFamille[famille] || 0) + (ligne.dl_montantht || 0);
  });
  
  return Object.keys(caParFamille)
    .map((name) => ({ name, value: caParFamille[name] }))
    .sort((a, b) => b.value - a.value);
};
