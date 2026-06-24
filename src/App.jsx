import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; 

import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import Magasins from './pages/Magasins';


import { ERPService } from './services/api';

export default function App() {
  const [estAuthentifie, setEstAuthentifie] = useState(localStorage.getItem('pharma_admin') === 'true');
  const [pageActuelle, setPageActuelle] = useState('dashboard');
  

  const [stock, setStock] = useState([]);
  const [ventes, setVentes] = useState([]);
  

  const [isLoading, setIsLoading] = useState(true);

  const dateAujourdhui = new Date('2026-06-24');

 
  useEffect(() => {
    if (estAuthentifie) {
      chargerDataInitiale();
    }
  }, [estAuthentifie]);

  const chargerDataInitiale = async () => {
    setIsLoading(true); 
    
    try {
      const [dataStock, dataVentes] = await Promise.all([
        ERPService.getStock(),
        ERPService.getVentes()
      ]);
      
      setStock(dataStock);
      setVentes(dataVentes);
    } catch (erreur) {
      console.error("Mouchkil f jban l-ma3loumat:", erreur);

    } finally {
      setIsLoading(false); 
    }
  };

  const handleLoginSuccess = () => {
    setEstAuthentifie(true);
    localStorage.setItem('pharma_admin', 'true');
  };

  const handleLogout = () => {
    setEstAuthentifie(false);
    localStorage.removeItem('pharma_admin');
  };

  if (!estAuthentifie) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar 
        pageActuelle={pageActuelle} 
        setPageActuelle={setPageActuelle} 
        gererDeconnexion={handleLogout} 
      />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {pageActuelle === 'dashboard' ? "Tableau de Bord Stratégique" : pageActuelle}
            </h2>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700">Admin Connecté</span>
          </div>
        </header>

        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Connexion au serveur ERP en cours...</p>
            </div>
          ) : (
            <>
              {pageActuelle === 'dashboard' && <Dashboard stock={stock} ventes={ventes} dateAujourdhui={dateAujourdhui} />}
              {pageActuelle === 'stock' && <Stock stock={stock} dateAujourdhui={dateAujourdhui} />}
              {pageActuelle === 'magasins' && <Magasins stock={stock} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}