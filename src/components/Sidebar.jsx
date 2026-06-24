import React from 'react';
import { LayoutDashboard, AlertTriangle, Store, Pill, LogOut } from 'lucide-react';

export default function Sidebar({ pageActuelle, setPageActuelle, gererDeconnexion }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2 text-blue-700 mt-2">
          <Pill size={28} />
          <h1 className="text-2xl font-black tracking-tight">PharmaERP</h1>
        </div>
        
        <nav className="space-y-2">
          <button onClick={() => setPageActuelle('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${pageActuelle === 'dashboard' ? 'text-blue-700 bg-blue-50 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
            <LayoutDashboard size={20} /> Vue d'ensemble
          </button>
          <button onClick={() => setPageActuelle('stock')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${pageActuelle === 'stock' ? 'text-blue-700 bg-blue-50 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
            <AlertTriangle size={20} /> Inventaire & Alertes
          </button>
          <button onClick={() => setPageActuelle('magasins')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${pageActuelle === 'magasins' ? 'text-blue-700 bg-blue-50 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Store size={20} /> Gestion Magasins
          </button>
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-4">
        <button onClick={gererDeconnexion} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors font-bold">
          <LogOut size={20} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}