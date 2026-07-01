import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* L'Layout principal kay-hwi ga3 l'pages */}
        <Route path="/" element={<MainLayout />}>
          {/* L'Index kay3ni l'page li kat-bda hia lowla (Dashboard) */}
          <Route index element={<Dashboard />} />
          
          {/* F l'mosta9bal, mli t-sayb pages khrin, ghadi tzidhom hna b7al haka: */}
          {/* <Route path="clients" element={<ClientsPage />} /> */}
          {/* <Route path="stock" element={<StockPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;