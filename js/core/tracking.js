/* =====================================================================
   RASTREAMENTO
   - Sem ID configurado: eventos vão só para window.dataLayer.
   - Com ID: Meta Pixel / GA4 carregam apenas após consentimento.
   - Compra concluída NÃO é disparada aqui (só a plataforma de
     checkout pode confirmar um pagamento).
   ===================================================================== */
import { CONFIG } from '../config.js';
import { $ } from './dom.js';

const KEY = 'vpc_consent';
const cfg = CONFIG.tracking;
const hasIds = () => Boolean(cfg.metaPixelId || cfg.ga4Id);
let loaded = false;
const queue = [];

function store(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* sem storage */ } }
function read(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }

function loadVendors() {
  if (loaded || !hasIds()) return;
  loaded = true;
  if (cfg.metaPixelId) {
    /* Snippet oficial do Meta Pixel (base) */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', cfg.metaPixelId);
    window.fbq('track', 'PageView');
  }
  if (cfg.ga4Id) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4Id)}`;
    document.head.append(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4Id);
  }
  queue.splice(0).forEach(([n, p]) => send(n, p));
}

/* Mapeia eventos internos para os nomes de cada ferramenta */
const MAP = {
  offer_view:     { meta: ['track', 'ViewContent'],        ga: 'view_item' },
  checkout_click: { meta: ['trackCustom', 'CliqueCompra'], ga: 'begin_checkout_click' },
  vsl_play:       { meta: ['trackCustom', 'PlayVSL'],      ga: 'video_start' },
};

function send(name, params) {
  const m = MAP[name];
  if (window.fbq && m?.meta) window.fbq(m.meta[0], m.meta[1], params);
  if (window.gtag && m?.ga) window.gtag('event', m.ga, params);
}

export function track(name, params = {}) {
  const payload = {
    content_name: CONFIG.product.name,
    value: CONFIG.product.priceValue,
    currency: CONFIG.product.currency,
    ...params,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: `vpc_${name}`, ...payload });
  if (cfg.debug) console.info('[rastreamento]', name, payload);
  if (!hasIds()) return;
  if (loaded) send(name, payload); else queue.push([name, payload]);
}

export function initTracking() {
  if (!hasIds()) return;               // nada configurado: nenhum banner, nenhum script
  if (!cfg.consentRequired || read(KEY) === 'yes') { loadVendors(); return; }
  if (read(KEY) === 'no') return;
  const box = $('[data-consent]');
  if (!box) return;
  box.hidden = false;
  $('[data-consent-yes]', box).addEventListener('click', () => { store(KEY, 'yes'); box.hidden = true; loadVendors(); });
  $('[data-consent-no]', box).addEventListener('click', () => { store(KEY, 'no'); box.hidden = true; queue.length = 0; });
}
