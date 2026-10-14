/* =====================================================================
   BLOCO 09 · FAQ
   Botões com aria-expanded; abre e fecha sem rolar a página.
   ===================================================================== */
import { h, id } from '../core/dom.js';
import { FAQ } from '../content.js';

export function mountFaq(root) {
  const base = id('faq');
  root.append(...FAQ.map((item, i) => {
    const qid = `${base}-q${i}`;
    const aid = `${base}-a${i}`;
    const answer = h('div', { class: 'faq-a', id: aid, role: 'region', 'aria-labelledby': qid, hidden: true }, h('p', {}, item.a));
    const btn = h('button', { class: 'faq-q', id: qid, type: 'button', 'aria-expanded': 'false', 'aria-controls': aid },
      h('span', {}, item.q), h('span', { class: 'faq-ico', 'aria-hidden': 'true' }));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      answer.hidden = open;
      if (!open) { answer.classList.remove('fade-in'); void answer.offsetWidth; answer.classList.add('fade-in'); }
    });
    return h('div', { class: 'faq-item' }, h('h3', { class: 'faq-h' }, btn), answer);
  }));
}
