# Whitefield & Co. — Portal de Rastreamento de Encomendas

Aplicação web moderna, responsiva (mobile-first) e acessível desenvolvida para a marca **Whitefield & Co.** para acompanhamento logístico de pedidos em tempo real.

---

## 🛠️ Stack Tecnológica

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (com tokens customizados: `navy`, `navy-claro`, `gelo`, `branco`)
- **React Router Dom** (v6)
- **Lucide React** (ícones vetoriais padronizados)

---

## 🚀 Como Executar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação pelo navegador em `http://localhost:5173`.

---

## ⚙️ Como Alterar o MODO e a ORIGEM_CD

No arquivo `src/config.ts`, você pode controlar o comportamento da aplicação e os dados logísticos:

```typescript
// Altere entre "teste" ou "final"
export const MODO: "teste" | "final" = "teste";

// Cidade e UF do Centro de Distribuição / Ponto de partida
export const ORIGEM_CD: string = "Manaus - AM";

// Link da loja oficial (usado nas abas e botões "Ver mais produtos")
export const LOJA_URL: string = "https://whitefield.com.br";
```

### Comportamento dos Modos:
- **`teste`**: Exibe o trajeto da origem (`ORIGEM_CD`) até o estado de destino do cliente com a linha do tempo e etapas ativas em "Em transporte".
- **`final`**: Status oficial de Centro de Distribuição no estado do visitante aguardando liberação dos Correios, com etapa ativa em "Centro de distribuição" e texto de apoio informativo.
*(Nenhum modo exibe indicação visual de teste, protótipo ou dados falsos na interface).*

---

## 🔌 Como Conectar a uma API Real

A camada de dados está completamente desacoplada no arquivo `src/services/rastreio.ts`.

Para conectar a uma API REST real (por exemplo, Correios, Melhor Envio, Intelipost ou seu backend proprietário), basta substituir o corpo da função `buscarRastreio`:

```typescript
// Exemplo de integração em src/services/rastreio.ts:
export async function buscarRastreio(
  codigoRaw: string,
  estadoVisitante: EstadoBrasil
): Promise<DadosRastreio> {
  const codigo = sanitizarCodigo(codigoRaw);
  
  const resposta = await fetch(`https://sua-api.com.br/pedidos/${codigo}`, {
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    }
  });

  if (!resposta.ok) {
    throw new Error('Pedido não localizado em nossa base logística.');
  }

  const dadosApi = await resposta.json();
  
  // Mapeie a resposta da API para a interface DadosRastreio
  return {
    codigo: dadosApi.id,
    produto: dadosApi.nomeProduto,
    origem: dadosApi.origem,
    destino: dadosApi.destino,
    previsaoEntrega: dadosApi.previsao,
    etapaAtual: dadosApi.indiceEtapa,
    statusTitulo: dadosApi.status,
    statusDescricao: dadosApi.descricao,
    eventos: dadosApi.historico,
  };
}
```

---

## 📍 Localização do Visitante

A aplicação utiliza a API nativa `navigator.geolocation` com geocodificação reversa gratuita (BigDataCloud e OpenStreetMap Nominatim), armazenando o estado em `sessionStorage` para garantir rapidez e zero re-solicitações intrusivas. Em caso de recusa de permissão ou falha de rede, a aplicação exibe um seletor visual e intuitivo com os 27 estados do Brasil.
