import React from 'react';
import { Store, ArrowRightLeft } from 'lucide-react';

export default function Magasins({ stock }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Store size={24}/></div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Succursale Maarif</h3>
              <p className="text-sm text-slate-500 font-medium">Casablanca Centre</p>
            </div>
          </div>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">Actif</span>
        </div>
        <div className="space-y-3">
          {stock.filter(s => s.magasin === 'Maarif').map(produit => (
            <div key={produit.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
              <span className="font-medium text-slate-700">{produit.nom}</span>
              <span className="font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">{produit.quantite} en stock</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-t-blue-500">
        <h3 className="font-bold text-lg text-slate-800 mb-2">Transfert Inter-Magasins</h3>
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Produit à transférer</label>
            <select className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700">
              <option>Doliprane 1000mg (Maarif)</option>
              <option>Whey Protein (Ain Sebaa)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">De</label>
              <input disabled value="Maarif" className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 text-slate-500 font-medium" />
            </div>
            <div className="pt-6 text-slate-400"><ArrowRightLeft size={24} /></div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Vers</label>
              <select className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700">
                <option>Ain Sebaa</option>
              </select>
            </div>
          </div>
          <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl transition-all mt-4 flex justify-center items-center gap-2 shadow-sm">
            <ArrowRightLeft size={18} /> Valider le Transfert
          </button>
        </div>
      </div>
    </div>
  );
}