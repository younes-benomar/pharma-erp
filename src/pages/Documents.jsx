import React, { useEffect, useState } from 'react';
import { FileText, ChevronDown, Eye, X } from 'lucide-react';
import { ERPService } from '../services/api';

const DOMAINE_LABELS = { 0: 'Vente', 1: 'Achat', 2: 'Stock', 3: 'Ticket', 4: 'Interne' };
const TYPE_LABELS = {
  0:'Devis', 1:'Bon de Commande', 2:'Prépa. Livraison', 3:'Bon de Livraison',
  4:'Bon de Retour', 5:"Bon d'Avoir", 6:'Facture', 7:'Facture Comptab.',
  10:'Demande Achat', 11:'Prépa. Commande', 12:'Bon de Commande',
  13:'Bon de Livraison', 14:'Bon de Retour', 15:"Bon d'Avoir", 16:'Facture', 17:'Facture Comptab.',
};
const DOMAINE_COLORS = {
  0: 'bg-blue-100 text-blue-700',
  1: 'bg-violet-100 text-violet-700',
};

export default function Documents() {
  const [docs,    setDocs]    = useState([]);
  const [comptes, setComptes] = useState([]);
  const [collab,  setCollab]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre,  setFiltre]  = useState('ALL'); // ALL | 0 | 1
  const [selected,setSelected]= useState(null); // selected doc for detail panel
  const [lignes,  setLignes]  = useState([]);
  const [lignesLoading, setLignesLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      ERPService.getDocuments(),
      ERPService.getComptes(),
      ERPService.getCollaborateurs(),
    ]).then(([d, c, col]) => { setDocs(d); setComptes(c); setCollab(col); })
    .finally(() => setLoading(false));
  }, []);

  const openDetail = async (doc) => {
    setSelected(doc);
    setLignesLoading(true);
    const l = await ERPService.getDocLignes(doc.do_piece);
    setLignes(l);
    setLignesLoading(false);
  };

  const getTiers = (num) => comptes.find(c => c.ct_num === num)?.ct_intitule ?? num;
  const getCollab = (no) => {
    const c = collab.find(c => c.co_no === no);
    return c ? `${c.co_prenom} ${c.co_nom}` : '—';
  };

  const filtered = docs.filter(d => filtre === 'ALL' || d.do_domaine === Number(filtre));

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Chargement...</div>;

  return (
    <div className="flex gap-6">
      {/* Main list */}
      <div className="flex-1 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filtre} onChange={e => setFiltre(e.target.value)}
              className="appearance-none border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="ALL">Tous les domaines</option>
              <option value="0">Ventes</option>
              <option value="1">Achats</option>
            </select>
          </div>
          <span className="text-sm text-slate-400">{filtered.length} document(s)</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <th className="p-4 font-medium">N° Pièce</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Tiers</th>
                <th className="p-4 font-medium">Représentant</th>
                <th className="p-4 font-medium text-right">Total TTC</th>
                <th className="p-4 font-medium text-right">Réglé</th>
                <th className="p-4 font-medium text-center">Détail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => {
                const reste = doc.do_totalTTC - doc.do_montantRegle;
                return (
                  <tr
                    key={doc.do_piece}
                    className={`border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                      selected?.do_piece === doc.do_piece ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="p-4 font-mono text-xs font-bold text-slate-700">{doc.do_piece}</td>
                    <td className="p-4 text-slate-500">{doc.do_date}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DOMAINE_COLORS[doc.do_domaine]}`}>
                          {DOMAINE_LABELS[doc.do_domaine]}
                        </span>
                        <p className="text-xs text-slate-500">{TYPE_LABELS[doc.do_type]}</p>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{getTiers(doc.do_tiers)}</td>
                    <td className="p-4 text-slate-500 text-xs">{getCollab(doc.co_no)}</td>
                    <td className="p-4 text-right font-bold text-slate-800">{doc.do_totalTTC.toLocaleString()} MAD</td>
                    <td className="p-4 text-right">
                      {reste === 0
                        ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Soldé ✓</span>
                        : <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{reste.toLocaleString()} MAD</span>
                      }
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => openDetail(doc)} className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Eye size={16}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-fit sticky top-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={16}/> {selected.do_piece}</h4>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
              <X size={18}/>
            </button>
          </div>
          <div className="text-sm space-y-1 text-slate-600">
            <p><span className="font-semibold">Tiers:</span> {getTiers(selected.do_tiers)}</p>
            <p><span className="font-semibold">Date:</span> {selected.do_date}</p>
            <p><span className="font-semibold">HT:</span> {selected.do_totalHT.toLocaleString()} MAD</p>
            <p><span className="font-semibold">TTC:</span> {selected.do_totalTTC.toLocaleString()} MAD</p>
            <p><span className="font-semibold">Réglé:</span> {selected.do_montantRegle.toLocaleString()} MAD</p>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Lignes du document</p>
            {lignesLoading
              ? <p className="text-xs text-slate-400 animate-pulse">Chargement…</p>
              : lignes.length === 0
                ? <p className="text-xs text-slate-400">Aucune ligne.</p>
                : <div className="space-y-2">
                    {lignes.map((l, i) => (
                      <div key={i} className="text-xs bg-slate-50 rounded-xl p-2">
                        <p className="font-semibold text-slate-700">{l.dl_design}</p>
                        <p className="text-slate-500">{l.dl_qte} × {l.dl_prixUnitaire} MAD = <span className="font-bold text-slate-700">{l.dl_montantHT} MAD</span></p>
                      </div>
                    ))}
                  </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}
