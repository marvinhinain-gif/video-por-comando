/* =====================================================================
   BLOCO 06 · COMPARADOR ANTES E DEPOIS
   - Durações lidas dos próprios arquivos (loadedmetadata), nunca digitadas
   - Lado a lado com reprodução sincronizada, ou alternando as versões
   - Sem os dois arquivos reais: estado pendente identificado
   ===================================================================== */
import { h, $$, fmtTime, id } from '../core/dom.js';
import { CONFIG } from '../config.js';
import { demo } from './chapter-video.js';
import { registerVideo } from '../core/media.js';

export function mountBeforeAfter(root) {
  const cfg = CONFIG.comparison;
  const ready = Boolean(cfg.original.src && cfg.edited.src);
  const base = id('ba');

  const head = h('div', { class: 'panel-bar' },
    h('p', { class: 'panel-kicker' }, 'Antes e depois'),
    ready ? h('span', { class: 'tag tag-real' }, 'Vídeos reais') : h('span', { class: 'tag tag-sim' }, 'Ilustração'));


  /* Sem os arquivos reais, usa a ilustração em vídeo (marcada) e esconde os números. */
  const illus = !ready;
  const orig = ready ? cfg.original : { ...demo('corte-bruto'), captions: '' };
  const edit = ready ? cfg.edited : { ...demo('corte-editado'), captions: '' };

  const mk = (v, label) => {
    const video = h('video', { playsinline: true, muted: true, loop: true, preload: 'none', poster: v.poster || null, 'data-sync-group': base, 'aria-label': label });
    if (illus) { const b = v.src.replace(/\.mp4$/, ''); video.append(h('source', { src: `${b}.mp4`, type: 'video/mp4' }), h('source', { src: `${b}.webm`, type: 'video/webm' })); }
    else video.append(h('source', { src: v.src }));
    if (v.captions) video.append(h('track', { kind: 'captions', src: v.captions, srclang: 'pt', label: 'Português' }));
    video.muted = true;
    registerVideo(video);
    return video;
  };
  const vo = mk(orig, illus ? 'Ilustração: gravação bruta' : 'Vídeo original');
  const ve = mk(edit, illus ? 'Ilustração: vídeo editado' : 'Vídeo editado');
  const durO = h('span', { class: 'ba-dur' }, 'Duração: carregando…');
  const durE = h('span', { class: 'ba-dur' }, 'Duração: carregando…');
  // Moldura com barra de progresso e ícone de pausa (sem controles nativos, sempre sem som).
  const frame = (v) => {
    const bar = h('i');
    const pause = h('span', { class: 'ba-pause', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>' });
    const tick = () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; if (!v.paused) requestAnimationFrame(tick); };
    v.addEventListener('play', () => { v.parentElement.classList.remove('paused'); tick(); });
    v.addEventListener('pause', () => v.parentElement.classList.add('paused'));
    v.addEventListener('seeked', tick);
    v.addEventListener('click', () => { if (v.paused) { v.dataset.userPaused = ''; delete v.dataset.userPaused; v.play().catch(() => {}); } else { v.dataset.userPaused = '1'; v.pause(); } });
    return h('div', { class: 'ba-frame' }, v, pause, h('span', { class: 'ba-bar', 'aria-hidden': 'true' }, bar));
  };
  const figO = h('figure', { class: 'ba-fig' }, h('figcaption', {}, h('span', {}, 'Vídeo original'), durO), frame(vo));
  const figE = h('figure', { class: 'ba-fig' }, h('figcaption', {}, h('span', {}, 'Vídeo editado'), durE), frame(ve));

  const stats = h('dl', { class: 'ba-stats' },
    h('div', {}, h('dt', {}, 'Original'), h('dd', { 'data-k': 'o' }, '–:––')),
    h('div', {}, h('dt', {}, 'Editado'), h('dd', { 'data-k': 'e' }, '–:––')),
    h('div', {}, h('dt', {}, 'Diferença de duração'), h('dd', { 'data-k': 'd' }, '–')));

  const modeTabs = h('div', { class: 'seg', role: 'tablist', 'aria-label': 'Modo de comparação' },
    h('button', { class: 'seg-btn', role: 'tab', type: 'button', 'aria-selected': 'true', onclick: () => setMode('side') }, 'Lado a lado'),
    h('button', { class: 'seg-btn', role: 'tab', type: 'button', 'aria-selected': 'false', onclick: () => setMode('toggle') }, 'Alternar'));
  const viewTabs = h('div', { class: 'seg', role: 'tablist', 'aria-label': 'Versão exibida', hidden: true },
    h('button', { class: 'seg-btn', role: 'tab', type: 'button', 'aria-selected': 'true', onclick: () => show('o') }, 'Original'),
    h('button', { class: 'seg-btn', role: 'tab', type: 'button', 'aria-selected': 'false', onclick: () => show('e') }, 'Editado'));

  const grid = h('div', { class: 'ba-grid' }, figO, figE);
  if (illus) { stats.hidden = true; [durO, durE].forEach((d) => { d.hidden = true; }); }
  const changes = illus ? h('p', { class: 'note' }, 'Ilustração do tipo de corte. Os vídeos reais entram aqui quando forem configurados.') : cfg.changes.length
    ? h('div', {}, h('p', { class: 'mini-h' }, 'Principais modificações'), h('ul', { class: 'tick-list' }, cfg.changes.map((c) => h('li', {}, c))))
    : h('p', { class: 'note' }, 'Lista de modificações ainda não preenchida na configuração.');

  root.append(head, h('div', { class: 'ba-ctrls' }, modeTabs, viewTabs), grid, stats, changes);

  /* Durações reais: carrega só os metadados quando o comparador se aproxima da tela */
  const io = new IntersectionObserver((ents) => {
    if (!ents.some((e) => e.isIntersecting)) return;
    io.disconnect();
    [vo, ve].forEach((v) => { v.preload = 'metadata'; v.load(); });
  }, { rootMargin: '300px' });
  io.observe(root);
  // Os vídeos tocam sozinhos, sempre sem som e em loop, quando aparecem na tela.
  let inView = false;
  const playVisible = () => {
    [vo, ve].forEach((v) => {
      const shown = !v.closest('figure').hidden;
      if (inView && shown && !v.dataset.userPaused) { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
    });
  };
  [vo, ve].forEach((v) => { v.preload = 'auto'; v.dataset.auto = '1'; v.addEventListener('canplay', () => { if (inView && v.paused && !v.dataset.userPaused && !v.closest('figure').hidden) v.play().catch(() => {}); }); });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver((es) => { inView = es[0].isIntersecting; playVisible(); }, { threshold: 0.3 }).observe(grid);
  }

  const paintDur = () => {
    const o = vo.duration, e = ve.duration;
    if (isFinite(o)) { durO.textContent = `Duração: ${fmtTime(o)}`; stats.querySelector('[data-k="o"]').textContent = fmtTime(o); }
    if (isFinite(e)) { durE.textContent = `Duração: ${fmtTime(e)}`; stats.querySelector('[data-k="e"]').textContent = fmtTime(e); }
    if (isFinite(o) && isFinite(e)) {
      const d = Math.round(o - e);
      stats.querySelector('[data-k="d"]').textContent = d > 0 ? `${d} s a menos` : d < 0 ? `${-d} s a mais` : 'mesma duração';
    }
  };
  vo.addEventListener('loadedmetadata', paintDur);
  ve.addEventListener('loadedmetadata', paintDur);
  [vo, ve].forEach((v, i) => v.addEventListener('error', () => { (i ? durE : durO).textContent = 'Arquivo indisponível'; }, true));

  function setMode(m) {
    $$('[role="tab"]', modeTabs).forEach((b, i) => b.setAttribute('aria-selected', String((m === 'side') === (i === 0))));
    root.dataset.mode = m;
    viewTabs.hidden = m !== 'toggle';
    if (m === 'toggle') show('o'); else { figO.hidden = false; figE.hidden = false; playVisible(); }
  }
  function show(k) {
    $$('[role="tab"]', viewTabs).forEach((b, i) => b.setAttribute('aria-selected', String((k === 'o') === (i === 0))));
    const [on, off] = k === 'o' ? [figO, figE] : [figE, figO];
    off.querySelector('video').pause();
    off.hidden = true; on.hidden = false;
    on.classList.remove('fade-in'); void on.offsetWidth; on.classList.add('fade-in');
    playVisible();
  }
  setMode('side');
}
