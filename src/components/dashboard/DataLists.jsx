import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Trophy, Clock, ArrowRight } from 'lucide-react';

export const DataLists = () => {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        <div className="h-96 bg-gray-100 rounded-2xl"></div>
        <div className="h-96 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Top Clients */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top 10 Clients
          </h3>
        </div>
        
        <div className="flex-1 overflow-auto">
          {data.topClients.length > 0 ? (
            <ul className="space-y-4">
              {data.topClients.map((client, index) => (
                <li key={client.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{client.nom}</p>
                      <p className="text-xs text-gray-500">ID: {client.id}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(client.ca)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 pb-10">Aucun client trouvé</div>
          )}
        </div>
      </div>

      {/* Éléments en attente */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            Éléments en Attente
          </h3>
        </div>
        
        <div className="flex-1 overflow-auto">
          {data.enAttente.length > 0 ? (
            <ul className="space-y-4">
              {data.enAttente.map((item, index) => (
                <li key={item.id} className="p-4 border border-red-100 bg-red-50/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">Facture Impayée</span>
                      <span className="text-sm font-medium text-gray-900">{item.id}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.client}</p>
                    <p className="text-xs text-gray-500 mt-1">Date: {new Date(item.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Reste à payer</p>
                    <p className="font-bold text-red-600">{formatCurrency(item.resteAPayer)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-400 pb-10">Aucun élément en attente</div>
          )}
        </div>
      </div>

    </div>
  );
};
