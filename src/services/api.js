import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.5.199:8000/api';
const CLIENT_SCHEMA = 'dbo';
const SOURCE_TYPE = 'dblatest'; // No underscore - matches API spec

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const defaultPayload = {
  clientschema: CLIENT_SCHEMA,  // No underscore
  sourcetype: SOURCE_TYPE,      // No underscore
  limit: 5000,
};

export const fetchDocuments = async (domaine, types, dateFrom, dateTo) => {
  try {
    const payload = {
      ...defaultPayload,
      dodomaine: domaine,
      dotype: types,
      datefrom: dateFrom,
      dateto: dateTo,
    };
    const response = await apiClient.post('/referentiel/documents-entete', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchStock = async () => {
  try {
    const payload = { ...defaultPayload, qtemin: 0.01 };
    const response = await apiClient.post('/referentiel/stock-depot', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

export const fetchComptesTiers = async (type) => {
  try {
    const payload = { ...defaultPayload, cttype: [type] };
    const response = await apiClient.post('/referentiel/comptes-tiers', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching comptes tiers:', error);
    throw error;
  }
};

export const fetchCollaborateurs = async () => {
  try {
    const payload = { ...defaultPayload, covendeur: 1 };
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
      dodomaine: [0],
      dotype: [6, 7],
      datefrom: dateFrom,
      dateto: dateTo,
      withentete: true,
    };
    const response = await apiClient.post('/referentiel/documents-ligne', payload);
    return response.data?.data || [];
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
