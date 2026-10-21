/* =====================================================================
   BLOCO 06 · ANTES E DEPOIS
   - Dois vídeos lado a lado, sempre sem som, em loop, com barra de
     progresso; tocar no vídeo pausa/continua
   - Etiquetas "Antes" (vermelha) e "Depois" (verde) + duração real
     lida dos arquivos (nunca digitada)
   - O que mudou em chips animados
   ===================================================================== */
import { h, fmtTime } from '../core/dom.js';
import { CONFIG } from '../config.js';
import { demo } from './chapter-video.js';
import { registerVideo } from '../core/media.js';

const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
const CHIP_ICONS = [
  '<path d="M6 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 8l12 9M8 16l12-9"/>',
  '<path d="M4 18L9 6l5 12M5.8 14h6.4M15 18v-6.5a2.5 2.5 0 0 1 5 0V18M15 14.5h5"/>',
  '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
];

export function mountBeforeAfter(root) {
  const cfg = CONFIG.comparison;
  const ready = Boolean(cfg.original.src && cfg.edited.src);
  const orig = ready ? cfg.original : demo('corte-bruto');
  const edit = ready ? cfg.edited : demo('corte-editado');

  const mk = (v, label) => {
    const video = h('video', { playsinline: true, muted: true, loop: true, preload: 'none', poster: v.poster || null, 'aria-label': label });
    if (ready) video.append(h('source', { src: v.src }));
    else { const b = v.src.replace(/\.mp4$/, ''); video.append(h('source', { src: `${b}.mp4`, type: 'video/mp4' }), h('source', { src: `${b}.webm`, type: 'video/webm' })); }
    video.muted = true;
    video.dataset.auto = '1';
    registerVideo(video);
    return video;
  };
  const vo = mk(orig, ready ? 'Vídeo original' : 'Ilustração: gravação bruta');
  const ve = mk(edit, ready ? 'Vídeo editado' : 'Ilustração: vídeo editado');
  const durO = h('span', { class: 'ba2-dur' }, '–:––');
  const durE = h('span', { class: 'ba2-dur' }, '–:––');
  const diff = h('span', { class: 'ba2-diff', hidden: true });

  const frame = (v, cls, label, dur) => {
    const bar = h('i');
    const tick = () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; if (!v.paused) requestAnimationFrame(tick); };
    const el = h('figure', { class: `ba2-fig ${cls}` },
      v,
      h('span', { class: 'ba2-tag' }, label),
      dur,
      h('span', { class: 'ba2-pause', 'aria-hidden': 'true', html: PLAY }),
      h('span', { class: 'ba2-bar', 'aria-hidden': 'true' }, bar));
    v.addEventListener('play', () => { el.classList.remove('paused'); tick(); });
    v.addEventListener('pause', () => el.classList.add('paused'));
    v.addEventListener('seeked', tick);
    v.addEventListener('click', () => {
      if (v.paused) { delete v.dataset.userPaused; v.play().catch(() => {}); } else { v.dataset.userPaused = '1'; v.pause(); }
    });
    return el;
  };

  const arrow = h('span', { class: 'ba2-arrow', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' });
  const grid = h('div', { class: 'ba2-grid' }, frame(vo, 'ba2-before', 'Antes', durO), arrow, frame(ve, 'ba2-after', 'Depois', durE));
  const chips = h('ul', { class: 'ba2-chips', 'aria-label': 'O que mudou' },
    (ready ? cfg.changes : ['Cortes nas pausas', 'Legendas na tela', 'Efeitos visuais']).map((c, i) =>
      h('li', { style: `--i:${i}` }, h('span', { class: 'ba2-ic', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24">${CHIP_ICONS[i % 3]}</svg>` }), c)));

  root.append(
    h('div', { class: 'ba2-head' },
      h('p', { class: 'panel-kicker' }, 'Antes e depois'),
      ready ? h('span', { class: 'tag tag-real' }, 'Vídeos reais') : h('span', { class: 'tag tag-sim' }, 'Ilustração'),
      diff),
    grid, chips);

  /* Durações reais, lidas dos arquivos */
  const paint = () => {
    const o = vo.duration, e = ve.duration;
    if (isFinite(o)) durO.textContent = fmtTime(o);
    if (isFinite(e)) durE.textContent = fmtTime(e);
    if (ready && isFinite(o) && isFinite(e)) {
      const d = Math.round(o - e);
      if (d > 0) { diff.textContent = `${d} s a menos`; diff.hidden = false; }
    }
  };
  [vo, ve].forEach((v) => {
    v.addEventListener('loadedmetadata', paint);
    v.addEventListener('error', () => { (v === vo ? durO : durE).textContent = 'indisponível'; }, true);
  });

  /* Carrega perto da tela; toca (sem som, em loop) quando aparece; anima a entrada */
  const near = new IntersectionObserver((es) => {
    if (!es.some((x) => x.isIntersecting)) return;
    near.disconnect();
    [vo, ve].forEach((v) => { v.preload = 'auto'; v.load(); });
  }, { rootMargin: '300px' });
  near.observe(root);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('ba2-anim');
  let inView = false;
  const playVisible = () => [vo, ve].forEach((v) => {
    if (inView && !v.dataset.userPaused) { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
  });
  [vo, ve].forEach((v) => v.addEventListener('canplay', () => { if (inView && v.paused && !v.dataset.userPaused) v.play().catch(() => {}); }));
  new IntersectionObserver((es) => {
    inView = es[0].isIntersecting;
    if (inView) root.classList.add('ba2-in');
    if (!reduce) playVisible();
  }, { threshold: 0.3 }).observe(grid);
}
