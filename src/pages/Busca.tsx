import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, ShieldCheck, Truck, Package, Clock } from 'lucide-react';
import { sanitizarCodigo, validarCodigo } from '../services/rastreio';

export const Busca: React.FC = () => {
  const [codigoInput, setCodigoInput] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const lidarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const codigoLimpo = sanitizarCodigo(codigoInput);
    const validacao = validarCodigo(codigoLimpo);

    if (!validacao.valido) {
      setErro(validacao.mensagem || 'Código de pedido inválido.');
      return;
    }

    setCarregando(true);
    // Transição suave para a tela de rastreio
    setTimeout(() => {
      navigate(`/rastreio/${codigoLimpo}`);
    }, 250);
  };

  const lidarMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigoInput(e.target.value);
    if (erro) setErro(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-10">
        
        {/* Cabeçalho da Seção de Busca */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gelo text-navy text-xs font-semibold uppercase tracking-wider border border-gelo-borda">
            <Truck className="w-3.5 h-3.5 text-navy" />
            <span>Logística &amp; Rastreamento</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy tracking-tight">
            Rastreie seu pedido
          </h1>

          <p className="text-base sm:text-lg text-navy/70 max-w-lg mx-auto leading-relaxed">
            Consulte a localização atualizada e o prazo estimado de entrega da sua compra.
          </p>
        </div>

        {/* Formulário de Busca */}
        <div className="bg-branco rounded-3xl p-6 sm:p-10 shadow-card border border-gelo-borda relative">
          <form onSubmit={lidarEnvio} className="space-y-5" noValidate>
            <div>
              <label 
                htmlFor="codigo-pedido" 
                className="block text-sm font-semibold text-navy mb-2"
              >
                Número do Pedido
              </label>

              <div className="relative">
                <input
                  id="codigo-pedido"
                  name="codigo"
                  type="text"
                  inputMode="numeric"
                  placeholder="#101"
                  value={codigoInput}
                  onChange={lidarMudancaInput}
                  autoComplete="off"
                  aria-invalid={erro ? 'true' : 'false'}
                  aria-describedby={erro ? 'erro-codigo' : 'ajuda-codigo'}
                  className={`w-full px-5 py-4 pl-12 text-base sm:text-lg font-medium rounded-xl border transition-all text-navy placeholder:text-navy/35 bg-gelo/50 focus:bg-branco ${
                    erro 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gelo-borda focus:border-navy focus:ring-2 focus:ring-navy/20'
                  }`}
                />

                <Search 
                  className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    erro ? 'text-red-500' : 'text-navy/50'
                  }`} 
                  aria-hidden="true"
                />
              </div>

              {/* Mensagem de Erro Amigável */}
              {erro ? (
                <div 
                  id="erro-codigo" 
                  role="alert" 
                  className="mt-2.5 flex items-center gap-2 text-sm text-red-600 font-medium animate-in fade-in duration-150"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{erro}</span>
                </div>
              ) : (
                <p id="ajuda-codigo" className="mt-2 text-xs text-navy/50">
                  Informe o número recebido no e-mail de confirmação da sua compra.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-navy hover:bg-navy-claro active:bg-navy-escuro text-branco font-semibold py-4 px-8 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5 text-base sm:text-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {carregando ? (
                <div className="w-6 h-6 border-2 border-branco/30 border-t-branco rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Rastrear</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Informações de Credibilidade & Segurança */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gelo/60 border border-gelo-borda">
            <Package className="w-5 h-5 text-navy flex-shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-navy">Conferência Rigorosa</h2>
              <p className="text-[11px] text-navy/60">Embalagem protegida</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gelo/60 border border-gelo-borda">
            <Clock className="w-5 h-5 text-navy flex-shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-navy">Atualização em Tempo Real</h2>
              <p className="text-[11px] text-navy/60">Notificações por etapa</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gelo/60 border border-gelo-borda">
            <ShieldCheck className="w-5 h-5 text-navy flex-shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-navy">Entrega Segura</h2>
              <p className="text-[11px] text-navy/60">Seguro de carga incluso</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
