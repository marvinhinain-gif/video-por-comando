/* =====================================================================
   VÍDEO POR COMANDO — CONFIGURAÇÃO CENTRAL
   ---------------------------------------------------------------------
   Tudo o que muda com frequência fica aqui: preço, checkout, VSL,
   vídeos de exemplo, comparador e rastreamento.
   Campos vazios ("") deixam o componente em estado "pendente",
   visível e identificado na página — nada é inventado.
   ===================================================================== */

export const CONFIG = {
  product: {
    name: 'Vídeo por Comando',
    presenter: 'Lucão Ferraz',
    priceLabel: 'R$ 97,00',      // usado no bloco de oferta e no fechamento
    priceShort: 'R$ 97',         // usado nos botões e na barra mobile
    paymentModel: 'Pagamento único',
    currency: 'BRL',
    priceValue: 97.0,            // usado só no rastreamento (valor do evento)
  },

  /* ---------------------------------------------------------------
     CHECKOUT — uma única URL para todos os botões de compra.
     Cole aqui o link oficial da plataforma (Hotmart, Kiwify, Hubla…).
     Enquanto estiver vazio, os botões mostram o aviso
     "link de pagamento ainda não configurado".
     --------------------------------------------------------------- */
  checkout: {
    url: '',
    // Repassa utm_*, fbclid, gclid etc. da visita para o checkout.
    forwardParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'src', 'sck', 'xcod'],
    openInNewTab: false,
  },

  /* ---------------------------------------------------------------
     CTAs DO TOPO
     'offer'    → os CTAs dos blocos 1 e 2 rolam até a oferta (bloco 8)
     'checkout' → os CTAs dos blocos 1 e 2 vão direto ao checkout
     Os CTAs dos blocos 8 e 10 sempre vão ao checkout.
     --------------------------------------------------------------- */
  cta: {
    upperMode: 'offer',
    mobileStickyBar: true,
  },

  /* ---------------------------------------------------------------
     VSL — vídeo do celular no topo da página (formato da página Axion).
     • Arquivo .mp4 (recomendado): toca sem som em loop como prévia e,
       no clique, recomeça do início com som + barra de progresso.
       Ex.: src: 'assets/media/vsl.mp4'
     • Link do Instagram: usa o player oficial do Instagram no clique.
     poster: capa exibida antes do vídeo carregar.
     captions: legenda .vtt (opcional, só para arquivo .mp4).
     --------------------------------------------------------------- */
  vsl: {
    src: 'assets/media/vsl.mp4',
    // Link do reel no Instagram (referência): https://www.instagram.com/p/DeaauJZgr3W/
    poster: 'assets/img/capa-vsl.jpg',
    // Prévia em vídeo (sem som, em loop) mostrada no celular enquanto a VSL
    // é um link do Instagram/YouTube/Vimeo. Gerada para a página.
    preview: 'assets/media/demo/hero',
    captions: '',
    title: 'Vídeo de apresentação do Vídeo por Comando',
  },

  /* ---------------------------------------------------------------
     COMPARADOR ANTES/DEPOIS (bloco 6)
     As durações são lidas dos próprios arquivos, nunca digitadas.
     changes: liste as modificações reais feitas no vídeo editado.
     --------------------------------------------------------------- */
  comparison: {
    original: { src: '', poster: '', captions: '' },
    edited:   { src: '', poster: '', captions: '' },
    changes: [
      // 'Pausas longas removidas',
      // 'Legenda adicionada',
    ],
  },

  /* ---------------------------------------------------------------
     RASTREAMENTO
     Nada é carregado sem ID. Com ID, os scripts só carregam depois
     do consentimento do visitante (quando consentRequired = true).
     Compra concluída NÃO é registrada aqui: configure o evento
     Purchase na plataforma de checkout (pixel/webhook dela).
     --------------------------------------------------------------- */
  tracking: {
    metaPixelId: '',
    ga4Id: '',
    consentRequired: true,
    debug: false,          // true mostra os eventos no console
  },
};
