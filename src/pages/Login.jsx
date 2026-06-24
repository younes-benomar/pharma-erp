import React, { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreurAuth, setErreurAuth] = useState('');

  const gererConnexion = (e) => {
    e.preventDefault();
    if (email === 'admin@pharma.com' && password === '123456') {
      onLoginSuccess();
    } else {
      setErreurAuth('Identifiants incorrects. Accès refusé.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-blue-50 rounded-full text-blue-600">
            <Lock size={36} />
          </div>
        </div>
        <h1 className="text-3xl font-black text-center text-slate-800 mb-2 tracking-tight">PharmaERP</h1>
        <p className="text-center text-slate-500 mb-8 font-medium">Accès restreint aux administrateurs</p>
        
        <form onSubmit={gererConnexion} className="space-y-5">
          {erreurAuth && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100 flex items-center justify-center gap-2">
              <AlertTriangle size={16} /> {erreurAuth}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Adresse Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pharma.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-2 shadow-sm shadow-blue-200">
            Déverrouiller le système
          </button>
        </form>
      </div>
    </div>
  );
}