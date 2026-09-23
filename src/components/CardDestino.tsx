import React from 'react';
import { MapPin, Calendar, ArrowRight, RefreshCw } from 'lucide-react';

interface CardDestinoProps {
  origem: string;
  destino: string;
  previsaoEntrega: string;
  onAlterarDestino?: () => void;
}

export const CardDestino: React.FC<CardDestinoProps> = ({
  origem,
  destino,
  previsaoEntrega,
  onAlterarDestino,
}) => {
  return (
    <div 
      className="bg-branco rounded-2xl p-6 sm:p-8 border border-gelo-borda shadow-suave flex flex-col justify-between"
      role="region"
      aria-label="Informações de destino e rota da remessa"
    >
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gelo-borda mb-5">
          <h3 className="text-base sm:text-lg font-serif font-semibold text-navy">
            Informações do Envio
          </h3>
          {onAlterarDestino && (
            <button
              type="button"
              onClick={onAlterarDestino}
              className="text-xs text-navy/70 hover:text-navy inline-flex items-center gap-1 font-medium transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-navy rounded-sm px-1 py-0.5"
              title="Alterar estado de destino"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Alterar estado</span>
            </button>
          )}
        </div>

        {/* Trajeto Origem -> Destino */}
        <div className="space-y-4">
          <div className="bg-gelo/70 rounded-xl p-4 border border-gelo-borda">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-navy/60 block mb-1.5">
              Rota de Transporte
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm font-semibold text-navy">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-navy/60" />
                <span>{origem}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-navy/40 hidden sm:block" />
              <div className="flex items-center gap-2 text-navy">
                <MapPin className="w-4 h-4 text-navy flex-shrink-0" />
                <span className="font-bold underline decoration-navy/20 underline-offset-4">
                  {destino}
                </span>
              </div>
            </div>
          </div>

          {/* Previsão de Entrega */}
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-gelo/40 border border-gelo-borda">
            <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center text-navy flex-shrink-0">
              <Calendar className="w-5 h-5 text-navy" />
            </div>
            <div>
              <span className="text-xs text-navy/60 font-medium block">
                Previsão de Entrega
              </span>
              <span className="text-sm sm:text-base font-bold text-navy">
                Até {previsaoEntrega}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gelo-borda text-xs text-navy/60 flex items-center justify-between">
        <span>Modalidade: Entrega Expressa</span>
        <span>Acompanhamento garantido</span>
      </div>
    </div>
  );
};
