import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, Settings } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  // Liste dyal les menus (T9der tzid fihom mn b3d ki bghiti)
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Clients (À venir)', path: '/clients', icon: Users },
    { name: 'Stock (À venir)', path: '/stock', icon: Package },
    { name: 'Factures (À venir)', path: '/factures', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR (Fixe f liser) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo / Titre */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-600 tracking-wider">Pharma ERP</h2>
        </div>

        {/* Les Liens dyal Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Paramètres f lta7t ga3 */}
        <div className="p-4 border-t border-gray-200">
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            Paramètres
          </Link>
        </div>
      </aside>

      {/* ZONE DE CONTENU (Fin ghadi yt-afficha l'Dashboard) */}
      <main className="flex-1 overflow-y-auto">
        {/* L'Outlet hia l'blassa fin React Router kay-injecter l'page li khtariti */}
        <Outlet />
      </main>
    </div>
  );
}