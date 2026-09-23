import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import { LOJA_URL } from '../config';

export const Cabecalho: React.FC = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const isRastrearAtivo = location.pathname === '/' || location.pathname.startsWith('/rastreio');

  return (
    <header className="bg-navy text-branco shadow-card sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo e Wordmark Whitefield & Co. */}
          <Link 
            to="/" 
            className="flex items-center gap-3.5 focus-visible:ring-2 focus-visible:ring-branco focus-visible:ring-offset-2 focus-visible:ring-offset-navy rounded-sm outline-none transition-opacity hover:opacity-95"
            aria-label="Whitefield & Co. - Ir para a página inicial"
          >
            <img 
              src="/logo.png" 
              alt="Whitefield & Co." 
              className="h-10 w-auto object-contain brightness-0 invert opacity-95 transition-transform duration-200"
            />
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-branco">
              Whitefield &amp; Co.
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação Principal">
            <Link
              to="/"
              className={`text-sm font-medium py-2 relative transition-colors ${
                isRastrearAtivo 
                  ? 'text-branco font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-branco' 
                  : 'text-gelo-escuro hover:text-branco'
              }`}
            >
              Rastrear pedido
            </Link>

            <a
              href={LOJA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium py-2 inline-flex items-center gap-1.5 text-gelo-escuro hover:text-branco transition-colors group relative hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-branco"
              aria-label="Ver mais produtos na loja Whitefield (abre em nova aba)"
            >
              <span>Ver mais produtos</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </nav>

          {/* Botão Hambúrguer Mobile */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2.5 rounded-lg text-branco hover:bg-navy-claro transition-colors focus-visible:ring-2 focus-visible:ring-branco"
              aria-expanded={menuAberto}
              aria-label={menuAberto ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            >
              {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Painel Recolhível Mobile */}
      {menuAberto && (
        <div className="md:hidden bg-navy-claro border-t border-navy/40 px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMenuAberto(false)}
            className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
              isRastrearAtivo ? 'bg-navy text-branco font-semibold' : 'text-gelo hover:bg-navy/50'
            }`}
          >
            Rastrear pedido
          </Link>

          <a
            href={LOJA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuAberto(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-gelo hover:bg-navy/50 hover:text-branco transition-colors"
          >
            <span>Ver mais produtos</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
        </div>
      )}
    </header>
  );
};
