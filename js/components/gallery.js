/* =====================================================================
   BLOCO 05 · GALERIA EM CARROSSEL 3D
   Todos os exemplos (redes sociais, anúncios, empresa) num carrossel
   em perspectiva que passa sozinho, suavemente. O vídeo do centro toca
   sem som, com barra de progresso; os laterais ficam parados.
   Arraste, use as setas ou toque num vídeo lateral para trazê-lo.
   ===================================================================== */
import { h, $$ } from '../core/dom.js';
import { GALLERY } from '../content.js';
import { createChapterVideo, demo } from './chapter-video.js';

const AUTO_MS = 4200;       // tempo de cada vídeo no centro
const IDLE_MS = 9000;       // pausa do giro automático depois de um toque

export function mountGallery(root) {
  const items = GALLERY.flatMap((c) => c.examples.map((ex) => ({ ...ex, cat: c.label, catId: c.id, icon: c.icon })));
  const n = items.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0, inView = false, timer = 0, idleUntil = 0;

  const slides = items.map((ex, i) => {
    const p = media(ex);
    const el = h('div', { class: 'c3-slide', role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} de ${n}: ${ex.title}` },
      h('span', { class: 'c3-cat' }, h('span', { 'aria-hidden': 'true' }, ex.icon), ' ', ({ social: 'Redes sociais', ads: 'Anúncios', company: 'Empresa' })[ex.catId] || ex.cat),
      p.el);
    el.addEventListener('click', (e) => { if (i !== active) { e.preventDefault(); e.stopPropagation(); go(i, true); } }, true);
    return { el, p, ex };
  });

  const stage = h('div', { class: 'c3-stage' }, slides.map((s) => s.el));
  const prev = h('button', { class: 'c3-btn c3-prev', type: 'button', 'aria-label': 'Vídeo anterior', onclick: () => go(active - 1, true), html: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>' });
  const next = h('button', { class: 'c3-btn c3-next', type: 'button', 'aria-label': 'Próximo vídeo', onclick: () => go(active + 1, true), html: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>' });
  const title = h('h3', { class: 'c3-title' });
  const cmd = h('code', { class: 'cmd c3-cmd' });
  const info = h('div', { class: 'c3-info', 'aria-live': 'polite' }, title, cmd);
  const dots = h('div', { class: 'c3-dots' }, items.map((_, i) => h('button', { type: 'button', 'aria-label': `Ir para o vídeo ${i + 1}`, onclick: () => go(i, true) })));

  root.append(h('div', { class: 'c3', tabindex: '0', 'aria-roledescription': 'carrossel', 'aria-label': 'Exemplos de vídeos' }, stage, prev, next), info, dots);

  function media(ex) {
    if (ex.demos && ex.demos.length > 1) return variants(ex);
    return createChapterVideo({ ...demo(ex.demo), aspect: '9 / 16', loop: true, autoplay: false, showChapters: false, title: ex.real ? ex.title : `Ilustração: ${ex.title}` });
  }

  /* Várias versões no mesmo card: tocam uma depois da outra, com seletor. */
  function variants(ex) {
    const box = h('div', { class: 'var-stage' });
    let cur = null, idx = 0, on = false;
    const btns = ex.demos.map((d, i) => h('button', { class: 'seg-btn', type: 'button', onclick: (e) => { e.stopPropagation(); show(i); if (on) cur.play(); } }, `Versão ${i + 1}`));
    const seg = h('div', { class: 'seg var-seg', 'aria-label': 'Versões' }, btns);
    function show(i) {
      idx = i;
      btns.forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
      if (cur) cur.pause();
      cur = createChapterVideo({ ...demo(ex.demos[i]), aspect: '9 / 16', loop: false, autoplay: false, showChapters: false, title: `${ex.title} · versão ${i + 1}` });
      cur.video.addEventListener('ended', () => { show((idx + 1) % ex.demos.length); if (on) cur.play(); });
      box.replaceChildren(cur.el);
    }
    show(0);
    return { el: h('div', { class: 'var' }, box, seg), play: () => { on = true; cur.play(); }, pause: () => { on = false; cur.pause(); } };
  }

  const wrap = (i) => ((i % n) + n) % n;

  function layout() {
    const w = slides[0].el.offsetWidth || 220;
    const gap = w * (innerWidth < 600 ? 0.62 : 0.78);
    slides.forEach((s, i) => {
      let d = i - active;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const a = Math.abs(d);
      s.el.style.transform = `translate(-50%, -50%) translateX(${d * gap}px) translateZ(${-a * 170}px) rotateY(${-Math.sign(d) * Math.min(a, 2) * 28}deg)`;
      s.el.style.opacity = a > 2 ? '0' : a === 2 ? '.35' : a === 1 ? '.7' : '1';
      s.el.style.zIndex = String(10 - a);
      s.el.classList.toggle('is-active', d === 0);
      s.el.style.pointerEvents = a > 1 ? 'none' : '';
      s.el.setAttribute('aria-hidden', String(d !== 0));
    });
    $$('button', dots).forEach((b, i) => b.classList.toggle('on', i === active));
  }

  function play() {
    slides.forEach((s, i) => { if (i === active && inView && !reduce) s.p.play(); else s.p.pause(); });
  }

  function go(i, user) {
    active = wrap(i);
    if (user) idleUntil = Date.now() + IDLE_MS;
    layout();
    const ex = items[active];
    title.textContent = ex.title;
    cmd.textContent = `“${ex.command}”`;
    info.classList.remove('fade-in'); void info.offsetWidth; info.classList.add('fade-in');
    play();
  }

  /* Giro automático suave enquanto a galeria está na tela */
  function loop() {
    clearTimeout(timer);
    if (reduce || !inView) return;
    timer = setTimeout(() => {
      if (Date.now() >= idleUntil && !root.matches(':hover')) go(active + 1, false);
      loop();
    }, AUTO_MS);
  }
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; play(); loop(); }, { threshold: 0.35 }).observe(stage);

  /* Arrastar / deslizar */
  let x0 = null, moved = false;
  stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; moved = false; idleUntil = Date.now() + IDLE_MS; });
  stage.addEventListener('pointermove', (e) => { if (x0 != null && Math.abs(e.clientX - x0) > 12) moved = true; });
  stage.addEventListener('pointerup', (e) => {
    if (x0 == null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1), true);
  });
  stage.addEventListener('pointercancel', () => { x0 = null; });
  stage.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  root.querySelector('.c3').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); }
  });
  addEventListener('resize', layout);

  go(0, false);
}
