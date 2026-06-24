import React from 'react';
import { LayoutDashboard, AlertTriangle, Store, Pill, LogOut, Package, Users, FileText } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard',  label: "Vue d'ensemble",     icon: LayoutDashboard },
  { key: 'stock',      label: 'Inventaire & Alertes', icon: AlertTriangle   },
  { key: 'articles',   label: 'Articles',             icon: Package         },
  { key: 'comptes',    label: 'Clients & Fournisseurs',icon: Users          },
  { key: 'documents',  label: 'Documents',            icon: FileText        },
  { key: 'magasins',   label: 'Gestion Magasins',     icon: Store           },
];

export default function Sidebar({ pageActuelle, setPageActuelle, gererDeconnexion }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2 text-blue-700 mt-2">
          <Pill size={28} />
          <h1 className="text-2xl font-black tracking-tight">PharmaERP</h1>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setPageActuelle(key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm ${
                pageActuelle === key
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={gererDeconnexion}
          className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors font-bold text-sm"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
