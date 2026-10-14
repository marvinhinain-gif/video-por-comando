/* =====================================================================
   PLAYER DE VÍDEO REUTILIZÁVEL (VSL e galeria)
   - Arquivo (.mp4/.webm): controles próprios, carregamento sob demanda
   - YouTube/Vimeo: carrega o player externo só depois do clique
   - Sem origem: estado "pendente", visível e identificado
   Estados: pending · idle · loading · playing · paused · error
   ===================================================================== */
import { h, $, fmtTime } from '../core/dom.js';
import { registerVideo, sourceKind, embedUrl, onOtherMediaPlay, announcePlay } from '../core/media.js';

const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" stroke="none"/></svg>',
  vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  cc: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 10.2a2.3 2.3 0 100 3.6M17 10.2a2.3 2.3 0 100 3.6"/></svg>',
  full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
};

export function createPlayer({ src = '', poster = '', captions = '', aspect = '16 / 9', title = 'Vídeo', pendingText = 'Vídeo ainda não configurado', onFirstPlay } = {}) {
  const kind = sourceKind(src);
  const root = h('div', { class: 'player', style: `--ar:${aspect}`, 'data-state': kind === 'none' ? 'pending' : 'idle', role: 'region', 'aria-label': title });

  /* ---------- Sem origem: pendência visível ---------- */
  if (kind === 'none') {
    root.append(h('div', { class: 'player-pending' },
      h('span', { class: 'tag tag-pending' }, 'Pendente'),
      h('p', {}, pendingText),
      h('p', { class: 'muted small' }, 'O arquivo real será exibido aqui assim que for configurado.')));
    return { el: root, pause() {} };
  }

  if (poster) root.style.backgroundImage = `url("${poster}")`;
  const big = h('button', { class: 'player-big', type: 'button', 'aria-label': `Reproduzir: ${title}`, html: ICON.play });
  const spinner = h('div', { class: 'player-spin', 'aria-hidden': 'true' });
  const status = h('p', { class: 'sr-only', role: 'status' });
  root.append(big, spinner, status);

  /* ---------- YouTube / Vimeo: carrega só no clique ---------- */
  if (kind === 'youtube' || kind === 'vimeo' || kind === 'instagram') {
    let frame = null;
    let fired = false;
    const stop = () => { if (frame) { frame.remove(); frame = null; root.dataset.state = 'idle'; } };
    big.addEventListener('click', () => {
      if (frame) return;
      const url = embedUrl(src);
      if (!url) {
        root.dataset.state = 'error';
        root.append(h('div', { class: 'player-error' }, h('p', {}, 'Endereço do vídeo inválido. Confira o link na configuração.')));
        return;
      }
      root.dataset.state = 'loading';
      frame = h('iframe', { src: url, title, allow: 'autoplay; fullscreen; picture-in-picture', allowfullscreen: true });
      frame.addEventListener('load', () => { if (frame) root.dataset.state = 'playing'; });
      root.append(frame);
      announcePlay(root);
      if (!fired && onFirstPlay) { fired = true; onFirstPlay(); }
    });
    onOtherMediaPlay(root, stop);
    return { el: root, pause: stop };
  }

  /* ---------- Arquivo de vídeo ---------- */
  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'none', poster: poster || null, 'aria-label': title });
  if (captions) video.append(h('track', { kind: 'captions', src: captions, srclang: 'pt', label: 'Português', default: true }));
  registerVideo(video);

  const playBtn = h('button', { class: 'pc-btn', type: 'button', 'aria-label': 'Reproduzir', html: ICON.play });
  const time = h('span', { class: 'pc-time', 'aria-hidden': 'true' }, '0:00 / –:––');
  const seek = h('input', { class: 'pc-seek', type: 'range', min: '0', max: '1000', value: '0', step: '1', 'aria-label': 'Posição do vídeo' });
  const muteBtn = h('button', { class: 'pc-btn', type: 'button', 'aria-label': 'Desativar som', html: ICON.vol });
  const ccBtn = captions ? h('button', { class: 'pc-btn', type: 'button', 'aria-label': 'Legendas', 'aria-pressed': 'true', html: ICON.cc }) : null;
  const fsBtn = h('button', { class: 'pc-btn', type: 'button', 'aria-label': 'Tela cheia', html: ICON.full });
  const bar = h('div', { class: 'player-bar' }, playBtn, time, seek, muteBtn, ccBtn, fsBtn);
  const errBox = h('div', { class: 'player-error', hidden: true },
    h('p', {}, 'Não foi possível carregar o vídeo agora.'),
    h('button', { class: 'btn-ghost', type: 'button', onclick: () => { errBox.hidden = true; video.load(); start(); } }, 'Tentar de novo'));

  root.prepend(video);
  root.append(bar, errBox);

  let started = false;
  function start() {
    if (!started) { video.src = src; started = true; onFirstPlay && onFirstPlay(); }
    root.dataset.state = 'loading';
    const p = video.play();
    if (p && p.catch) p.catch((err) => { if (err.name !== 'AbortError') { root.dataset.state = video.error ? 'error' : 'paused'; } });
  }
  const toggle = () => (video.paused ? start() : video.pause());

  big.addEventListener('click', start);
  playBtn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  video.addEventListener('playing', () => { root.dataset.state = 'playing'; status.textContent = 'Reproduzindo'; });
  video.addEventListener('waiting', () => { root.dataset.state = 'loading'; });
  video.addEventListener('pause', () => { if (root.dataset.state !== 'error') root.dataset.state = 'paused'; status.textContent = 'Pausado'; });
  video.addEventListener('ended', () => { root.dataset.state = 'paused'; });
  video.addEventListener('play', () => { playBtn.innerHTML = ICON.pause; playBtn.setAttribute('aria-label', 'Pausar'); });
  video.addEventListener('pause', () => { playBtn.innerHTML = ICON.play; playBtn.setAttribute('aria-label', 'Reproduzir'); });
  video.addEventListener('error', () => { if (!started) return; root.dataset.state = 'error'; errBox.hidden = false; status.textContent = 'Erro ao carregar o vídeo'; });
  video.addEventListener('timeupdate', () => {
    const d = video.duration;
    time.textContent = `${fmtTime(video.currentTime)} / ${fmtTime(d)}`;
    if (d) { seek.value = String(Math.round((video.currentTime / d) * 1000)); seek.style.setProperty('--p', `${(video.currentTime / d) * 100}%`); }
  });
  video.addEventListener('loadedmetadata', () => { time.textContent = `0:00 / ${fmtTime(video.duration)}`; });
  seek.addEventListener('input', () => { if (video.duration) video.currentTime = (Number(seek.value) / 1000) * video.duration; });

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted ? ICON.mute : ICON.vol;
    muteBtn.setAttribute('aria-label', video.muted ? 'Ativar som' : 'Desativar som');
  });
  ccBtn && ccBtn.addEventListener('click', () => {
    const t = video.textTracks[0];
    if (!t) return;
    const on = t.mode !== 'showing';
    t.mode = on ? 'showing' : 'hidden';
    ccBtn.setAttribute('aria-pressed', String(on));
  });
  fsBtn.addEventListener('click', () => {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (root.requestFullscreen) root.requestFullscreen().catch(() => video.webkitEnterFullscreen && video.webkitEnterFullscreen());
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });
  root.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); if (started) toggle(); else start(); }
  });

  return { el: root, video, pause() { video.pause(); } };
}
