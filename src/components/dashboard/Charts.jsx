import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export const Charts = () => {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-pulse">
        <div className="h-96 bg-gray-100 rounded-2xl"></div>
        <div className="h-96 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-MA', { notation: "compact", compactDisplay: "short" }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* CA par Famille */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Chiffre d'Affaires par Famille</h3>
        <div className="h-72">
          {data.caParFamille.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.caParFamille}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.caParFamille.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip formatter={(value) => formatCurrency(value) + ' MAD'} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">Aucune donnée disponible</div>
          )}
        </div>
      </div>

      {/* CA par Commercial */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Chiffre d'Affaires par Commercial</h3>
        <div className="h-72">
          {data.caParCommercial.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.caParCommercial} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="nom" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={formatCurrency} />
                <BarTooltip cursor={{fill: '#f3f4f6'}} formatter={(value) => formatCurrency(value) + ' MAD'} />
                <Bar dataKey="ca" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {data.caParCommercial.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-400">Aucune donnée disponible</div>
          )}
        </div>
      </div>

    </div>
  );
};
