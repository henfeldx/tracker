import React from 'react';
import { Calendar, MapPin, CircleDot, CheckCircle2 } from 'lucide-react';
import { EventoRastreio } from '../types/rastreio';

interface LinhaDoTempoProps {
  eventos: EventoRastreio[];
}

export const LinhaDoTempo: React.FC<LinhaDoTempoProps> = ({ eventos }) => {
  return (
    <div 
      className="bg-branco rounded-2xl p-6 sm:p-8 border border-gelo-borda shadow-suave"
      role="region"
      aria-label="Histórico de movimentação da encomenda"
    >
      <div className="flex items-center justify-between pb-5 border-b border-gelo-borda mb-6">
        <h2 className="text-base sm:text-lg font-serif font-semibold text-navy">
          Histórico de Rastreamento
        </h2>
        <span className="text-xs text-navy/60 font-medium">
          {eventos.length} {eventos.length === 1 ? 'atualização' : 'atualizações'}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gelo-escuro">
        {eventos.map((evento, index) => {
          const isPrimeiro = index === 0;

          return (
            <div 
              key={evento.id} 
              className={`relative group ${
                evento.destaque || isPrimeiro ? 'opacity-100' : 'opacity-90'
              }`}
            >
              {/* Marcador na linha */}
              <div 
                className={`absolute -left-[30px] sm:-left-[38px] top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ring-4 ring-branco transition-transform ${
                  evento.destaque || isPrimeiro
                    ? 'bg-navy text-branco shadow-md scale-105'
                    : 'bg-gelo text-navy/50 border border-gelo-borda'
                }`}
                aria-hidden="true"
              >
                {evento.destaque || isPrimeiro ? (
                  <CircleDot className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-navy/60" />
                )}
              </div>

              {/* Conteúdo do Evento */}
              <div 
                className={`rounded-xl p-4 sm:p-5 transition-all ${
                  evento.destaque || isPrimeiro
                    ? 'bg-gelo/80 border border-gelo-borda shadow-xs'
                    : 'bg-transparent border border-transparent'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-navy/80">
                    <Calendar className="w-3.5 h-3.5 text-navy/60" />
                    <time dateTime={evento.data}>{evento.data}</time>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-medium text-navy/70 bg-branco px-2.5 py-1 rounded-md border border-gelo-borda shadow-2xs">
                    <MapPin className="w-3 h-3 text-navy/60" />
                    <span>{evento.local}</span>
                  </div>
                </div>

                <p className={`text-sm sm:text-base leading-relaxed ${
                  evento.destaque || isPrimeiro 
                    ? 'text-navy font-semibold' 
                    : 'text-navy/80 font-normal'
                }`}>
                  {evento.descricao}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
