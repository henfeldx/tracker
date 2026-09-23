export type EtapaChave = 
  | 'confirmado'
  | 'postado'
  | 'transporte'
  | 'centro_distribuicao'
  | 'saiu_entrega'
  | 'entregue';

export interface EtapaDef {
  chave: EtapaChave;
  label: string;
  indice: number;
}

export const ETAPAS_RASTREIO: EtapaDef[] = [
  { chave: 'confirmado', label: 'Pedido confirmado', indice: 0 },
  { chave: 'postado', label: 'Postado', indice: 1 },
  { chave: 'transporte', label: 'Em transporte', indice: 2 },
  { chave: 'centro_distribuicao', label: 'Centro de distribuição', indice: 3 },
  { chave: 'saiu_entrega', label: 'Saiu para entrega', indice: 4 },
  { chave: 'entregue', label: 'Entregue', indice: 5 },
];

export interface EventoRastreio {
  id: string;
  data: string;
  local: string;
  descricao: string;
  destaque?: boolean;
}

export interface DadosRastreio {
  codigo: string;
  produto: string;
  origem: string;
  destino: string;
  previsaoEntrega: string;
  etapaAtual: number; // 0 a 5
  statusTitulo: string;
  statusDescricao: string;
  textoApoio?: string;
  eventos: EventoRastreio[];
}

export interface EstadoBrasil {
  sigla: string;
  nome: string;
}

export const ESTADOS_BRASIL: EstadoBrasil[] = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];
