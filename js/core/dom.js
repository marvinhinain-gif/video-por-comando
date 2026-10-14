/* Utilitários pequenos de DOM, reutilizados pelos componentes. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Cria um elemento: h('button', {class:'x', onclick: fn}, 'texto', outroEl) */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const wait = (ms) => new Promise((r) => setTimeout(r, reducedMotion() ? Math.min(ms, 60) : ms));

/** Formata segundos como m:ss */
export function fmtTime(s) {
  if (!isFinite(s) || s < 0) return '–:––';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** Selo padrão de simulação, para nunca confundir demonstração com execução real. */
export function simBadge(text = 'Simulação explicativa') {
  return h('span', { class: 'tag tag-sim', title: 'Conteúdo pré-programado. Não há IA conectada a esta página.' }, text);
}

export function pendingBadge(text = 'Pendente') {
  return h('span', { class: 'tag tag-pending' }, text);
}

/** Navegação por setas num grupo de abas (role=tablist). */
export function arrowNav(list, onPick) {
  list.addEventListener('keydown', (e) => {
    const tabs = $$('[role="tab"]', list);
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    tabs[n].focus();
    onPick(n);
  });
}

let uid = 0;
export const id = (p = 'vpc') => `${p}-${++uid}`;
