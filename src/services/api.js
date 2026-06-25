// ============================================================
//  PHARMA-ERP — Service Layer
//  When the real API is ready:
//    1. Set USE_MOCK = false
//    2. Set API_BASE_URL to the real endpoint
//    3. Done — no component needs to change.
// ============================================================
import {
  apiStockInitial,
  apiVentesMensuelles,
  articles,
  artStock,
  comptes,
  collaborateurs,
  familles,
  depots,
  docEntetes,
  docLignes,
} from '../data/mockData';

// FIX: Set USE_MOCK = false and point to the local API server.
const USE_MOCK      = false;
const API_BASE_URL  = 'http://localhost:3000';
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

const apiFetch = async (path) => {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  return res.json();
};

export const ERPService = {

  // ---- Stock (legacy, used by Dashboard / Stock page) ----
  getStock: async () => {
    if (USE_MOCK) { await delay(); return apiStockInitial; }
    return apiFetch('/api/stock');
  },

  // ---- Ventes chart ----
  getVentes: async () => {
    if (USE_MOCK) { await delay(); return apiVentesMensuelles; }
    return apiFetch('/api/ventes');
  },

  // ---- Articles ----
  getArticles: async () => {
    if (USE_MOCK) { await delay(); return articles; }
    return apiFetch('/api/articles');
  },

  getArticleByRef: async (ref) => {
    if (USE_MOCK) { await delay(300); return articles.find(a => a.ar_ref === ref) ?? null; }
    return apiFetch(`/api/articles/${ref}`);
  },

  // ---- Stock détaillé ----
  getArtStock: async () => {
    if (USE_MOCK) { await delay(); return artStock; }
    return apiFetch('/api/artstock');
  },

  // ---- Comptes (Clients + Fournisseurs) ----
  getComptes: async (type = null) => {
    if (USE_MOCK) {
      await delay();
      return type !== null ? comptes.filter(c => c.ct_type === type) : comptes;
    }
    const q = type !== null ? `?type=${type}` : '';
    return apiFetch(`/api/comptes${q}`);
  },

  getClients: async () => ERPService.getComptes(0),
  getFournisseurs: async () => ERPService.getComptes(1),

  // ---- Collaborateurs ----
  getCollaborateurs: async () => {
    if (USE_MOCK) { await delay(); return collaborateurs; }
    return apiFetch('/api/collaborateurs');
  },

  // ---- Familles ----
  getFamilles: async () => {
    if (USE_MOCK) { await delay(200); return familles; }
    return apiFetch('/api/familles');
  },

  // ---- Dépôts ----
  getDepots: async () => {
    if (USE_MOCK) { await delay(200); return depots; }
    return apiFetch('/api/depots');
  },

  // ---- Documents (entêtes) ----
  getDocuments: async (domaine = null, type = null) => {
    if (USE_MOCK) {
      await delay();
      let data = docEntetes;
      if (domaine !== null) data = data.filter(d => d.do_domaine === domaine);
      if (type    !== null) data = data.filter(d => d.do_type    === type);
      return data;
    }
    const params = new URLSearchParams();
    if (domaine !== null) params.set('domaine', domaine);
    if (type    !== null) params.set('type',    type);
    return apiFetch(`/api/documents?${params}`);
  },

  // ---- Lignes d'un document ----
  getDocLignes: async (piece) => {
    if (USE_MOCK) { await delay(300); return docLignes.filter(l => l.do_piece === piece); }
    return apiFetch(`/api/documents/${piece}/lignes`);
  },
};
