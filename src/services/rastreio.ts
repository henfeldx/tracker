import { DadosRastreio, EstadoBrasil, EventoRastreio } from '../types/rastreio';
import { MODO, ORIGEM_CD } from '../config';

/**
 * Sanitiza o código informado pelo usuário:
 * Remove espaços, caracteres '#' e quaisquer outros caracteres não numéricos.
 */
export function sanitizarCodigo(entrada: string): string {
  if (!entrada) return '';
  return entrada.replace(/#/g, '').replace(/\s+/g, '').replace(/[^0-9]/g, '');
}

/**
 * Valida se o código atende aos requisitos (mínimo de 4 dígitos numéricos).
 */
export function validarCodigo(codigoLimpo: string): { valido: boolean; mensagem?: string } {
  if (!codigoLimpo) {
    return { valido: false, mensagem: 'Por favor, informe o número do seu pedido para rastrear.' };
  }
  if (codigoLimpo.length !== 3) {
    return { valido: false, mensagem: 'O código do pedido deve conter exatamente 3 dígitos (ex.: #101).' };
  }
  return { valido: true };
}

/**
 * Gera uma data/hora determinística formatada em português brasileiro
 * subtraindo dias e horas da data atual com base no código do pedido.
 */
function gerarDataRelativa(diasAtras: number, minutosAtras: number, baseDate: Date = new Date()): string {
  const data = new Date(baseDate.getTime());
  data.setDate(data.getDate() - diasAtras);
  data.setMinutes(data.getMinutes() - minutosAtras);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

/**
 * Calcula a previsão de entrega determinística (dias úteis futuros).
 */
function calcularPrevisaoEntrega(diasFuturos: number, baseDate: Date = new Date()): string {
  const data = new Date(baseDate.getTime());
  data.setDate(data.getDate() + diasFuturos);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

/**
 * Busca e consolida as informações de rastreio de um pedido.
 * Esta função foi estruturada de forma assíncrona e desacoplada, permitindo
 * sua substituição direta por uma chamada de API REST real no futuro.
 * 
 * Regras fixas de negócio:
 *  - Usa APENAS ORIGEM_CD e o estado do visitante como locais de eventos.
 *  - No MODO "teste": fluxo até "Em transporte".
 *  - No MODO "final": status fixo de Centro de Distribuição aguardando liberação dos Correios.
 */
export async function buscarRastreio(
  codigoRaw: string,
  estadoVisitante: EstadoBrasil
): Promise<DadosRastreio> {
  // Simula latência de rede realista (400ms) para exibição do skeleton/carregamento
  await new Promise((resolve) => setTimeout(resolve, 400));

  const codigo = sanitizarCodigo(codigoRaw);
  const validacao = validarCodigo(codigo);
  if (!validacao.valido) {
    throw new Error(validacao.mensagem || 'Código de pedido inválido.');
  }

  // Gera sementes determinísticas baseadas nos dígitos do código
  const numeroCodigo = parseInt(codigo, 10) || 101;
  const offsetHoras = (numeroCodigo % 7);
  const offsetMinutos = (numeroCodigo % 45);

  const nomeDestino = estadoVisitante.nome;
  const previsaoEntrega = calcularPrevisaoEntrega(4 + (numeroCodigo % 3));

  if (MODO === 'final') {
    // MODO "final": Objeto no Centro de Distribuição do Estado do visitante
    const statusTitulo = `Objeto no centro de distribuição de ${nomeDestino} — aguardando liberação dos Correios para seguir para entrega`;
    const statusDescricao = 'A remessa chegou à unidade de distribuição regional e passará pela triagem final antes de sair para o endereço de entrega.';
    const textoApoio = 'Assim que houver liberação, você será atualizado aqui.';

    const eventos: EventoRastreio[] = [
      {
        id: 'ev-cd',
        data: gerarDataRelativa(0, 45 + offsetMinutos),
        local: `Centro de Distribuição — ${nomeDestino}`,
        descricao: `Objeto no centro de distribuição de ${nomeDestino} — aguardando liberação dos Correios para seguir para entrega`,
        destaque: true,
      },
      {
        id: 'ev-transporte',
        data: gerarDataRelativa(1, 120 + offsetMinutos),
        local: ORIGEM_CD,
        descricao: `Objeto em trânsito com destino ao centro de distribuição de ${nomeDestino}`,
        destaque: false,
      },
      {
        id: 'ev-postado',
        data: gerarDataRelativa(2, 200 + offsetMinutos),
        local: ORIGEM_CD,
        descricao: 'Objeto postado após conferência e embalagem na unidade de despacho',
        destaque: false,
      },
      {
        id: 'ev-confirmado',
        data: gerarDataRelativa(3, 300 + offsetMinutos),
        local: ORIGEM_CD,
        descricao: 'Pedido confirmado e nota fiscal eletrônica emitida com sucesso',
        destaque: false,
      },
    ];

    return {
      codigo,
      produto: 'Pedido Whitefield & Co.',
      origem: ORIGEM_CD,
      destino: nomeDestino,
      previsaoEntrega,
      etapaAtual: 3, // "Centro de distribuição"
      statusTitulo,
      statusDescricao,
      textoApoio,
      eventos,
    };
  }

  // MODO "teste": Mostra origem (ORIGEM_CD) -> destino (estado do visitante) até "Em transporte"
  const statusTitulo = `Objeto em transporte para ${nomeDestino}`;
  const statusDescricao = `A carga foi despachada de ${ORIGEM_CD} e está a caminho da unidade regional de ${nomeDestino}.`;

  const eventos: EventoRastreio[] = [
    {
      id: 'ev-transporte',
      data: gerarDataRelativa(0, 60 + offsetMinutos + offsetHoras * 10),
      local: ORIGEM_CD,
      descricao: `Objeto em transporte com destino a ${nomeDestino}`,
      destaque: true,
    },
    {
      id: 'ev-postado',
      data: gerarDataRelativa(1, 180 + offsetMinutos),
      local: ORIGEM_CD,
      descricao: 'Objeto postado após conferência e embalagem na unidade de despacho',
      destaque: false,
    },
    {
      id: 'ev-confirmado',
      data: gerarDataRelativa(2, 240 + offsetMinutos),
      local: ORIGEM_CD,
      descricao: 'Pedido confirmado e nota fiscal eletrônica emitida com sucesso',
      destaque: false,
    },
  ];

  return {
    codigo,
    produto: 'Pedido Whitefield & Co.',
    origem: ORIGEM_CD,
    destino: nomeDestino,
    previsaoEntrega,
    etapaAtual: 2, // "Em transporte"
    statusTitulo,
    statusDescricao,
    eventos,
  };
}
