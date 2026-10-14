/* =====================================================================
   BLOCO 01 · VÍDEO NO CELULAR (formato da página Axion)
   • .mp4: prévia sem som em loop → clique recomeça com som,
     barra de progresso vermelha, toque pausa, fim destaca o botão.
   • Instagram / YouTube / Vimeo: player oficial carregado no clique.
   • Sem vídeo: capa com aviso "vídeo em breve".
   ===================================================================== */
import { h, reducedMotion } from '../core/dom.js';
import { CONFIG } from '../config.js';
import { registerVideo, sourceKind, embedUrl, onOtherMediaPlay, announcePlay } from '../core/media.js';
import { track } from '../core/tracking.js';

const SVG = {
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
};

export function mountHeroVsl(frame) {
  const { src, poster, captions, title } = CONFIG.vsl;
  const kind = sourceKind(src);
  if (poster) frame.style.backgroundImage = `url("${poster}")`;

  const overlay = (small, big, icon = SVG.sound, badge = true) => h('button', { class: 'vover', type: 'button', 'aria-label': `${big}: ${title}` },
    badge ? h('span', { class: 'vt-top' }, h('span', { class: 'vt-badge', html: `${SVG.mute}Sem som` })) : null,
    h('span', { class: 'vt-mid' },
      h('span', { class: 'vt-play', html: icon }),
      h('span', { class: 'vt-cap' }, h('small', {}, small), h('b', {}, big))));

  /* ---------- prévia em vídeo (sem som, em loop) ---------- */
  const previewVideo = () => {
    const pv = h('video', { muted: true, loop: true, playsinline: true, 'webkit-playsinline': true, autoplay: !reducedMotion() || null, preload: 'auto', poster: `${CONFIG.vsl.preview}.jpg`, 'aria-hidden': 'true', class: 'vprev' });
    pv.muted = true;
    pv.append(h('source', { src: `${CONFIG.vsl.preview}.mp4`, type: 'video/mp4' }), h('source', { src: `${CONFIG.vsl.preview}.webm`, type: 'video/webm' }));
    if (!reducedMotion()) {
      new IntersectionObserver((es) => { if (es[0].isIntersecting) { const p = pv.play(); if (p && p.catch) p.catch(() => {}); } else pv.pause(); }, { threshold: 0.25 }).observe(frame);
    }
    return pv;
  };

  /* ---------- sem vídeo oficial: só a prévia ---------- */
  if (kind === 'none') {
    if (CONFIG.vsl.preview) frame.append(previewVideo());
    else frame.append(h('div', { class: 'vsoon' }, h('span', { class: 'tag tag-pending' }, 'Vídeo em breve')));
    return;
  }

  /* ---------- Instagram / YouTube / Vimeo: prévia + player oficial no clique ---------- */
  if (kind !== 'file') {
    const pv = CONFIG.vsl.preview ? previewVideo() : null;
    const btn = overlay('Assista ao vídeo completo', 'Toque para ouvir', SVG.sound, Boolean(pv));
    if (pv) frame.append(pv);
    frame.append(btn);
    btn.addEventListener('click', () => {
      const url = embedUrl(src);
      if (!url) return;
      if (pv) { pv.pause(); pv.remove(); }
      frame.classList.add('full', 'is-embed');
      frame.append(h('iframe', { src: url, title, allow: 'autoplay; encrypted-media; fullscreen; picture-in-picture', allowfullscreen: true, scrolling: 'no' }),
        h('a', { class: 'vext', href: src, target: '_blank', rel: 'noopener' }, kind === 'instagram' ? 'Abrir no Instagram ↗' : 'Abrir o vídeo ↗'));
      announcePlay(frame);
      track('vsl_play');
    }, { once: true });
    onOtherMediaPlay(frame, () => {});
    return;
  }

  /* ---------- Arquivo de vídeo ---------- */
  const reduce = reducedMotion();
  const v = h('video', {
    src, poster: poster || null, muted: true, loop: true, playsinline: true, 'webkit-playsinline': true,
    preload: reduce ? 'none' : 'metadata', 'aria-label': title,
  });
  v.muted = true;
  if (captions) v.append(h('track', { kind: 'captions', src: captions, srclang: 'pt', label: 'Português' }));
  registerVideo(v);

  const over = overlay('Seu vídeo já começou', 'Clique para ouvir');
  const pauseIco = h('span', { class: 'vpause', 'aria-hidden': 'true', html: SVG.play });
  const bar = h('i');
  const err = h('div', { class: 'verr', hidden: true }, h('p', {}, 'Não foi possível carregar o vídeo.'),
    h('button', { class: 'btn-ghost', type: 'button', onclick: () => { err.hidden = true; v.load(); tryPlay(); } }, 'Tentar de novo'));
  frame.append(v, over, pauseIco, h('span', { class: 'vbar', 'aria-hidden': 'true' }, bar), err);

  let full = false;
  let inView = true;
  const cta = document.getElementById('ctaMain');
  const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };

  if (!reduce) {
    new IntersectionObserver((es) => {
      inView = es[0].isIntersecting;
      if (full) return;
      if (inView) tryPlay(); else v.pause();
    }, { threshold: 0.25 }).observe(frame);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !full && inView) tryPlay(); });
  }

  over.addEventListener('click', () => {
    full = true;
    frame.classList.add('full');
    v.loop = false; v.muted = false; v.currentTime = 0;
    if (captions && v.textTracks[0]) v.textTracks[0].mode = 'showing';
    tryPlay();
    track('vsl_play');
  });
  v.addEventListener('click', () => { if (!full) return; v.paused ? tryPlay() : v.pause(); });
  v.addEventListener('play', () => { frame.classList.remove('paused'); tick(); });
  v.addEventListener('pause', () => { frame.classList.add('paused'); });
  v.addEventListener('error', () => { err.hidden = false; });

  function tick() {
    if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
    if (!v.paused && !v.ended) requestAnimationFrame(tick);
  }
  v.addEventListener('seeked', tick);
  v.addEventListener('timeupdate', () => { if (full && v.duration && v.currentTime > v.duration - 12) cta && cta.classList.add('hot'); });
  v.addEventListener('ended', () => {
    if (!full || !cta) return;
    cta.classList.add('hot');
    const r = cta.getBoundingClientRect();
    if (r.top > innerHeight - 40 || r.bottom < 0) cta.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });

  // Teclado: espaço pausa/continua quando o vídeo já está com som.
  frame.addEventListener('keydown', (e) => { if (full && e.key === ' ' && e.target === frame) { e.preventDefault(); v.paused ? tryPlay() : v.pause(); } });
  frame.tabIndex = -1;
}
