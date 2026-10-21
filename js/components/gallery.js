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

const AUTO_MS = 4200;       // tempo médio de cada vídeo no centro
const IDLE_MS = 6000;       // pausa do giro automático depois de um toque

export function mountGallery(root) {
  const items = GALLERY.flatMap((c) => c.examples.map((ex) => ({ ...ex, cat: c.label, catId: c.id, icon: c.icon })));
  const n = items.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = -1, inView = false, idleUntil = 0;

  const slides = items.map((ex, i) => {
    const p = media(ex);
    const el = h('div', { class: 'c3-slide', role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} de ${n}: ${ex.title}` },
      h('span', { class: 'c3-cat' }, h('span', { 'aria-hidden': 'true' }, ex.icon), ' ', ({ social: 'Redes sociais', ads: 'Anúncios', company: 'Empresa' })[ex.catId] || ex.cat),
      p.el);
    el.addEventListener('click', (e) => { if (i !== active) { e.preventDefault(); e.stopPropagation(); go(i, true); } }, true);
    return { el, p, ex };
  });

  const stage = h('div', { class: 'c3-stage' }, slides.map((s) => s.el));
  const prev = h('button', { class: 'c3-btn c3-prev', type: 'button', 'aria-label': 'Vídeo anterior', onclick: () => go(Math.round(pos) - 1, true), html: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>' });
  const next = h('button', { class: 'c3-btn c3-next', type: 'button', 'aria-label': 'Próximo vídeo', onclick: () => go(Math.round(pos) + 1, true), html: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>' });
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
  const delta = (i, p) => { let d = i - p; d -= Math.round(d / n) * n; return d; };   // distância circular
  let pos = 0, target = null, dragging = null, raf = 0, last = 0, gap = 160;

  /* Desenha cada vídeo conforme a posição contínua do carrossel */
  function layout() {
    const w = slides[0].el.offsetWidth || 220;
    gap = w * (innerWidth < 600 ? 0.62 : 0.78);
    slides.forEach((s, i) => {
      const d = delta(i, pos), a = Math.abs(d), c = Math.max(-2, Math.min(2, d));
      s.el.style.transform = `translate(-50%, -50%) translateX(${d * gap}px) translateZ(${-a * 170}px) rotateY(${-c * 28}deg)`;
      s.el.style.opacity = String(a <= 1 ? 1 - 0.3 * a : a <= 2 ? 0.7 - 0.35 * (a - 1) : Math.max(0, 0.35 - (a - 2) * 0.6));
      s.el.style.filter = `brightness(${1 - 0.45 * Math.min(a, 1)}) saturate(${1 - 0.2 * Math.min(a, 1)})`;
      s.el.style.zIndex = String(Math.round(100 - a * 10));
      s.el.style.pointerEvents = a > 1.5 ? 'none' : '';
    });
    const now = wrap(Math.round(pos));
    if (now !== active) setActive(now);
  }

  function setActive(i) {
    active = i;
    slides.forEach((s, j) => { s.el.classList.toggle('is-active', j === i); s.el.setAttribute('aria-hidden', String(j !== i)); });
    $$('button', dots).forEach((b, j) => b.classList.toggle('on', j === i));
    const ex = items[i];
    title.textContent = ex.title;
    cmd.textContent = `“${ex.command}”`;
    info.classList.remove('fade-in'); void info.offsetWidth; info.classList.add('fade-in');
    play();
  }

  function play() {
    slides.forEach((s, i) => { if (i === active && inView && !reduce) s.p.play(); else s.p.pause(); });
  }

  /* Leva até um vídeo (setas, bolinhas, toque num lateral) */
  function go(i, user) {
    if (user) idleUntil = Date.now() + IDLE_MS;
    target = pos + delta(wrap(i), pos);
    if (reduce || !inView) { pos = target; target = null; layout(); }
    else start();
  }

  /* Movimento contínuo: sempre girando, mais devagar quando um vídeo
     passa pelo centro e mais rápido entre um e outro. */
  const SPEED = 1 / (AUTO_MS / 1000) / 0.675;
  function frame(t) {
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    if (dragging) { /* posição vem do arraste */ }
    else if (target != null) {
      pos += (target - pos) * Math.min(1, dt * 5);
      if (Math.abs(target - pos) < 0.002) { pos = target; target = null; }
    } else if (Date.now() >= idleUntil) {
      const f = pos - Math.floor(pos);
      pos += SPEED * (0.35 + 0.65 * (1 - Math.cos(2 * Math.PI * f)) / 2) * dt;
    }
    layout();
    raf = inView ? requestAnimationFrame(frame) : 0;
  }
  function start() { if (!raf && inView && !reduce) { last = 0; raf = requestAnimationFrame(frame); } }

  new IntersectionObserver((es) => {
    inView = es[0].isIntersecting;
    play();
    if (inView) start();
  }, { threshold: 0.3 }).observe(stage);

  /* Arrastar / deslizar: o carrossel acompanha o dedo e encaixa ao soltar */
  let moved = false;
  stage.addEventListener('pointerdown', (e) => { dragging = { x: e.clientX, p: pos }; moved = false; target = null; idleUntil = Date.now() + IDLE_MS; });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.x;
    if (Math.abs(dx) > 8) moved = true;
    if (moved) { pos = dragging.p - dx / gap; if (!raf) layout(); }
  });
  const release = () => {
    if (!dragging) return;
    dragging = null;
    idleUntil = Date.now() + IDLE_MS;
    target = Math.round(pos);
    start();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('pointerleave', release);
  stage.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  root.querySelector('.c3').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.round(pos) + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.round(pos) - 1, true); }
  });
  addEventListener('resize', layout);

  setActive(0);
  layout();
}
