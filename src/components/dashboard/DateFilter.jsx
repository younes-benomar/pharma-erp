import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const DateFilter = () => {
  const { selectedYear, setSelectedYear, selectedMonths, setSelectedMonths } = useDashboard();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const toggleMonth = (index) => {
    if (selectedMonths.includes(index)) {
      setSelectedMonths(selectedMonths.filter(m => m !== index));
    } else {
      setSelectedMonths([...selectedMonths, index]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700">Année :</label>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex flex-wrap gap-2 justify-end">
        {MONTHS.map((month, index) => {
          const isSelected = selectedMonths.includes(index);
          return (
            <button
              key={month}
              onClick={() => toggleMonth(index)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {month.slice(0, 3)}
            </button>
          );
        })}
        {selectedMonths.length > 0 && (
          <button 
            onClick={() => setSelectedMonths([])}
            className="px-3 py-1.5 text-sm font-medium rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-all ml-2"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
};
