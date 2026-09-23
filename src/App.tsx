import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Cabecalho } from './components/Cabecalho';
import { Rodape } from './components/Rodape';
import { Busca } from './pages/Busca';
import { Rastreio } from './pages/Rastreio';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-branco font-sans antialiased text-navy">
      <Cabecalho />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Busca />} />
          <Route path="/rastreio/:codigo" element={<Rastreio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Rodape />
    </div>
  );
};

export default App;
