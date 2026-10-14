/* =====================================================================
   CHECKOUT — um único destino para todos os botões de compra.
   data-cta="upper"    → blocos 1 e 2 (+ topo): oferta ou checkout,
                         conforme CONFIG.cta.upperMode
   data-cta="checkout" → blocos 8, 10 e barra mobile: checkout
   ===================================================================== */
import { CONFIG } from '../config.js';
import { $$ } from './dom.js';
import { track } from './tracking.js';

const PKEY = 'vpc_campaign';

/** Guarda os parâmetros de campanha da primeira página vista na sessão. */
function captureParams() {
  const now = new URLSearchParams(location.search);
  const keep = {};
  CONFIG.checkout.forwardParams.forEach((k) => { if (now.get(k)) keep[k] = now.get(k); });
  try {
    if (Object.keys(keep).length) sessionStorage.setItem(PKEY, JSON.stringify(keep));
    return Object.keys(keep).length ? keep : JSON.parse(sessionStorage.getItem(PKEY) || '{}');
  } catch (_) { return keep; }
}

export function checkoutUrl() {
  const base = (CONFIG.checkout.url || '').trim();
  if (!base) return '';
  try {
    const u = new URL(base, location.href);
    const params = captureParams();
    Object.entries(params).forEach(([k, v]) => { if (!u.searchParams.has(k)) u.searchParams.set(k, v); });
    return u.toString();
  } catch (_) {
    return '';
  }
}

export const isCheckoutReady = () => Boolean(checkoutUrl());

function scrollToOffer() {
  const el = document.getElementById('oferta');
  if (!el) return;
  el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  // Leva o foco ao cartão de oferta para quem navega por teclado/leitor de tela.
  const card = el.querySelector('[data-offer-card]');
  if (card) { card.setAttribute('tabindex', '-1'); card.focus({ preventScroll: true }); }
}

function showPending(btn) {
  const status = btn.parentElement.querySelector('[data-cta-status]') || document.querySelector('#oferta [data-cta-status]');
  if (status) {
    status.textContent = 'O link de pagamento ainda não foi configurado. Volte em breve.';
    status.classList.add('show');
  }
  btn.classList.add('is-pending');
  setTimeout(() => btn.classList.remove('is-pending'), 900);
}

export function initCheckout() {
  const url = checkoutUrl();
  const goesToCheckout = (btn) => btn.dataset.cta === 'checkout' || CONFIG.cta.upperMode === 'checkout';

  $$('[data-cta]').forEach((btn) => {
    if (goesToCheckout(btn) && url) {
      btn.href = url;
      if (CONFIG.checkout.openInNewTab) { btn.target = '_blank'; btn.rel = 'noopener'; }
    }
    btn.addEventListener('click', (e) => {
      const where = btn.dataset.ctaId || 'cta';
      if (goesToCheckout(btn)) {
        if (url) { track('checkout_click', { placement: where }); return; } // segue o link normalmente
        e.preventDefault();
        if (btn.dataset.cta === 'checkout' && btn.closest('#oferta')) { showPending(btn); return; }
        scrollToOffer();
        if (btn.dataset.cta === 'checkout') setTimeout(() => showPending(document.querySelector('#oferta [data-cta]')), 500);
        return;
      }
      e.preventDefault();
      scrollToOffer();
    });
  });
}
