/* =====================================================================
   BLOCO 06 · PEDIDOS DO DIA A DIA (vídeo interativo)
   Cada pedido abre o vídeo da simulação correspondente:
   pedido → proposta → resultado → novo ajuste.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { REQUESTS, DEMO_CHAPTERS } from '../content.js';
import { createChapterVideo, demo } from './chapter-video.js';

export function mountRequestSim(root) {
  const base = id('req');
  let player = null;

  const tabs = h('div', { class: 'chips chips-col', role: 'tablist', 'aria-label': 'Pedidos comuns' },
    REQUESTS.map((r, i) => h('button', {
      class: 'chip chip-cmd', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-p`,
      onclick: () => pick(i, true),
    }, h('span', { class: 'chip-q' }, r.label), h('span', { class: 'chip-v' }, `“${r.ask}”`))));
  const stage = h('div', { class: 'cv-stage', id: `${base}-p`, role: 'tabpanel' });
  root.append(tabs, stage);
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
