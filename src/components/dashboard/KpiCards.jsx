import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Package, 
  AlertCircle, 
  RefreshCcw 
} from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value);
};

export const KpiCards = () => {
  const { data, loading } = useDashboard();

  const kpis = [
    {
      title: "Chiffre d'Affaires",
      value: formatCurrency(data.ca),
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-100"
    },
    {
      title: "Marge Brute",
      value: formatCurrency(data.margeBrute),
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      borderColor: "border-emerald-100"
    },
    {
      title: "Marge Nette (Comm.)",
      value: `${data.margeNette.toFixed(2)} %`,
      icon: Percent,
      color: "bg-indigo-50 text-indigo-600",
      borderColor: "border-indigo-100"
    },
    {
      title: "Valeur du Stock",
      value: formatCurrency(data.valeurStock),
      icon: Package,
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-100"
    },
    {
      title: "Encours Client",
      value: `${data.encoursClient.toFixed(2)} %`,
      icon: AlertCircle,
      color: "bg-orange-50 text-orange-600",
      borderColor: "border-orange-100"
    },
    {
      title: "Taux de Conversion",
      value: `${data.tauxConversion.toFixed(2)} %`,
      icon: RefreshCcw,
      color: "bg-cyan-50 text-cyan-600",
      borderColor: "border-cyan-100"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-2xl p-6 shadow-sm border ${kpi.borderColor} hover:shadow-md transition-shadow duration-300 relative overflow-hidden group`}
        >
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${kpi.color}`}>
              <kpi.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-transparent to-black opacity-0 group-hover:opacity-5 rounded-full transition-opacity duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};
