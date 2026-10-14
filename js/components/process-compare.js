/* =====================================================================
   BLOCO 03 · COMPARAÇÃO DE PROCESSOS
   Computador: as duas colunas lado a lado.
   Celular: alternância entre as duas (o número de etapas fica visível
   nas abas, então a comparação se entende mesmo sem tocar).
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { PROCESSES } from '../content.js';

export function mountProcessCompare(root) {
  const keys = ['traditional', 'assisted'];
  const base = id('proc');

  const tabs = h('div', { class: 'seg proc-tabs', role: 'tablist', 'aria-label': 'Escolha o processo' },
    keys.map((k, i) => h('button', {
      class: 'seg-btn', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-${k}`,
      onclick: () => setFocus(k),
    }, k === 'traditional' ? `Tradicional · ${PROCESSES[k].steps.length}` : `Com IA · ${PROCESSES[k].steps.length}`)));

  const cols = keys.map((k, ci) => {
    const p = PROCESSES[k];
    return h('div', { class: `proc-col proc-${k}`, id: `${base}-${k}`, role: 'tabpanel', 'aria-labelledby': `${base}-t${ci}` },
      h('p', { class: 'proc-head' }, h('span', {}, p.label), h('span', { class: 'proc-count' }, `${p.steps.length} etapas`)),
      h('ol', { class: 'proc-list' }, p.steps.map((s, i) => h('li', { class: 'proc-step' },
        h('span', { class: 'proc-n' }, String(i + 1).padStart(2, '0')),
        h('span', { class: 'proc-t' }, s.t),
        h('span', { class: `who ${s.who && s.who !== 'Você' ? 'who-ai' : ''}` }, s.who || 'Você')))));
  });

  root.append(tabs, h('div', { class: 'proc-cols' }, ...cols));
  arrowNav(tabs, (i) => setFocus(keys[i]));

  function setFocus(k) {
    root.dataset.focus = k;
    $$('[role="tab"]', tabs).forEach((t, i) => { const on = keys[i] === k; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  }
  setFocus('assisted');
}
