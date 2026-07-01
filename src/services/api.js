import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.5.199:8000/api';
const CLIENT_SCHEMA = 'dbo'; // The user's system expects 'dbo' based on old code
const SOURCE_TYPE = 'db_latest';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const defaultPayload = {
  client_schema: CLIENT_SCHEMA,
  source_type: SOURCE_TYPE,
  limit: 5000, // Maximum allowed limit to avoid 422 error
};

export const fetchDocuments = async (domaine, types, dateFrom, dateTo) => {
  try {
    const payload = {
      ...defaultPayload,
      do_domaine: domaine,
      do_type: types,
      date_from: dateFrom,
      date_to: dateTo,
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
    const payload = {
      ...defaultPayload,
      qte_min: 0.01, // Only items in stock
    };
    const response = await apiClient.post('/referentiel/stock-depot', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

export const fetchComptesTiers = async (type) => {
  try {
    const payload = {
      ...defaultPayload,
      ct_type: [type], // 0 for client
      // montant_regle_unpaid: true // if we want only unpaid, but we might want all to calculate limits
    };
    const response = await apiClient.post('/referentiel/comptes-tiers', payload);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching comptes tiers:', error);
    throw error;
  }
};

export const fetchCollaborateurs = async () => {
  try {
    const payload = {
      ...defaultPayload,
      co_vendeur: 1, // Get only vendors/commercials
    };
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
          do_domaine: [0], // Vente
          do_type: [6, 7], // Factures
          date_from: dateFrom,
          date_to: dateTo,
          with_entete: true
        };
        const response = await apiClient.post('/referentiel/documents-ligne', payload);
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching document lignes:', error);
        throw error;
      }
}

// Calculate CA (Total HT Net of Factures Vente)
export const calculateCA = (factures) => {
  return factures.reduce((sum, doc) => sum + (doc.do_totalhtnet || 0), 0);
};

// Calculate Marge Brute (CA - Achats)
export const calculateMargeBrute = (ca, facturesAchat) => {
  const totalAchats = facturesAchat.reduce((sum, doc) => sum + (doc.do_totalhtnet || 0), 0);
  return ca - totalAchats;
};

// Calculate Valeur du Stock
export const calculateValeurStock = (stockData) => {
  // Assuming stock data has as_qtesto and ar_prixach
  return stockData.reduce((sum, item) => {
      const qte = parseFloat(item.as_qtesto) || 0;
      const prixAch = parseFloat(item.ar_prixach || item.ar_punet) || 0;
      return sum + (qte * prixAch);
  }, 0);
};

// Calculate Taux de Conversion
export const calculateTauxConversion = (devis, factures) => {
  const nbDevis = devis.length;
  const nbFactures = factures.length;
  if (nbDevis === 0) return 0;
  return (nbFactures / nbDevis) * 100;
};

// CA by Famille
export const calculateCAByFamille = (lignesFacture) => {
    const caParFamille = {};
    lignesFacture.forEach(ligne => {
        const famille = ligne.fa_codefamille || 'Non catégorisé';
        const montant = ligne.dl_montantht || 0;
        if (!caParFamille[famille]) {
            caParFamille[famille] = 0;
        }
        caParFamille[famille] += montant;
    });
    
    return Object.keys(caParFamille).map(name => ({
        name,
        value: caParFamille[name]
    })).sort((a, b) => b.value - a.value); // Sort descending
};
