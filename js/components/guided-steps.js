/* =====================================================================
   BLOCO 04 · 3 PASSOS (vídeo interativo)
   Um vídeo com 3 capítulos. Os botões dos passos pulam para o trecho;
   o texto do passo acompanha o capítulo que está tocando.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { DEMO_CHAPTERS } from '../content.js';
import { createChapterVideo, demo } from './chapter-video.js';

const STEPS = [
  { short: 'Adicione', title: '1. Adicione o arquivo ao Claude', copy: 'Receba o Vídeo por Comando™ e adicione o arquivo ao seu Claude seguindo as instruções.' },
  { short: 'Diga', title: '2. Diga o que você quer criar', copy: 'Escreva ou dite um comando simples, como: “Quero um vídeo curto para divulgar meu produto.”' },
  { short: 'Crie', title: '3. Deixe a IA ajudar a criar', copy: 'O Claude entende seu pedido e ajuda a organizar, criar e editar seu vídeo com os recursos compatíveis. Quer mudar alguma coisa? É só pedir um novo ajuste.' },
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
