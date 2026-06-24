import React, { useEffect, useState } from 'react';
import { Users, Building2, Search, Phone, Mail, MapPin, UserCheck } from 'lucide-react';
import { ERPService } from '../services/api';

const TYPE_LABELS = { 0: 'Client', 1: 'Fournisseur', 2: 'Salarié', 3: 'Autre' };
const TYPE_COLORS = {
  0: 'bg-emerald-100 text-emerald-700',
  1: 'bg-violet-100 text-violet-700',
  2: 'bg-sky-100 text-sky-700',
  3: 'bg-slate-100 text-slate-600',
};

export default function Comptes() {
  const [comptes,  setComptes]  = useState([]);
  const [collab,   setCollab]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [onglet,   setOnglet]   = useState(0); // 0=Clients, 1=Fournisseurs
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    Promise.all([
      ERPService.getComptes(),
      ERPService.getCollaborateurs(),
    ]).then(([c, col]) => { setComptes(c); setCollab(col); })
    .finally(() => setLoading(false));
  }, []);

  const getCollab = (no) => collab.find(c => c.co_no === no);

  const filtered = comptes.filter(c => {
    const matchType   = c.ct_type === onglet;
    const matchSearch = c.ct_intitule.toLowerCase().includes(search.toLowerCase()) ||
                        c.ct_num.toLowerCase().includes(search.toLowerCase()) ||
                        c.ct_ville.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Chargement...</div>;

  return (
    <div className="space-y-5">
      {/* Onglets */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {[{ label: 'Clients', icon: Users }, { label: 'Fournisseurs', icon: Building2 }].map(({ label, icon: Icon }, i) => (
          <button
            key={i} onClick={() => { setOnglet(i); setSearch(''); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              onglet === i ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={16}/> {label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              onglet === i ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {comptes.filter(c => c.ct_type === i).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <p className="col-span-3 text-center text-slate-400 py-10">Aucun compte trouvé.</p>
        )}
        {filtered.map(c => {
          const rep = getCollab(c.co_no);
          return (
            <div key={c.ct_num} className={`bg-white rounded-2xl border shadow-sm p-5 space-y-3 ${
              c.ct_sommeil ? 'opacity-50 border-slate-100' : 'border-slate-100 hover:shadow-md transition-shadow'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800">{c.ct_intitule}</h4>
                  <p className="text-xs font-mono text-slate-400">{c.ct_num}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${TYPE_COLORS[c.ct_type]}`}>
                  {TYPE_LABELS[c.ct_type]}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p className="flex items-center gap-2"><Users size={13} className="text-slate-400"/> {c.ct_contact}</p>
                <p className="flex items-center gap-2"><Phone size={13} className="text-slate-400"/> {c.ct_telephone}</p>
                <p className="flex items-center gap-2"><Mail  size={13} className="text-slate-400"/> {c.ct_email}</p>
                <p className="flex items-center gap-2"><MapPin size={13} className="text-slate-400"/> {c.ct_ville}</p>
              </div>
              {rep && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                  <UserCheck size={13} className="text-blue-400"/>
                  <span>Référent: <span className="font-semibold text-slate-700">{rep.co_prenom} {rep.co_nom}</span></span>
                </div>
              )}
              {c.ct_sommeil === 1 && (
                <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-medium">En sommeil</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
