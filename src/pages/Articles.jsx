import React, { useEffect, useState } from 'react';
import { Package, Search, Tag, ToggleLeft, ToggleRight, ChevronDown } from 'lucide-react';
import { ERPService } from '../services/api';

const SUIVI_LABELS = { 0:'Aucun', 1:'Sérialisé', 2:'CMUP', 3:'FIFO', 4:'LIFO', 5:'Par Lot' };

export default function Articles() {
  const [articles,  setArticles]  = useState([]);
  const [familles,  setFamilles]  = useState([]);
  const [artStock,  setArtStock]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filtreFam, setFiltreFam] = useState('TOUS');

  useEffect(() => {
    Promise.all([
      ERPService.getArticles(),
      ERPService.getFamilles(),
      ERPService.getArtStock(),
    ]).then(([a, f, s]) => {
      setArticles(a); setFamilles(f); setArtStock(s);
    }).finally(() => setLoading(false));
  }, []);

  const getQte = (ref) => artStock.find(s => s.ar_ref === ref)?.as_qtesto ?? '—';
  const getFamLibelle = (code) => familles.find(f => f.fa_codeFamille === code)?.fa_intitule ?? code;

  const filtered = articles.filter(a => {
    const matchSearch = a.ar_design.toLowerCase().includes(search.toLowerCase()) ||
                        a.ar_ref.toLowerCase().includes(search.toLowerCase());
    const matchFam = filtreFam === 'TOUS' || a.fa_codeFamille === filtreFam;
    return matchSearch && matchFam;
  });

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Chargement...</div>;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou référence…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="relative">
          <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
          <select
            value={filtreFam} onChange={e => setFiltreFam(e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            <option value="TOUS">Toutes les familles</option>
            {familles.map(f => <option key={f.fa_codeFamille} value={f.fa_codeFamille}>{f.fa_intitule}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <th className="p-4 font-medium">Référence</th>
              <th className="p-4 font-medium">Désignation</th>
              <th className="p-4 font-medium">Famille</th>
              <th className="p-4 font-medium text-right">Prix Achat</th>
              <th className="p-4 font-medium text-right">Prix Vente</th>
              <th className="p-4 font-medium text-right">Qté Stock</th>
              <th className="p-4 font-medium">Suivi</th>
              <th className="p-4 font-medium text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center p-10 text-slate-400">Aucun article trouvé.</td></tr>
            )}
            {filtered.map(a => (
              <tr key={a.ar_ref} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-xs text-slate-500 font-bold">{a.ar_ref}</td>
                <td className="p-4">
                  <p className="font-semibold text-slate-800">{a.ar_design}</p>
                  <p className="text-xs text-slate-400">{a.ar_codeBarre}</p>
                </td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit">
                    <Tag size={10}/> {getFamLibelle(a.fa_codeFamille)}
                  </span>
                </td>
                <td className="p-4 text-right font-medium text-slate-600">{a.ar_prixAch.toFixed(2)} MAD</td>
                <td className="p-4 text-right font-bold text-slate-800">{a.ar_prixVen.toFixed(2)} MAD</td>
                <td className="p-4 text-right font-black text-slate-700">{getQte(a.ar_ref)}</td>
                <td className="p-4 text-xs text-slate-500 font-medium">{SUIVI_LABELS[a.ar_suiviStock]}</td>
                <td className="p-4 text-center">
                  {a.ar_sommeil === 0
                    ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold"><ToggleRight size={12}/> Actif</span>
                    : <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-xs font-bold"><ToggleLeft size={12}/> Inactif</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 text-right">{filtered.length} article(s) affiché(s)</p>
    </div>
  );
}
