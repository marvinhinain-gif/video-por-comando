/* =====================================================================
   BLOCO 07 · DEMONSTRAÇÃO DO ARQUIVO
   Explica o que é, onde se usa, como se adiciona e o que acontece
   depois. Não disponibiliza o arquivo comercial.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { FILE_DEMO } from '../content.js';

const FLOW = ['Arquivo', 'Sua IA', 'Seu pedido', 'Seu vídeo'];
// qual nó do fluxo cada aba ilumina
const LIGHT = { oque: [0], onde: [1], como: [0, 1], depois: [2, 3] };

export function mountFileDemo(root) {
  const base = id('file');
  const tabs = h('div', { class: 'seg seg-wrap', role: 'tablist', 'aria-label': 'Sobre o arquivo' },
    FILE_DEMO.map((f, i) => h('button', { class: 'seg-btn', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-p`, onclick: () => pick(i) }, f.label)));
  const flow = h('ol', { class: 'flow', 'aria-label': 'Caminho do arquivo até o vídeo' },
    FLOW.map((f) => h('li', { class: 'flow-node' }, f)));
  const body = h('div', { class: 'file-body', id: `${base}-p`, role: 'tabpanel', 'aria-live': 'polite' });

  root.append(
    tabs, flow, body,
    h('p', { class: 'note' }, 'O arquivo completo é entregue após a compra.'));
  arrowNav(tabs, pick);

  function pick(i) {
    const f = FILE_DEMO[i];
    $$('[role="tab"]', tabs).forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    $$('.flow-node', flow).forEach((n, j) => n.classList.toggle('on', LIGHT[f.id].includes(j)));
    const view = h('div', { class: 'fade-in' }, h('p', { class: 'file-title' }, f.title), h('p', {}, f.body));
    body.replaceChildren(view);
  }
  pick(0);
}
