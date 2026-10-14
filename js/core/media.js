/* =====================================================================
   COORDENADOR DE VÍDEOS
   Quando um vídeo começa a tocar, os outros da página pausam.
   Vídeos do mesmo grupo (data-sync-group) podem tocar juntos,
   como no comparador antes/depois.
   ===================================================================== */

const players = new Set();

export function registerVideo(video) {
  players.add(video);
  video.addEventListener('play', () => {
    const group = video.dataset.syncGroup;
    players.forEach((other) => {
      if (other === video || other.paused) return;
      if (group && other.dataset.syncGroup === group) return;
      other.pause();
    });
    document.dispatchEvent(new CustomEvent('vpc:media-play', { detail: video }));
  });
}

/** Avisa players externos (YouTube/Vimeo) para pararem quando outro vídeo toca. */
export function onOtherMediaPlay(self, cb) {
  document.addEventListener('vpc:media-play', (e) => { if (e.detail !== self) cb(); });
}

export function announcePlay(self) {
  players.forEach((v) => { if (!v.paused) v.pause(); });
  document.dispatchEvent(new CustomEvent('vpc:media-play', { detail: self }));
}

/** Detecta o tipo de origem do vídeo. */
export function sourceKind(src) {
  if (!src) return 'none';
  if (/youtu\.?be/.test(src)) return 'youtube';
  if (/vimeo\.com/.test(src)) return 'vimeo';
  if (/instagram\.com\/(p|reel|reels|tv)\//.test(src)) return 'instagram';
  return 'file';
}

export function embedUrl(src) {
  const kind = sourceKind(src);
  if (kind === 'youtube') {
    const m = src.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0&playsinline=1&cc_load_policy=1` : '';
  }
  if (kind === 'vimeo') {
    const m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1&playsinline=1` : '';
  }
  if (kind === 'instagram') {
    const m = src.match(/instagram\.com\/(?:p|reel|reels|tv)\/([\w-]+)/);
    return m ? `https://www.instagram.com/p/${m[1]}/embed/` : '';
  }
  return '';
}
