/* =====================================================================
   RESULTADOS DOS ALUNOS
   Vídeos de lançamento feitos por alunos, lado a lado. Tocam sozinhos,
   sem som e em loop, com barra de progresso. O botão de som liga o
   áudio de um vídeo (e desliga o do outro); tocar no vídeo pausa.
   ===================================================================== */
import { h } from '../core/dom.js';

const RESULTS = [
  { src: 'assets/media/resultados/relogio-lince', title: 'Relógio Lince', kind: 'Produto',
    quote: 'Quando vi o resultado, fiquei voltando o vídeo pra assistir de novo 😂' },
  { src: 'assets/media/resultados/app-avora', title: 'App Avora', kind: 'App',
    quote: 'Com a animação, consegui mostrar a ideia de um jeito muito mais interessante.' },
];

const ICON_OFF = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6"/></svg>';
const ICON_ON = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';

export function mountStudentResults(root) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = RESULTS.map((r) => {
    const v = h('video', { playsinline: true, 'webkit-playsinline': true, muted: true, loop: true, preload: 'metadata', poster: `${r.src}.jpg`, 'aria-label': `Vídeo de aluno: ${r.title}` },
      h('source', { src: `${r.src}.mp4`, type: 'video/mp4' }), h('source', { src: `${r.src}.webm`, type: 'video/webm' }));
    v.muted = true;
    const bar = h('i');
    const snd = h('button', { class: 'sr-sound', type: 'button', 'aria-label': `Ouvir o som: ${r.title}`, html: ICON_OFF });
    const fig = h('figure', { class: 'sr-fig' },
      v,
      h('span', { class: 'sr-tag' }, r.kind),
      h('span', { class: 'sr-pause', 'aria-hidden': 'true', html: PLAY }),
      snd,
      h('span', { class: 'sr-bar', 'aria-hidden': 'true' }, bar));
    const tick = () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; if (!v.paused) requestAnimationFrame(tick); };
    v.addEventListener('play', () => { fig.classList.remove('paused'); tick(); });
    v.addEventListener('pause', () => fig.classList.add('paused'));
    v.addEventListener('click', () => {
      if (v.paused) { delete v.dataset.userPaused; v.play().catch(() => {}); } else { v.dataset.userPaused = '1'; v.pause(); }
    });
    snd.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = v.muted;
      items.forEach((it) => { it.v.muted = true; it.snd.innerHTML = ICON_OFF; it.snd.classList.remove('on'); });
      if (on) { v.muted = false; snd.innerHTML = ICON_ON; snd.classList.add('on'); delete v.dataset.userPaused; v.play().catch(() => {}); }
    });
    return { v, snd, el: h('div', { class: 'sr-item' }, fig, h('p', { class: 'sr-title' }, r.title), r.quote ? h('blockquote', { class: 'sr-quote' }, `“${r.quote}”`) : null) };
  });
  root.append(h('div', { class: 'sr-grid' }, items.map((i) => i.el)));

  let inView = false;
  const sync = () => items.forEach(({ v }) => {
    if (inView && !v.dataset.userPaused && !reduce) { if (v.preload !== 'auto') v.preload = 'auto'; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    else if (!inView) v.pause();
  });
  items.forEach(({ v }) => v.addEventListener('canplay', () => { if (inView && v.paused && !v.dataset.userPaused && !reduce) v.play().catch(() => {}); }));
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; if (inView) root.classList.add('sr-in'); sync(); }, { threshold: 0.3 }).observe(root);
}
