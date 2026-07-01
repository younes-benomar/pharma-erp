import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import { DateFilter } from '../components/dashboard/DateFilter';
import { KpiCards } from '../components/dashboard/KpiCards';
import { Charts } from '../components/dashboard/Charts';
import { DataLists } from '../components/dashboard/DataLists';
import { Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
                  <Activity className="w-6 h-6" />
                </div>
                Tableau de Bord
              </h1>
              <p className="text-gray-500 mt-1 ml-11">Aperçu en temps réel des performances de l'entreprise</p>
            </div>
          </header>

          <main>
            <DateFilter />
            <KpiCards />
            <Charts />
            <DataLists />
          </main>
          
        </div>
      </div>
    </DashboardProvider>
  );
}