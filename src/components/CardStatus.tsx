import React from 'react';
import { PackageCheck, Clock, Info } from 'lucide-react';

interface CardStatusProps {
  titulo: string;
  descricao: string;
  textoApoio?: string;
  etapaLabel: string;
}

export const CardStatus: React.FC<CardStatusProps> = ({
  titulo,
  descricao,
  textoApoio,
  etapaLabel,
}) => {
  return (
    <div 
      className="bg-branco rounded-2xl p-6 sm:p-8 border border-gelo-borda shadow-suave relative overflow-hidden"
      role="region"
      aria-label="Status atual do envio"
    >
      {/* Detalhe de borda decorativa navy sutil no topo */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-navy" />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gelo flex items-center justify-center text-navy shadow-xs flex-shrink-0">
            <PackageCheck className="w-6 h-6 text-navy" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-navy/60 block mb-0.5">
              Status Atual
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-navy text-branco">
              <Clock className="w-3.5 h-3.5" />
              {etapaLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-2">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-navy leading-snug">
          {titulo}
        </h3>
        
        <p className="text-sm sm:text-base text-navy/75 leading-relaxed">
          {descricao}
        </p>

        {textoApoio && (
          <div className="mt-4 p-4 rounded-xl bg-gelo/90 border border-gelo-borda flex items-start gap-3 text-sm text-navy/85">
            <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              {textoApoio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
