/**
 * Configurações da aplicação Whitefield & Co.
 * 
 * MODO:
 *  - "teste": Linha do tempo até "Em transporte", exibindo trajeto da origem (ORIGEM_CD) ao destino (estado do visitante).
 *  - "final": Objeto no Centro de Distribuição aguardando liberação dos Correios, com etapa ativa em "Centro de distribuição".
 *  (Nenhum dos modos exibe aviso de teste ou mock na interface).
 */
export const MODO: "teste" | "final" = "teste";

/**
 * Cidade e UF do Centro de Distribuição / Origem das remessas.
 * Alterável conforme a operação logística da loja.
 */
export const ORIGEM_CD: string = "Manaus - AM";

/**
 * URL oficial da loja para redirecionamento na aba e botões "Ver mais produtos".
 */
export const LOJA_URL: string = "https://whitefield.com.br";

/**
 * Informações de contato e atendimento da marca Whitefield & Co.
 */
export const CONFIG_SUPORTE = {
  nome: "Whitefield & Co.",
  email: "atendimento@whitefield.com.br",
  telefone: "(11) 3090-4422",
  horario: "Segunda a Sexta, das 09h às 18h",
};
