import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { EstadoBrasil, ESTADOS_BRASIL } from '../types/rastreio';
import { solicitarGeolocalizacaoNavegador, salvarEstado } from '../services/localizacao';

interface PermissaoLocalizacaoProps {
  onEstadoDefinido: (estado: EstadoBrasil) => void;
  onFechar?: () => void;
  modoModal?: boolean;
}

export const PermissaoLocalizacao: React.FC<PermissaoLocalizacaoProps> = ({
  onEstadoDefinido,
  onFechar,
  modoModal = true,
}) => {
  const [carregando, setCarregando] = useState(false);
  const [mostrarSeletorManual, setMostrarSeletorManual] = useState(false);
  const [buscaEstado, setBuscaEstado] = useState('');

  const lidarPermissaoNavegador = async () => {
    setCarregando(true);
    try {
      const estadoDetectado = await solicitarGeolocalizacaoNavegador();
      salvarEstado(estadoDetectado);
      onEstadoDefinido(estadoDetectado);
    } catch {
      // Se negado, timeout ou falha de rede: abre o seletor manual amigavelmente sem erro técnico
      setMostrarSeletorManual(true);
    } finally {
      setCarregando(false);
    }
  };

  const lidarSelecaoManual = (estado: EstadoBrasil) => {
    salvarEstado(estado);
    onEstadoDefinido(estado);
  };

  const estadosFiltrados = ESTADOS_BRASIL.filter(
    (e) =>
      e.nome.toLowerCase().includes(buscaEstado.toLowerCase()) ||
      e.sigla.toLowerCase().includes(buscaEstado.toLowerCase())
  );

  const conteudo = (
    <div className="bg-branco rounded-2xl shadow-card border border-gelo-borda p-6 sm:p-8 max-w-lg w-full mx-auto transition-all">
      {!mostrarSeletorManual ? (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gelo rounded-2xl flex items-center justify-center mx-auto text-navy shadow-sm">
            <MapPin className="w-8 h-8 text-navy" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-navy">
              Localização de Entrega
            </h2>
            <p className="text-sm text-navy/70 max-w-md mx-auto leading-relaxed">
              Para mostrar o destino da sua entrega, precisamos da sua localização.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={lidarPermissaoNavegador}
              disabled={carregando}
              className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-claro active:bg-navy-escuro text-branco font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Identificando localização...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>Permitir localização</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMostrarSeletorManual(true)}
              disabled={carregando}
              className="w-full text-sm text-navy/75 hover:text-navy font-medium py-2.5 transition-colors focus-visible:ring-1 focus-visible:ring-navy rounded-lg cursor-pointer"
            >
              Selecionar meu estado manualmente
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gelo-borda">
            <div>
              <h2 className="text-lg font-serif font-semibold text-navy">
                Selecione o Estado de Destino
              </h2>
              <p className="text-xs text-navy/60">
                Escolha o estado correspondente ao seu endereço
              </p>
            </div>
            {onFechar && (
              <button
                type="button"
                onClick={onFechar}
                className="text-xs text-navy/60 hover:text-navy p-1"
              >
                Voltar
              </button>
            )}
          </div>

          <div>
            <label htmlFor="busca-uf" className="sr-only">
              Filtrar estado
            </label>
            <input
              id="busca-uf"
              type="text"
              placeholder="Digite o nome ou sigla (ex: SP, Bahia)..."
              value={buscaEstado}
              onChange={(e) => setBuscaEstado(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gelo rounded-lg border border-gelo-borda focus:bg-branco focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy transition-all"
            />
          </div>

          <div 
            tabIndex={0}
            role="region"
            aria-label="Lista de estados brasileiros para seleção de entrega"
            className="max-h-64 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-lg"
          >
            {estadosFiltrados.map((estado) => (
              <button
                key={estado.sigla}
                type="button"
                onClick={() => lidarSelecaoManual(estado)}
                className="flex items-center justify-between p-2.5 text-left rounded-lg bg-gelo/70 hover:bg-navy hover:text-branco text-navy text-xs sm:text-sm font-medium transition-colors group cursor-pointer focus-visible:ring-2 focus-visible:ring-navy"
              >
                <span className="truncate">{estado.nome}</span>
                <span className="font-bold text-xs opacity-75 group-hover:opacity-100 ml-1">
                  {estado.sigla}
                </span>
              </button>
            ))}
            {estadosFiltrados.length === 0 && (
              <div className="col-span-full py-4 text-center text-xs text-navy/60">
                Nenhum estado encontrado para esta busca.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (modoModal) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Identificação do estado de entrega"
      >
        {conteudo}
      </div>
    );
  }

  return conteudo;
};
