/* =====================================================================
   BLOCO 06 · PEÇA DO SEU JEITO
   Abas curtas (Mais curto · Mais forte · Virar anúncio) → o vídeo da
   simulação correspondente toca sozinho, sem som, com capítulos.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { REQUESTS, DEMO_CHAPTERS } from '../content.js';
import { createChapterVideo, demo } from './chapter-video.js';

const ICON = {
  curto: '<path d="M6 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 8l12 9M8 16l12-9"/>',
  mensagem: '<path d="M12 3l2.2 5.6L20 9l-4.5 3.8L17 19l-5-3.2L7 19l1.5-6.2L4 9l5.8-.4z"/>',
  anuncio: '<path d="M4 10v4l3 .5V9.5zM7 9.5l10-4.5v14l-10-4.5M17 9h2a2 2 0 0 1 0 6h-2M8 15l1.5 5"/>',
};

export function mountRequestSim(root) {
  const base = id('req');
  let player = null;

  const tabs = h('div', { class: 'seg req-tabs', role: 'tablist', 'aria-label': 'Exemplos de pedidos' },
    REQUESTS.map((r, i) => h('button', {
      class: 'seg-btn', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-p`,
      onclick: () => pick(i, true),
    }, h('span', { class: 'req-ic', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24">${ICON[r.id] || ''}</svg>` }), r.short || r.label)));
  const stage = h('div', { class: 'cv-stage', id: `${base}-p`, role: 'tabpanel' });
  root.append(h('p', { class: 'req-kicker' }, 'Peça do seu jeito'), tabs, stage);
  arrowNav(tabs, (i) => pick(i, true));

  function pick(i, user) {
    $$('[role="tab"]', tabs).forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    if (player) player.pause();
    const name = `pedido-${REQUESTS[i].id}`;
    player = createChapterVideo({ ...demo(name), chapters: DEMO_CHAPTERS[name], title: `Simulação: ${REQUESTS[i].ask}` });
    player.el.classList.add('fade-in');
    stage.replaceChildren(player.el);
    if (user) player.play();
  }
  pick(0, false);
}
