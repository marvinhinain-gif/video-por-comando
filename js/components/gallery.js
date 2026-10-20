/* =====================================================================
   BLOCO 05 · GALERIA
   Categorias → exemplos (2 lado a lado no computador, carrossel no
   celular). Cada exemplo: vídeo real (arquivo ou Instagram) ou uma
   ilustração marcada, + o comando usado.
   ===================================================================== */
import { h, $$, arrowNav, id } from '../core/dom.js';
import { GALLERY } from '../content.js';
import { createPlayer } from './video-player.js';
import { createChapterVideo, demo } from './chapter-video.js';

export function mountGallery(root) {
  const base = id('gal');
  let cat = 0;
  let players = [];

  const tabs = h('div', { class: 'cat-tabs', role: 'tablist', 'aria-label': 'Tipos de vídeo' },
    GALLERY.map((c, i) => h('button', { class: 'cat-tab', role: 'tab', type: 'button', id: `${base}-t${i}`, 'aria-controls': `${base}-p`, onclick: () => pick(i) },
      h('span', { 'aria-hidden': 'true' }, c.icon), ' ', c.label)));
  const desc = h('p', { class: 'cat-desc', 'aria-live': 'polite' });
  const track = h('div', { class: 'track', tabindex: '0', 'aria-label': 'Exemplos' });
  const prev = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Exemplo anterior', onclick: () => step(-1) }, '←');
  const next = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Próximo exemplo', onclick: () => step(1) }, '→');
  const dots = h('div', { class: 'dots', 'aria-hidden': 'true' });
  const nav = h('div', { class: 'gal-nav' }, prev, dots, next);

  root.append(tabs, desc, h('div', { id: `${base}-p`, role: 'tabpanel' }, track), nav);
  arrowNav(tabs, pick);
  track.addEventListener('keydown', (e) => {
    if (e.target !== track) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
  let raf = 0;
  track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paintNav); clearTimeout(track._t); track._t = setTimeout(playActive, 180); }, { passive: true });
  addEventListener('resize', paintNav);

  function card(ex) {
    let media;
    const real = ex.src || ex.instagram;
    if (real) {
      const p = createPlayer({ src: ex.src || ex.instagram, poster: ex.poster, captions: ex.captions, aspect: '9 / 16', title: ex.title });
      players.push(p);
      media = p.el;
    } else if (ex.demos && ex.demos.length > 1) {
      const v = variants(ex);
      players.push(v);
      media = v.el;
    } else {
      const v = createChapterVideo({ ...demo(ex.demo), aspect: '9 / 16', loop: true, autoplay: true, showChapters: false, title: ex.real ? ex.title : `Ilustração: ${ex.title}` });
      players.push(v);
      media = v.el;
    }
    return h('article', { class: 'ex' },
      h('div', { class: 'ex-media' }, media),
      h('h3', { class: 'ex-title' }, ex.title),
      h('code', { class: 'cmd' }, `“${ex.command}”`),
      h('p', { class: 'ex-goal' }, real && ex.resultSummary ? ex.resultSummary : ex.goal));
  }

  /* Várias versões no mesmo card: seletor "Versão 1 · Versão 2";
     tocam uma depois da outra, sem som, cada uma com a barra de progresso. */
  function variants(ex) {
    const stage = h('div', { class: 'var-stage' });
    let cur = null, idx = 0;
    const btns = ex.demos.map((d, i) => h('button', { class: 'seg-btn', role: 'tab', type: 'button', onclick: () => show(i, true) }, `Versão ${i + 1}`));
    const seg = h('div', { class: 'seg var-seg', role: 'tablist', 'aria-label': 'Versões' }, btns);
    function show(i, autoplay) {
      idx = i;
      btns.forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
      if (cur) cur.pause();
      cur = createChapterVideo({ ...demo(ex.demos[i]), aspect: '9 / 16', loop: false, autoplay: true, showChapters: false, title: `${ex.title} · versão ${i + 1}` });
      cur.video.addEventListener('ended', () => show((idx + 1) % ex.demos.length, true));
      stage.replaceChildren(cur.el);
      // a 1ª checagem de visibilidade do vídeo novo pode chegar antes dele entrar na tela
      if (autoplay) { const v = cur; v.play(); setTimeout(() => { if (v === cur && v.video.paused) v.play(); }, 250); }
    }
    show(0, false);
    return { el: h('div', { class: 'var' }, stage, seg), get video() { return cur.video; }, play: () => cur.play(), pause: () => cur.pause() };
  }

  let galleryInView = false;
  new IntersectionObserver((es) => { galleryInView = es[0].isIntersecting; playActive(); }, { threshold: 0.4 }).observe(track);
  function playActive() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const idx = Math.round(track.scrollLeft / cardW());
    players.forEach((p) => { if (galleryInView && p.play && p.video && p.video.loop) p.play(); });
  }

  function pick(i) {
    players.forEach((p) => p.pause());
    players = [];
    cat = i;
    $$('[role="tab"]', tabs).forEach((t, j) => { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    desc.textContent = GALLERY[i].description;
    const items = GALLERY[i].examples.map(card);
    track.replaceChildren(...items);
    track.scrollLeft = 0;
    track.classList.remove('fade-in'); void track.offsetWidth; track.classList.add('fade-in');
    dots.replaceChildren(...items.map(() => h('span')));
    requestAnimationFrame(() => { paintNav(); playActive(); });
  }

  function cardW() { const c = track.firstElementChild; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 1; }

  function step(dir) {
    players.forEach((p) => p.pause());
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * cardW(), behavior: reduce ? 'auto' : 'smooth' });
  }

  function paintNav() {
    const n = track.children.length;
    const perView = Math.max(1, Math.round(track.clientWidth / cardW()));
    nav.hidden = n <= perView;
    const idx = Math.round(track.scrollLeft / cardW());
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    $$('span', dots).forEach((d, j) => d.classList.toggle('on', j === idx));
  }

  pick(0);
}
