import { EstadoBrasil, ESTADOS_BRASIL } from '../types/rastreio';

const CHAVE_SESSION_STORAGE = 'whitefield_estado_entrega';

/**
 * Normaliza strings para busca insensível a acentos e maiúsculas.
 */
function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Encontra o objeto EstadoBrasil a partir do nome ou da sigla.
 */
export function encontrarEstadoPorNomeOuSigla(termo: string): EstadoBrasil | null {
  if (!termo) return null;
  const termoNormalizado = normalizarTexto(termo);

  // Procura por sigla exata (ex: "SP", "RJ", "BR-SP")
  const siglaLimpa = termo.replace(/[^A-Za-z]/g, '').slice(-2).toUpperCase();
  const porSigla = ESTADOS_BRASIL.find(e => e.sigla === siglaLimpa);
  if (porSigla) return porSigla;

  // Procura por nome
  const porNome = ESTADOS_BRASIL.find(e => {
    const nomeNorm = normalizarTexto(e.nome);
    return nomeNorm === termoNormalizado || termoNormalizado.includes(nomeNorm) || nomeNorm.includes(termoNormalizado);
  });

  return porNome || null;
}

/**
 * Recupera o estado já armazenado na sessão do navegador.
 */
export function obterEstadoSalvo(): EstadoBrasil | null {
  try {
    const dados = sessionStorage.getItem(CHAVE_SESSION_STORAGE);
    if (!dados) return null;
    const obj = JSON.parse(dados) as EstadoBrasil;
    if (obj && obj.sigla && obj.nome) {
      return obj;
    }
  } catch {
    // Falha silenciosa de leitura de sessão
  }
  return null;
}

/**
 * Salva o estado selecionado ou detectado na sessão.
 */
export function salvarEstado(estado: EstadoBrasil): void {
  try {
    sessionStorage.setItem(CHAVE_SESSION_STORAGE, JSON.stringify(estado));
  } catch {
    // Falha silenciosa
  }
}

/**
 * Converte latitude e longitude em estado brasileiro usando geocodificação reversa.
 * Tenta primeiramente a BigDataCloud e, caso falhe, recorre ao OpenStreetMap (Nominatim).
 */
export async function buscarEstadoPorCoordenadas(latitude: number, longitude: number): Promise<EstadoBrasil> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  // 1ª Tentativa: BigDataCloud (gratuita, sem chave, resposta rápida)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`;
    const res = await fetch(url, { signal: controller.signal });
    if (res.ok) {
      clearTimeout(timeoutId);
      const data = await res.json();
      
      const siglaCodigo = data.principalSubdivisionCode || '';
      const nomeSubdivisao = data.principalSubdivision || '';

      const estadoEncontrado = 
        encontrarEstadoPorNomeOuSigla(siglaCodigo) || 
        encontrarEstadoPorNomeOuSigla(nomeSubdivisao);

      if (estadoEncontrado) {
        salvarEstado(estadoEncontrado);
        return estadoEncontrado;
      }
    }
  } catch {
    // Continua para o fallback
  } finally {
    clearTimeout(timeoutId);
  }

  // 2ª Tentativa (Fallback): Nominatim OpenStreetMap
  try {
    const controllerOsm = new AbortController();
    const timeoutOsm = setTimeout(() => controllerOsm.abort(), 6000);
    const urlOsm = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    const resOsm = await fetch(urlOsm, {
      signal: controllerOsm.signal,
      headers: {
        'Accept-Language': 'pt-BR,pt;q=0.9',
      }
    });
    clearTimeout(timeoutOsm);

    if (resOsm.ok) {
      const dataOsm = await resOsm.json();
      const estadoNome = dataOsm.address?.state || dataOsm.address?.region || '';
      const estadoEncontrado = encontrarEstadoPorNomeOuSigla(estadoNome);
      if (estadoEncontrado) {
        salvarEstado(estadoEncontrado);
        return estadoEncontrado;
      }
    }
  } catch {
    // Falha silenciosa tratada pelo chamador
  }

  throw new Error('Não foi possível determinar o estado a partir das coordenadas.');
}

/**
 * Dispara a permissão real de geolocalização do navegador e retorna o EstadoBrasil correspondente.
 */
export function solicitarGeolocalizacaoNavegador(): Promise<EstadoBrasil> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada neste navegador.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        try {
          const { latitude, longitude } = posicao.coords;
          const estado = await buscarEstadoPorCoordenadas(latitude, longitude);
          resolve(estado);
        } catch (erro) {
          reject(erro);
        }
      },
      (erro) => {
        reject(erro);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos de cache
      }
    );
  });
}
