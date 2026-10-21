/* =====================================================================
   BLOCO 07 · O QUE VOCÊ RECEBE
   Um vídeo animado (sem som, em loop) com 3 capítulos:
   Arquivo · Vídeo de instrução · Mapa mental.
   ===================================================================== */
import { createChapterVideo, demo } from './chapter-video.js';

export function mountDeliverVideo(root) {
  const player = createChapterVideo({
    ...demo('entrega'),
    aspect: '4 / 5',
    title: 'O que você recebe: arquivo, vídeo de instrução e mapa mental',
    chapters: [{ t: 0, label: 'Arquivo' }, { t: 5, label: 'Instrução' }, { t: 10.2, label: 'Mapa mental' }],
  });
  root.append(player.el);
}
