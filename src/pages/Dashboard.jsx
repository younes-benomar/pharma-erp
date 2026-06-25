import React from 'react';
import { TrendingUp, AlertOctagon, Clock } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { COULEURS_PIE } from '../data/mockData';

// FIX: ventes is now received as a prop from App.jsx (live API data),
// instead of being imported directly from mockData.
export default function Dashboard({ stock, ventes, dateAujourdhui }) {
  const genererDataFamilles = () => {
    const kounachFamilles = {};
    stock.forEach(item => {
      kounachFamilles[item.famille] = (kounachFamilles[item.famille] || 0) + (item.quantite * item.prix_vente);
    });
    return Object.keys(kounachFamilles).map(famille => ({ name: famille, value: kounachFamilles[famille] }));
  };

  const dataFamilles = genererDataFamilles();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Bénéfice Net (Mois)</p>
            <h3 className="text-2xl font-black text-slate-800">11,500 MAD</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-4 bg-red-50 rounded-xl text-red-600"><AlertOctagon size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Alertes Rupture</p>
            <h3 className="text-2xl font-black text-slate-800">
              {stock.filter(s => s.quantite <= s.seuil_alerte).length} Produits
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-l-4 border-l-orange-500">
          <div className="p-4 bg-orange-50 rounded-xl text-orange-600"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Risque Péremption</p>
            <h3 className="text-2xl font-black text-slate-800">
              {stock.filter(s => (new Date(s.peremption) - dateAujourdhui) / 86400000 < 90).length} Produits
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Évolution Financière</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ventes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" name="Chiffre d'Affaire" dataKey="chiffre_affaire" stroke="#94a3b8" fill="#f1f5f9" strokeWidth={2} />
                <Area type="monotone" name="Bénéfice Net" dataKey="benefice" stroke="#10b981" fill="#d1fae5" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Valeur Stock par Famille</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataFamilles} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dataFamilles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COULEURS_PIE[index % COULEURS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} MAD`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
