import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.5.199:8000/api';

// TODO: Replace 'dbo' with your actual PostgreSQL schema name
const CLIENT_SCHEMA = import.meta.env.VITE_CLIENT_SCHEMA || 'dbo';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// DocEnteteRequest uses: client_schema, source_type, do_domaine, do_type, date_from, date_to (WITH underscores)
export const fetchDocuments = async (domaine, types, dateFrom, dateTo) => {
  try {
    const payload = {
      client_schema: CLIENT_SCHEMA,
      source_type: 'db_latest',
      limit: 5000,
      do_domaine: domaine,
      do_type: types,
      date_from: dateFrom,
      date_to: dateTo,
    };
    const response = await apiClient.post('/referentiel/documents-entete', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching documents:', error.response?.data || error.message);
    throw error;
  }
};

// StockDepotRequest uses: clientschema, sourcetype, qtemin (NO underscores)
export const fetchStock = async () => {
  try {
    const payload = {
      clientschema: CLIENT_SCHEMA,
      sourcetype: 'dblatest',
      limit: 5000,
      qtemin: 0.01,
    };
    const response = await apiClient.post('/referentiel/stock-depot', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching stock:', error.response?.data || error.message);
    throw error;
  }
};

// ComptesTiersRequest - check swagger for exact field names
export const fetchComptesTiers = async (type) => {
  try {
    const payload = {
      client_schema: CLIENT_SCHEMA,
      source_type: 'db_latest',
      limit: 5000,
      ct_type: [type],
    };
    const response = await apiClient.post('/referentiel/comptes-tiers', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching comptes tiers:', error.response?.data || error.message);
    throw error;
  }
};

// CollaborateurRequest - check swagger for exact field names
export const fetchCollaborateurs = async () => {
  try {
    const payload = {
      client_schema: CLIENT_SCHEMA,
      source_type: 'db_latest',
      limit: 5000,
      co_vendeur: 1,
    };
    const response = await apiClient.post('/referentiel/collaborateurs', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching collaborateurs:', error.response?.data || error.message);
    throw error;
  }
};

// DocLigneRequest uses same convention as DocEnteteRequest
export const fetchLignesFacture = async (dateFrom, dateTo) => {
  try {
    const payload = {
      client_schema: CLIENT_SCHEMA,
      source_type: 'db_latest',
      limit: 5000,
      do_domaine: [0],
      do_type: [6, 7],
      date_from: dateFrom,
      date_to: dateTo,
      with_entete: true,
    };
    const response = await apiClient.post('/referentiel/documents-ligne', payload);
    return response.data?.data || [];
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
    const famille = ligne.fa_codefamille || 'Non catégorisé';
    caParFamille[famille] = (caParFamille[famille] || 0) + (ligne.dl_montantht || 0);
  });
  return Object.keys(caParFamille)
    .map((name) => ({ name, value: caParFamille[name] }))
    .sort((a, b) => b.value - a.value);
};
