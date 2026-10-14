/* =====================================================================
   BLOCO 07 · PRÉVIA DO MAPA MENTAL
   Nível 0: as 3 áreas · Nível 1: ramos da área (expansíveis)
   Nível 2: um ramo com seus tópicos e um exemplo de pedido à IA.
   Breadcrumb + "Voltar" para retornar ao nível anterior.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { MINDMAP } from '../content.js';

export function mountMindmap(root) {
  const base = id('map');
  let area = null;     // índice da área
  let branch = null;   // índice do ramo

  const areaTabs = h('div', { class: 'seg seg-wrap', role: 'tablist', 'aria-label': 'Áreas do mapa' },
    MINDMAP.areas.map((a, i) => h('button', { class: 'seg-btn', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-p`, onclick: () => openArea(i) },
      h('span', { 'aria-hidden': 'true' }, a.icon), ' ', a.label)));
  const crumbs = h('nav', { class: 'crumbs', 'aria-label': 'Nível do mapa' });
  const back = h('button', { class: 'btn-ghost', type: 'button', onclick: goBack }, '← Voltar');
  const view = h('div', { class: 'map-view', id: `${base}-p`, role: 'tabpanel', tabindex: '-1' });

  root.append(
    areaTabs,
    h('div', { class: 'map-bar' }, crumbs, back),
    view,
    h('p', { class: 'note' }, MINDMAP.isDemo ? 'Prévia da estrutura. O mapa completo é entregue após a compra.' : 'O mapa completo é entregue após a compra.'));
  arrowNav(areaTabs, openArea);

  function paintCrumbs() {
    const parts = [h('button', { type: 'button', class: 'crumb', onclick: openRoot }, 'Mapa')];
    if (area != null) parts.push(h('span', { 'aria-hidden': 'true' }, '›'), h('button', { type: 'button', class: 'crumb', onclick: () => openArea(area) }, MINDMAP.areas[area].label));
    if (branch != null) parts.push(h('span', { 'aria-hidden': 'true' }, '›'), h('span', { class: 'crumb crumb-on', 'aria-current': 'location' }, MINDMAP.areas[area].branches[branch].label));
    const last = parts.filter((p) => p.classList.contains('crumb')).pop();
    if (last && branch == null) { last.classList.add('crumb-on'); last.setAttribute('aria-current', 'location'); }
    crumbs.replaceChildren(...parts);
    back.disabled = area == null;
    $$('[role="tab"]', areaTabs).forEach((b, i) => { b.setAttribute('aria-selected', String(i === area)); b.tabIndex = (area == null ? i === 0 : i === area) ? 0 : -1; });
  }

  function swap(node) {
    node.classList.add('fade-in');
    view.replaceChildren(node);
    paintCrumbs();
  }

  function openRoot() {
    area = null; branch = null;
    swap(h('div', { class: 'tree' },
      h('p', { class: 'node node-root' }, MINDMAP.root),
      h('ul', { class: 'tree-kids' }, MINDMAP.areas.map((a, i) => h('li', {},
        h('button', { type: 'button', class: 'node node-btn', onclick: () => openArea(i) },
          h('span', { class: 'node-lbl' }, h('span', { 'aria-hidden': 'true' }, a.icon), a.label), h('span', { class: 'node-go', 'aria-hidden': 'true' }, '→')))))));
  }

  function openArea(i) {
    area = i; branch = null;
    const a = MINDMAP.areas[i];
    swap(h('div', { class: 'tree' },
      h('p', { class: 'node node-root' }, h('span', { 'aria-hidden': 'true' }, a.icon), ' ', a.label),
      h('ul', { class: 'tree-kids' }, a.branches.map((b, j) => {
        const listId = `${base}-a${i}b${j}`;
        const topics = h('ul', { class: 'topics', id: listId, hidden: true }, b.topics.map((t) => h('li', {}, t)),
          h('li', { class: 'topics-more' }, h('button', { type: 'button', class: 'link-btn', onclick: () => openBranch(j) }, 'Ver exemplo de pedido →')));
        return h('li', {},
          h('button', {
            type: 'button', class: 'node node-btn', 'aria-expanded': 'false', 'aria-controls': listId,
            onclick: (e) => { const btn = e.currentTarget; const open = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!open)); topics.hidden = open; },
          }, h('span', { class: 'node-lbl' }, b.label), h('span', { class: 'node-plus', 'aria-hidden': 'true' }, '+')),
          topics);
      }))));
  }

  function openBranch(j) {
    branch = j;
    const a = MINDMAP.areas[area];
    const b = a.branches[j];
    swap(h('div', { class: 'tree' },
      h('p', { class: 'node node-root' }, b.label),
      h('ul', { class: 'tree-kids' }, b.topics.map((t) => h('li', {}, h('p', { class: 'node' }, t)))),
      h('div', { class: 'map-ask' }, h('p', { class: 'mini-h' }, 'Exemplo do que pedir à IA'), h('code', { class: 'cmd' }, `“${b.ask}”`))));
    view.focus({ preventScroll: true });
  }

  function goBack() {
    if (branch != null) openArea(area);
    else openRoot();
    view.focus({ preventScroll: true });
  }

  openRoot();
}
