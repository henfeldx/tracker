import React from 'react';
import { Check } from 'lucide-react';
import { ETAPAS_RASTREIO } from '../types/rastreio';

interface BarraProgressoProps {
  etapaAtual: number; // 0 a 5
}

export const BarraProgresso: React.FC<BarraProgressoProps> = ({ etapaAtual }) => {
  const totalEtapas = ETAPAS_RASTREIO.length;
  // Percentual preenchido da barra entre o primeiro (0%) e o último nó (100%)
  const percentualProgresso = Math.min(
    100,
    Math.max(0, (etapaAtual / (totalEtapas - 1)) * 100)
  );

  return (
    <div 
      className="w-full bg-branco rounded-2xl p-6 sm:p-8 border border-gelo-borda shadow-suave"
      role="region"
      aria-label="Progresso da entrega do pedido"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-serif font-semibold text-navy">
          Etapas da Entrega
        </h2>
        <span className="text-xs sm:text-sm font-medium text-navy/70 bg-gelo px-3 py-1 rounded-full">
          Etapa {etapaAtual + 1} de {totalEtapas}
        </span>
      </div>

      <div className="relative">
        {/* Linha de Conexão de Fundo (Pendente) */}
        <div 
          className="absolute top-4 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 h-1 bg-gelo-escuro -translate-y-1/2 z-0 rounded-full"
          aria-hidden="true"
        />

        {/* Linha de Conexão Ativa (Navy) */}
        <div 
          className="absolute top-4 sm:top-5 left-3 sm:left-6 h-1 bg-navy -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `calc(${percentualProgresso}% * (100% - 24px) / 100)` }}
          aria-hidden="true"
        />

        {/* Lista de Etapas */}
        <ol 
          className="relative z-10 flex items-start justify-between w-full"
          aria-label="Passos do envio"
        >
          {ETAPAS_RASTREIO.map((etapa) => {
            const isConcluida = etapa.indice < etapaAtual;
            const isAtiva = etapa.indice === etapaAtual;

            return (
              <li 
                key={etapa.chave} 
                className="flex flex-col items-center text-center flex-1 min-w-0 px-1"
                aria-current={isAtiva ? 'step' : undefined}
              >
                {/* Marcador Circular */}
                <div 
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isConcluida 
                      ? 'bg-navy text-branco shadow-sm ring-4 ring-branco' 
                      : isAtiva 
                      ? 'bg-navy text-branco shadow-card ring-4 ring-navy/20 scale-110' 
                      : 'bg-gelo text-navy/40 border border-gelo-borda ring-4 ring-branco'
                  }`}
                  aria-hidden="true"
                >
                  {isConcluida ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold">
                      {etapa.indice + 1}
                    </span>
                  )}
                </div>

                {/* Texto da Etapa */}
                <span 
                  className={`mt-2.5 sm:mt-3 text-[11px] sm:text-xs leading-tight transition-colors ${
                    isAtiva 
                      ? 'font-bold text-navy' 
                      : isConcluida 
                      ? 'font-medium text-navy/90' 
                      : 'text-navy/40 font-normal'
                  }`}
                >
                  {etapa.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
