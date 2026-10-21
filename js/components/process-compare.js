/* =====================================================================
   BLOCO 03 · CHECKLIST DE COMPARAÇÃO
   Duas colunas compactas lado a lado (também no celular):
   vermelha (editando sozinho, ✕) × verde (com o Clique Edite, ✓).
   As linhas entram uma de cada vez quando o bloco aparece.
   ===================================================================== */
import { h } from '../core/dom.js';
import { PROCESSES } from '../content.js';

const X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
const V = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

export function mountProcessCompare(root) {
  const col = (key, cls, title, icon, foot) => {
    const p = PROCESSES[key];
    return h('div', { class: `ck-col ${cls}` },
      h('p', { class: 'ck-head' }, h('span', { class: 'ck-title' }, title), h('span', { class: 'ck-count' }, `${p.steps.length} etapas`)),
      h('ul', { class: 'ck-list', 'aria-label': title }, p.steps.map((s, i) => h('li', { style: `--i:${i}` },
        h('span', { class: 'ck-ic', html: icon }), h('span', { class: 'ck-t' }, s.short || s.t)))),
      h('p', { class: 'ck-foot' }, foot));
  };
  root.append(h('div', { class: 'ck' },
    col('traditional', 'ck-bad', 'Editando sozinho', X, 'Horas na linha do tempo'),
    col('assisted', 'ck-good', 'Com o Clique Edite', V, 'Você pede e aprova')));

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('ck-anim');
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      root.classList.add('ck-in');
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(root);
  }
}
