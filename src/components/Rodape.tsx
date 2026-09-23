import React from 'react';
import { ExternalLink, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';
import { CONFIG_SUPORTE, LOJA_URL } from '../config';

export const Rodape: React.FC = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-navy text-branco mt-auto border-t border-navy-claro/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          
          {/* Marca & Wordmark */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Whitefield & Co." 
                className="h-8 w-auto brightness-0 invert opacity-90"
              />
              <span className="font-serif text-2xl font-semibold tracking-wide text-branco">
                {CONFIG_SUPORTE.nome}
              </span>
            </div>
            <p className="text-sm text-gelo/80 leading-relaxed max-w-sm">
              Rastreamento oficial de remessas e encomendas com acompanhamento logístico em tempo real.
            </p>
            <div className="flex items-center gap-2 text-xs text-gelo/70 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ambiente de consulta criptografado e seguro</span>
            </div>
          </div>

          {/* Atendimento & Suporte */}
          <div className="space-y-3.5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gelo-escuro">
              Canais de Atendimento
            </h2>
            <ul className="space-y-2.5 text-sm text-gelo/90">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gelo-escuro flex-shrink-0" />
                <a 
                  href={`mailto:${CONFIG_SUPORTE.email}`} 
                  className="hover:underline focus-visible:ring-1 focus-visible:ring-branco rounded-sm transition-colors"
                >
                  {CONFIG_SUPORTE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gelo-escuro flex-shrink-0" />
                <a 
                  href={`tel:${CONFIG_SUPORTE.telefone.replace(/\D/g, '')}`} 
                  className="hover:underline focus-visible:ring-1 focus-visible:ring-branco rounded-sm transition-colors"
                >
                  {CONFIG_SUPORTE.telefone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1 text-xs text-gelo/75">
                <Clock className="w-4 h-4 text-gelo-escuro flex-shrink-0 mt-0.5" />
                <span>{CONFIG_SUPORTE.horario}</span>
              </li>
            </ul>
          </div>

          {/* Links Úteis */}
          <div className="space-y-3.5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gelo-escuro">
              Navegação
            </h2>
            <ul className="space-y-2 text-sm text-gelo/90">
              <li>
                <a 
                  href="/" 
                  className="hover:underline transition-colors block py-1 focus-visible:ring-1 focus-visible:ring-branco rounded-sm"
                >
                  Rastrear pedido
                </a>
              </li>
              <li>
                <a 
                  href={LOJA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline transition-colors py-1 focus-visible:ring-1 focus-visible:ring-branco rounded-sm"
                  aria-label="Ver mais produtos na loja oficial Whitefield & Co. (abre em nova aba)"
                >
                  <span>Ver mais produtos</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Divisória e Copyright */}
        <div className="mt-12 pt-8 border-t border-navy-claro/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gelo/60">
          <p>
            &copy; {anoAtual} {CONFIG_SUPORTE.nome}. Todos os direitos reservados.
          </p>
          <p>
            Portal logístico integrado de entrega de produtos.
          </p>
        </div>
      </div>
    </footer>
  );
};
