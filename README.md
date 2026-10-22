# Clique Edite — Landing page

Página estática (HTML + CSS + JavaScript em módulos), sem dependências e sem etapa de build.
Funciona em qualquer hospedagem estática: GitHub Pages, Netlify, Vercel, Render (static site), Hostinger etc.

## Estrutura

```
index.html                  Copy comercial dos 10 blocos, na ordem, separada por comentários
css/styles.css              Identidade visual (padrão Axion: preto, grafite, dourado, Poppins)
js/config.js                ⚙️  Preço, checkout, VSL, comparador, rastreamento
js/content.js               ✏️  Demonstrações, galeria, mapa mental, FAQ
js/main.js                  Monta os componentes
js/core/
  checkout.js               Destino único dos botões de compra + repasse de UTMs
  tracking.js               Meta Pixel / GA4 com consentimento
  media.js                  Um vídeo pausa os outros
  dom.js                    Utilitários
js/components/
  video-player.js           Player reutilizável (galeria)
  guided-steps.js           Bloco 02 · como funciona em 3 passos
  process-compare.js        Bloco 03 · tradicional × com IA
  gallery.js                Bloco 05 · galeria em carrossel 3D
  before-after.js           Bloco 06 · comparador antes/depois
  deliver-video.js          Bloco 07 · vídeo animado do que você recebe
  faq.js                    Bloco 09 · perguntas frequentes
  page-chrome.js            Topo com etapa da jornada, barra de compra mobile, ilustração do hero
assets/img/                 Logo, capa do vídeo, favicon e imagem de compartilhamento
assets/media/               Coloque aqui os vídeos e legendas (.vtt)
```

## Como configurar (tudo em `js/config.js`)

| O quê | Campo | Exemplo |
|---|---|---|
| Link de pagamento (todos os botões) | `checkout.url` | `'https://pay.hotmart.com/XXXX'` |
| CTAs dos blocos 1 e 2 | `cta.upperMode` | `'offer'` (rola até a oferta) ou `'checkout'` |
| VSL (celular do topo) | player ConverteAI direto no `index.html` (bloco 01) — o `vsl` do config não é mais usado | `'assets/media/vsl.mp4'` (formato Axion: prévia sem som + "Clique para ouvir") ou link do Instagram/YouTube/Vimeo (player oficial) |
| Comparador | `comparison.original.src`, `comparison.edited.src`, `comparison.changes` | durações são lidas dos arquivos |
| Meta Pixel / GA4 | `tracking.metaPixelId`, `tracking.ga4Id` | só carregam após o visitante aceitar |
| Preço exibido | `product.priceLabel`, `product.priceShort` | `'R$ 97,00'` |

Vídeos de exemplo da galeria: em `js/content.js`, no array `GALLERY`, preencha `src` (arquivo .mp4)
ou `instagram` (link do post/reel) e `resultSummary`. Sem vídeo, o card mostra uma ilustração marcada "Ilustração".

Formato de vídeo recomendado: **MP4 (H.264 + AAC)**, com `-movflags +faststart`. Legendas em `.vtt`.

## Rastreamento

| Evento interno | Meta | GA4 |
|---|---|---|
| `offer_view` (oferta visível) | `ViewContent` | `view_item` |
| `checkout_click` (clique em comprar) | `CliqueCompra` (custom) | `begin_checkout_click` |
| `vsl_play` | `PlayVSL` (custom) | `video_start` |

Todos também vão para `window.dataLayer` (útil com Google Tag Manager).
**InitiateCheckout** e **Purchase** devem ser configurados na plataforma de checkout: só ela sabe
quando o checkout abriu e quando o pagamento foi aprovado. A página nunca registra compra pelo clique.

Os parâmetros `utm_*`, `fbclid`, `gclid`, `src`, `sck`, `xcod` da visita são repassados ao checkout.

## Endereço do site

**https://cliqueedite.onrender.com** (Render, site estático ligado à branch `main`: cada envio para a `main` publica sozinho).

## Publicar

Suba a pasta inteira. Para testar no computador: `python3 -m http.server` dentro da pasta
e abra `http://localhost:8000` (abrir o `index.html` direto pelo arquivo não carrega os módulos JS).

## Publicar no GitHub Pages

1. Crie um repositório vazio chamado `video-por-comando` (sem README).
2. Envie esta pasta para a branch `main`.
3. No repositório: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`** → Save.
4. Em 1–2 minutos o site fica em `https://marvinhinain-gif.github.io/video-por-comando/`.

Para atualizar depois, basta enviar as mudanças para a `main`.
