import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Package, ShieldCheck } from 'lucide-react';
import { DadosRastreio, EstadoBrasil, ETAPAS_RASTREIO } from '../types/rastreio';
import { obterEstadoSalvo } from '../services/localizacao';
import { buscarRastreio, sanitizarCodigo, validarCodigo } from '../services/rastreio';
import { LOJA_URL } from '../config';

import { BarraProgresso } from '../components/BarraProgresso';
import { LinhaDoTempo } from '../components/LinhaDoTempo';
import { CardStatus } from '../components/CardStatus';
import { CardDestino } from '../components/CardDestino';
import { PermissaoLocalizacao } from '../components/PermissaoLocalizacao';

export const Rastreio: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();

  const [estadoVisitante, setEstadoVisitante] = useState<EstadoBrasil | null>(() => obterEstadoSalvo());
  const [precisaLocalizacao, setPrecisaLocalizacao] = useState<boolean>(!obterEstadoSalvo());
  const [alterandoEstadoManual, setAlterandoEstadoManual] = useState(false);

  const [dadosRastreio, setDadosRastreio] = useState<DadosRastreio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const codigoLimpo = sanitizarCodigo(codigo || '');

  // Validação preliminar do código
  useEffect(() => {
    const validacao = validarCodigo(codigoLimpo);
    if (!validacao.valido) {
      setErro(validacao.mensagem || 'Código de rastreamento inválido.');
      setCarregando(false);
    }
  }, [codigoLimpo]);

  // Carrega os dados de rastreio sempre que tiver o código e o estado
  useEffect(() => {
    if (!codigoLimpo || codigoLimpo.length !== 3) return;
    if (!estadoVisitante) {
      setPrecisaLocalizacao(true);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro(null);

    buscarRastreio(codigoLimpo, estadoVisitante)
      .then((resultado) => {
        if (ativo) {
          setDadosRastreio(resultado);
          setCarregando(false);
        }
      })
      .catch((err: Error) => {
        if (ativo) {
          setErro(err.message || 'Não foi possível carregar as informações do pedido.');
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [codigoLimpo, estadoVisitante]);

  const lidarEstadoDefinido = (novoEstado: EstadoBrasil) => {
    setEstadoVisitante(novoEstado);
    setPrecisaLocalizacao(false);
    setAlterandoEstadoManual(false);
  };

  // Se o código for inválido na URL
  if (erro && !dadosRastreio) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-branco rounded-3xl p-8 sm:p-12 text-center border border-gelo-borda shadow-card space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-navy">
              Pedido não encontrado
            </h1>
            <p className="text-navy/70 max-w-md mx-auto text-sm leading-relaxed">
              {erro}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-claro text-branco font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar e digitar outro código</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gelo/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Modal de Permissão de Localização (se necessário ou se solicitou alteração) */}
        {(precisaLocalizacao || alterandoEstadoManual) && (
          <PermissaoLocalizacao
            onEstadoDefinido={lidarEstadoDefinido}
            onFechar={estadoVisitante ? () => setAlterandoEstadoManual(false) : undefined}
            modoModal={true}
          />
        )}

        {/* Barra Superior / Navegação e Título do Pedido */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gelo-borda">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-navy/60 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Rastreamento Verificado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy flex items-center gap-2">
              <span>Pedido</span>
              <span className="text-navy underline decoration-navy/20 underline-offset-4">
                #{codigoLimpo}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-branco hover:bg-gelo text-navy border border-gelo-borda px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-navy"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Rastrear outro pedido</span>
            </Link>
          </div>
        </div>

        {/* Estado de Carregamento (Skeleton) */}
        {carregando ? (
          <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Carregando dados do pedido">
            <div className="h-44 bg-gelo rounded-2xl border border-gelo-borda" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-56 bg-gelo rounded-2xl border border-gelo-borda" />
              <div className="h-56 bg-gelo rounded-2xl border border-gelo-borda" />
            </div>
            <div className="h-80 bg-gelo rounded-2xl border border-gelo-borda" />
          </div>
        ) : dadosRastreio ? (
          <>
            {/* Barra de Progresso das 6 Etapas */}
            <BarraProgresso etapaAtual={dadosRastreio.etapaAtual} />

            {/* Grid com Card de Status Atual e Card de Destino */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <div className="lg:col-span-2 flex">
                <div className="w-full">
                  <CardStatus
                    titulo={dadosRastreio.statusTitulo}
                    descricao={dadosRastreio.statusDescricao}
                    textoApoio={dadosRastreio.textoApoio}
                    avisoCorreios={dadosRastreio.avisoCorreios}
                    etapaLabel={ETAPAS_RASTREIO[dadosRastreio.etapaAtual]?.label || 'Em andamento'}
                  />
                </div>
              </div>

              <div className="flex">
                <div className="w-full">
                  <CardDestino
                    origem={dadosRastreio.origem}
                    destino={dadosRastreio.destino}
                    previsaoEntrega={dadosRastreio.previsaoEntrega}
                    onAlterarDestino={() => setAlterandoEstadoManual(true)}
                  />
                </div>
              </div>
            </div>

            {/* Linha do Tempo Vertical */}
            <LinhaDoTempo eventos={dadosRastreio.eventos} />

            {/* Botão Secundário 'Ver mais produtos' abaixo da linha do tempo */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={LOJA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-navy text-navy hover:bg-navy hover:text-branco font-semibold text-sm sm:text-base transition-all duration-200 shadow-2xs group focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                aria-label="Ver mais produtos na loja oficial Whitefield & Co. (abre em nova aba)"
              >
                <span>Ver mais produtos na Whitefield &amp; Co.</span>
                <ExternalLink className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
};
