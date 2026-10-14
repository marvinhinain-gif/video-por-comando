/* =====================================================================
   BLOCO 02 · DEMONSTRAÇÃO DE COMANDO (vídeo interativo)
   Escolha o comando → o vídeo da simulação correspondente toca.
   Capítulos: enviado → interpretação → organização → execução → resultado.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { COMMAND_DEMOS, DEMO_CHAPTERS } from '../content.js';
import { createChapterVideo, demo } from './chapter-video.js';

export function mountCommandDemo(root) {
  const base = id('cmd');
  let player = null;

  const tabs = h('div', { class: 'chips chips-2', role: 'tablist', 'aria-label': 'Escolha um comando' },
    COMMAND_DEMOS.map((d, i) => h('button', {
      class: 'chip chip-cmd', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-p`,
      onclick: () => pick(i, true),
    }, h('span', { class: 'chip-v' }, `“${d.command}”`))));
  const stage = h('div', { class: 'cv-stage', id: `${base}-p`, role: 'tabpanel' });
  root.append(tabs, stage);
  arrowNav(tabs, (i) => pick(i, true));

  function pick(i, user) {
    $$('[role="tab"]', tabs).forEach((t, j) => { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    if (player) player.pause();
    const name = `cmd-${COMMAND_DEMOS[i].id}`;
    player = createChapterVideo({ ...demo(name), chapters: DEMO_CHAPTERS[name], title: `Simulação: ${COMMAND_DEMOS[i].command}` });
    player.el.classList.add('fade-in');
    stage.replaceChildren(player.el);
    if (user) player.play();
  }
  pick(0, false);
}
