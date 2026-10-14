/* =====================================================================
   VÍDEO INTERATIVO COM CAPÍTULOS (demonstrações sem áudio)
   - Toca sozinho, sem som, quando aparece na tela; pausa fora dela
   - Capítulos clicáveis: pulam para o trecho e mostram o progresso
   - Toque no vídeo pausa/continua; no fim, "Ver de novo"
   Arquivos: <nome>.mp4 (H.264) + <nome>.webm + <nome>.jpg (capa)
   ===================================================================== */
import { h, $$, reducedMotion } from '../core/dom.js';

const ICON = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z"/></svg>',
  replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
};

export function createChapterVideo({ src, poster, chapters = [], aspect = '4 / 5', title = 'Demonstração', loop = false, autoplay = true, showChapters = true }) {
  const video = h('video', { muted: true, playsinline: true, 'webkit-playsinline': true, preload: 'none', poster: poster || null, 'aria-label': title, loop: loop || null });
  video.muted = true;
  const base = src.replace(/\.(mp4|webm)$/, '');
  video.append(h('source', { src: `${base}.mp4`, type: 'video/mp4' }), h('source', { src: `${base}.webm`, type: 'video/webm' }));

  const playBtn = h('button', { class: 'cv-play', type: 'button', 'aria-label': `Reproduzir: ${title}`, html: ICON.play });
  const bar = h('i');
  const frame = h('div', { class: 'cv-frame', style: `--ar:${aspect}` }, video, playBtn, h('span', { class: 'cv-bar', 'aria-hidden': 'true' }, bar));

  const chapBtns = chapters.map((c, i) => h('button', { class: 'cv-chap', type: 'button', onclick: () => seek(i) },
    h('span', { class: 'cv-chap-l' }, h('b', {}, String(i + 1)), c.label), h('span', { class: 'cv-chap-p', 'aria-hidden': 'true' }, h('i'))));
  const chapRow = chapters.length && showChapters ? h('div', { class: 'cv-chaps', role: 'group', 'aria-label': 'Capítulos do vídeo' }, chapBtns) : null;
  const el = h('div', { class: 'cv' }, frame, chapRow);

  const listeners = [];
  let current = -1, userPaused = false, inView = false;

  const tryPlay = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
  const end = (i) => (i < chapters.length - 1 ? chapters[i + 1].t : (video.duration || chapters[i].t + 4));

  function seek(i) {
    if (!chapters[i]) return;
    userPaused = false;
    if (video.readyState === 0) { video.preload = 'auto'; video.load(); }
    const go = () => { video.currentTime = chapters[i].t + 0.01; tryPlay(); };
    if (video.readyState >= 1) go(); else video.addEventListener('loadedmetadata', go, { once: true });
  }

  function paint() {
    const t = video.currentTime;
    if (video.duration) bar.style.transform = `scaleX(${t / video.duration})`;
    let idx = -1;
    chapters.forEach((c, i) => { if (t >= c.t - 0.02) idx = i; });
    chapBtns.forEach((b, i) => {
      const p = i < idx ? 1 : i > idx ? 0 : Math.min(1, (t - chapters[i].t) / Math.max(0.1, end(i) - chapters[i].t));
      b.lastChild.firstChild.style.transform = `scaleX(${p})`;
      b.classList.toggle('on', i === idx);
      if (i === idx) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    if (idx !== current) { current = idx; listeners.forEach((f) => f(idx)); }
  }
  let raf = 0;
  const loopPaint = () => { paint(); if (!video.paused && !video.ended) raf = requestAnimationFrame(loopPaint); };

  video.addEventListener('play', () => { frame.classList.add('playing'); frame.classList.remove('ended'); playBtn.innerHTML = ICON.pause; playBtn.setAttribute('aria-label', 'Pausar'); cancelAnimationFrame(raf); loopPaint(); });
  video.addEventListener('pause', () => { frame.classList.remove('playing'); playBtn.innerHTML = ICON.play; playBtn.setAttribute('aria-label', `Reproduzir: ${title}`); paint(); });
  video.addEventListener('ended', () => { frame.classList.add('ended'); playBtn.innerHTML = ICON.replay; playBtn.setAttribute('aria-label', 'Ver de novo'); });
  video.addEventListener('seeked', paint);

  const toggle = () => {
    if (video.ended) { video.currentTime = 0; tryPlay(); return; }
    if (video.paused) { userPaused = false; if (video.readyState === 0) video.preload = 'auto'; tryPlay(); } else { userPaused = true; video.pause(); }
  };
  playBtn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);

  if (autoplay && !reducedMotion()) {
    new IntersectionObserver((es) => {
      inView = es[0].isIntersecting;
      if (inView && !userPaused && !video.ended) { if (video.readyState === 0) video.preload = 'auto'; tryPlay(); }
      if (!inView) video.pause();
    }, { threshold: 0.55 }).observe(frame);
  }

  return {
    el, video,
    seek,
    play: () => { userPaused = false; tryPlay(); },
    pause: () => video.pause(),
    restart: () => { userPaused = false; video.currentTime = 0; tryPlay(); },
    onChapter: (f) => listeners.push(f),
    get inView() { return inView; },
  };
}

/** Caminhos dos vídeos de demonstração gerados para a página. */
export const demo = (name) => ({ src: `assets/media/demo/${name}.mp4`, poster: `assets/media/demo/${name}.jpg` });
