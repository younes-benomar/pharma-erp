import React from 'react';
import { AlertOctagon, AlertTriangle, Clock, Activity } from 'lucide-react';

export default function Stock({ stock, dateAujourdhui }) {
  const getStatutProduit = (produit) => {
    const differenceJours = (new Date(produit.peremption) - dateAujourdhui) / (1000 * 60 * 60 * 24);
    if (produit.quantite === 0) return { label: 'Rupture', couleur: 'bg-red-100 text-red-700', icon: AlertOctagon };
    if (produit.quantite <= produit.seuil_alerte) return { label: 'Stock Faible', couleur: 'bg-orange-100 text-orange-700', icon: AlertTriangle };
    if (differenceJours < 0) return { label: 'Périmé !', couleur: 'bg-red-600 text-white', icon: Clock };
    if (differenceJours < 90) return { label: 'Expire Bientôt', couleur: 'bg-yellow-100 text-yellow-800', icon: Clock };
    return { label: 'Normal', couleur: 'bg-green-100 text-green-700', icon: Activity };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800">Contrôle des Stocks</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nouveau Produit
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
            <th className="p-4 font-medium">Médicament / Produit</th>
            <th className="p-4 font-medium">Famille</th>
            <th className="p-4 font-medium">Magasin</th>
            <th className="p-4 font-medium">Quantité</th>
            <th className="p-4 font-medium text-right">Statut IA</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((produit) => {
            const statut = getStatutProduit(produit);
            const IconeStatut = statut.icon;
            return (
              <tr key={produit.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{produit.nom}</p>
                  <p className="text-xs text-slate-400 font-medium">Péremption: {produit.peremption}</p>
                </td>
                <td className="p-4 text-slate-600 font-medium">{produit.famille}</td>
                <td className="p-4 text-slate-500 font-medium">{produit.magasin}</td>
                <td className="p-4">
                  <span className="font-black text-slate-700 text-lg">{produit.quantite}</span>
                  <span className="text-xs text-slate-400 ml-1 font-medium">/ seuil: {produit.seuil_alerte}</span>
                </td>
                <td className="p-4 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${statut.couleur}`}>
                    <IconeStatut size={14} /> {statut.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}