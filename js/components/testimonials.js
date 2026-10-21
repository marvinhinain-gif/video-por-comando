/* =====================================================================
   DEPOIMENTOS · CARROSSEL DE PRINTS DO WHATSAPP
   Faixa pequena que passa sozinha, devagar e sem parar (pausa quando
   a pessoa toca ou passa o mouse). Só mostra prints reais listados em
   CONFIG.testimonials; com a lista vazia, o bloco fica escondido.
   ===================================================================== */
import { h } from '../core/dom.js';
import { CONFIG } from '../config.js';

const PX_PER_SEC = 28;   // velocidade da faixa

export function mountTestimonials(root) {
  const list = (CONFIG.testimonials || []).filter((t) => t && t.src);
  const section = root.closest('section');
  if (!list.length) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;

  const card = (t, i, clone) => h('figure', { class: 'testi-card', 'aria-hidden': clone ? 'true' : null },
    h('img', { src: t.src, alt: clone ? '' : (t.alt || `Depoimento ${i + 1}`), loading: 'lazy', decoding: 'async' }));
  // a lista é repetida para a faixa dar a volta sem emenda
  const reps = list.length < 4 ? 3 : 2;
  const items = [];
  for (let r = 0; r < reps; r++) list.forEach((t, i) => items.push(card(t, i, r > 0)));
  const track = h('div', { class: 'testi-track' }, items);
  const view = h('div', { class: 'testi-view', role: 'region', 'aria-label': 'Prints de depoimentos' }, track);
  root.append(view);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { view.classList.add('testi-static'); return; }

  let x = 0, last = 0, paused = false, inView = false, raf = 0, resumeAt = 0;
  const loopW = () => track.scrollWidth / reps;
  const frame = (t) => {
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    if (!paused && Date.now() >= resumeAt) {
      x += PX_PER_SEC * dt;
      const w = loopW();
      if (w > 0 && x >= w) x -= w;
      track.style.transform = `translate3d(${-x}px,0,0)`;
    }
    raf = inView ? requestAnimationFrame(frame) : 0;
  };
  new IntersectionObserver((es) => {
    inView = es[0].isIntersecting;
    if (inView && !raf) { last = 0; raf = requestAnimationFrame(frame); }
  }).observe(view);
  view.addEventListener('mouseenter', () => { paused = true; });
  view.addEventListener('mouseleave', () => { paused = false; });
  view.addEventListener('touchstart', () => { resumeAt = Date.now() + 2500; }, { passive: true });
}
