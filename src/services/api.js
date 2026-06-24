// src/services/api.js
import { apiStockInitial, apiVentesMensuelles } from '../data/mockData';


const USE_MOCK = true; 

const API_BASE_URL = ''; 

export const ERPService = {
  
  getStock: async () => {
    if (USE_MOCK) {

        return new Promise(resolve => setTimeout(() => resolve(apiStockInitial), 800));
    }
    
    const reponse = await fetch(`${API_BASE_URL}/stock`);
    if (!reponse.ok) throw new Error("Erreur Réseau");
    return reponse.json();
  },


  getVentes: async () => {
    if (USE_MOCK) {
      return new Promise(resolve => setTimeout(() => resolve(apiVentesMensuelles), 800));
    }
    
    const reponse = await fetch(`${API_BASE_URL}/ventes`);
    if (!reponse.ok) throw new Error("Erreur Réseau");
    return reponse.json();
  }
};