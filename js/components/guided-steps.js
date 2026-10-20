/* =====================================================================
   BLOCO 04 · 3 PASSOS (vídeo interativo)
   Um vídeo com 3 capítulos. Os botões dos passos pulam para o trecho;
   o texto do passo acompanha o capítulo que está tocando.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { DEMO_CHAPTERS } from '../content.js';
import { createChapterVideo, demo } from './chapter-video.js';

const STEPS = [
  { short: 'Adicione', title: '1. Receba e adicione o arquivo', copy: 'Depois da compra, você recebe o Clique Edite e um vídeo mostrando como começar. É só seguir o passo a passo para adicionar o arquivo à sua IA.' },
  { short: 'Diga', title: '2. Diga o que você quer', copy: 'Escreva ou mande um comando de voz, como: “Quero deixar esse vídeo mais curto e dinâmico.”' },
  { short: 'Deixe a IA', title: '3. Deixe a IA ajudar na edição', copy: 'A IA entende seu pedido e ajuda a organizar e executar as etapas que suas ferramentas permitem. Não gostou de alguma coisa? É só pedir outro ajuste.' },
];

export function mountGuidedSteps(root) {
  const base = id('guide');
  const player = createChapterVideo({ ...demo('guiado'), chapters: DEMO_CHAPTERS.guiado, title: 'Simulação: os 3 passos', showChapters: false });

  const stepper = h('div', { class: 'stepper', role: 'tablist', 'aria-label': 'Passos' },
    STEPS.map((s, i) => h('button', { class: 'stepper-btn', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-p`, onclick: () => player.seek(i) },
      h('span', { class: 'stepper-n' }, String(i + 1)), h('span', { class: 'stepper-l' }, s.short))));
  const line = h('div', { class: 'stepper-line', 'aria-hidden': 'true' }, h('span'));
  const head = h('div', { class: 'step-copy', id: `${base}-p`, role: 'tabpanel', 'aria-live': 'polite' });

  root.append(h('div', { class: 'stepper-wrap' }, line, stepper), head, player.el);
  arrowNav(stepper, (i) => player.seek(i));

  function show(i) {
    const k = Math.max(0, i);
    $$('.stepper-btn', stepper).forEach((b, j) => {
      b.setAttribute('aria-selected', String(j === k));
      b.tabIndex = j === k ? 0 : -1;
      b.classList.toggle('is-done', j < k);
    });
    line.firstChild.style.width = `${(k / 2) * 100}%`;
    head.replaceChildren(h('h3', { class: 'h3' }, STEPS[k].title), h('p', {}, STEPS[k].copy));
  }
  player.onChapter(show);
  show(0);
}
