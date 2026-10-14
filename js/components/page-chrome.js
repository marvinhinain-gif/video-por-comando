/* =====================================================================
   TOPO, MOTION DO PRIMEIRO BLOCO, POEIRA DOURADA E BARRA MOBILE
   (mesmo comportamento da página Axion, leve no celular)
   ===================================================================== */
import { $, $$, reducedMotion } from '../core/dom.js';
import { CONFIG } from '../config.js';
import { track } from '../core/tracking.js';

/** Linhas fixas (headline em 3 linhas, subheadline em 2): reduz a fonte só o
 *  necessário para cada linha caber. Abaixo de data-min, o texto quebra normalmente. */
export function initFitText() {
  const els = $$('.fit');
  if (!els.length) return;
  const fit = () => {
    els.forEach((el) => {
      const max = +el.dataset.max, min = +el.dataset.min || 9.5;
      el.classList.remove('fit-wrap');
      // No celular: texto quebra naturalmente, com o tamanho definido no CSS (maior e mais legível).
      if (el.dataset.mobileWrap && innerWidth < +el.dataset.mobileWrap) { el.style.fontSize = ''; el.classList.add('fit-wrap'); return; }
      el.style.fontSize = `${max}px`;
      const wrap = el.closest('.wrap') || el.parentElement;
      const cs = getComputedStyle(wrap);
      const room = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      let w = 0;
      el.querySelectorAll(':scope > span').forEach((sp) => { w = Math.max(w, sp.scrollWidth); });
      if (w <= room) return;
      const size = Math.floor((max * room / w) * 10) / 10 - 0.1;
      if (size >= min) el.style.fontSize = `${size}px`;
      else { el.style.fontSize = `${min}px`; el.classList.add('fit-wrap'); }
    });
  };
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  let lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; fit(); } });
}

/** Topo: fundo ao rolar + botão aparece depois do botão principal. */
export function initHeader() {
  const top = $('#topo');
  const cta = $('#ctaMain');
  const onScroll = () => {
    top.classList.toggle('scrolled', scrollY > 10);
    top.classList.toggle('cta-on', cta.getBoundingClientRect().bottom < 0);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/** Motion ao rolar no primeiro bloco (valores suavizados, só transform/opacity). */
export function initHeroMotion() {
  if (reducedMotion()) return;
  const hero = $('#inicio'), stage = $('#vstage'), copy = $('#hcopy');
  let tp = 0, tq = 0, cp = 0, cq = 0, ticking = false, copyEnd = 1, stageMid = 1;
  const measure = () => {
    const y = scrollY;
    copyEnd = Math.max(300, copy.getBoundingClientRect().bottom + y);
    const r = stage.getBoundingClientRect();
    stageMid = r.top + y + r.height / 2;
  };
  const targets = () => {
    const y = scrollY, hgt = innerHeight;
    tp = Math.min(1, Math.max(0, y / copyEnd));
    tq = $('.vframe.full') ? 1 : Math.min(1, Math.max(0, (y + hgt - stageMid) / (hgt * 0.5)));
  };
  const loop = () => {
    cp += (tp - cp) * 0.1; cq += (tq - cq) * 0.1;
    hero.style.setProperty('--p', cp.toFixed(4));
    hero.style.setProperty('--q', cq.toFixed(4));
    if (Math.abs(tp - cp) > 0.0005 || Math.abs(tq - cq) > 0.0005) requestAnimationFrame(loop);
    else ticking = false;
  };
  const kick = () => { targets(); if (!ticking) { ticking = true; requestAnimationFrame(loop); } };
  measure(); targets(); cp = tp; cq = tq; kick();
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { measure(); kick(); });
  addEventListener('load', () => { measure(); kick(); });
  hero.addEventListener('click', kick);
}

/** Poeira dourada no fundo da abertura. Desligada em aparelhos fracos e economia de dados. */
export function initDust() {
  if (reducedMotion()) return;
  if ((navigator.connection && navigator.connection.saveData) || (innerWidth < 700 && (navigator.hardwareConcurrency || 8) <= 4)) return;
  const cv = $('#dust'), hero = $('#inicio');
  if (!cv) return;
  const cx = cv.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, parts = [], running = false, visible = true;
  const t0 = performance.now();
  const COUNT = innerWidth < 700 ? 26 : 64;
  const resize = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const seed = () => {
    parts = [];
    for (let i = 0; i < COUNT; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4, s: Math.random() * 0.25 + 0.06, a: Math.random() * 0.5 + 0.15, p: Math.random() * 6.28 });
  };
  const frame = (now) => {
    if (!visible) { running = false; return; }
    const t = (now - t0) / 1000;
    cx.clearRect(0, 0, W, H);
    for (const q of parts) {
      q.y -= q.s; q.x += Math.sin(t * 0.6 + q.p) * 0.15;
      if (q.y < -4) { q.y = H + 4; q.x = Math.random() * W; }
      cx.globalAlpha = q.a * (0.55 + 0.45 * Math.sin(t * 1.8 + q.p)) * Math.min(1, t / 2.2);
      cx.fillStyle = q.r > 1.4 ? '#F2D488' : '#D6A329';
      cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, 6.283); cx.fill();
    }
    requestAnimationFrame(frame);
  };
  const start = () => { if (!running && visible) { running = true; requestAnimationFrame(frame); } };
  resize(); seed(); start();
  let lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; resize(); seed(); } });
  new IntersectionObserver((es) => { visible = es[0].isIntersecting && !document.hidden; start(); }).observe(hero);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; start(); });
}

/** Barra de compra fixa no celular: aparece depois do primeiro bloco e some na oferta/fechamento. */
export function initBuyBar() {
  const bar = $('[data-buybar]');
  if (!bar || !CONFIG.cta.mobileStickyBar) return;
  const watch = [$('#inicio'), $('#oferta'), $('#fechamento')];
  const visible = new Map();
  const link = bar.querySelector('a');
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => visible.set(e.target, e.isIntersecting));
    const show = !watch.some((s) => visible.get(s));
    bar.hidden = false;
    bar.classList.toggle('show', show);
    bar.setAttribute('aria-hidden', String(!show));
    link.tabIndex = show ? 0 : -1;
    document.body.classList.toggle('has-buybar', show);
  });
  watch.forEach((s) => s && io.observe(s));
}

/** Evento de visualização da oferta (uma vez). */
export function initOfferView() {
  const offer = $('#oferta');
  if (!offer) return;
  const io = new IntersectionObserver((ents) => {
    if (ents.some((e) => e.isIntersecting)) { track('offer_view'); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe(offer);
}

/** Valores vindos da configuração (preço, pagamento, ano). */
export function applyConfigText() {
  $$('[data-price="label"]').forEach((el) => { el.textContent = CONFIG.product.priceLabel; });
  $$('[data-payment-model]').forEach((el) => { el.textContent = CONFIG.product.paymentModel; });
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
}
