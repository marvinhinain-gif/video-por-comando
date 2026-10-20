/* =====================================================================
   VÍDEO POR COMANDO — ENTRADA
   Monta cada componente no seu ponto [data-component].
   ===================================================================== */
import { $$ } from './core/dom.js';
import { initCheckout } from './core/checkout.js';
import { initTracking } from './core/tracking.js';
import { mountHeroVsl } from './components/hero-vsl.js';
import { mountCommandDemo } from './components/command-demo.js';
import { mountProcessCompare } from './components/process-compare.js';
import { mountGuidedSteps } from './components/guided-steps.js';
import { mountGallery } from './components/gallery.js';
import { mountRequestSim } from './components/request-sim.js';
import { mountBeforeAfter } from './components/before-after.js';
import { mountFileDemo } from './components/file-demo.js';
import { mountMindmap } from './components/mindmap.js';
import { mountFaq } from './components/faq.js';
import { initAutoplayUnlock, initFitText, initHeader, initHeroMotion, initDust, initBuyBar, initOfferView, applyConfigText } from './components/page-chrome.js';

const COMPONENTS = {
  'hero-vsl': mountHeroVsl,
  'command-demo': mountCommandDemo,
  'process-compare': mountProcessCompare,
  'guided-steps': mountGuidedSteps,
  gallery: mountGallery,
  'request-sim': mountRequestSim,
  'before-after': mountBeforeAfter,
  'file-demo': mountFileDemo,
  mindmap: mountMindmap,
  faq: mountFaq,
};

function mount(el) {
  if (el.dataset.mounted) return;
  el.dataset.mounted = '1';
  const fn = COMPONENTS[el.dataset.component];
  try { fn && fn(el); } catch (err) {
    console.error(`[${el.dataset.component}]`, err);
    el.textContent = 'Não foi possível carregar este conteúdo. Recarregue a página.';
  }
}

document.documentElement.classList.add('js');
applyConfigText();
initFitText();
initTracking();
initCheckout();
// Componentes leves (só HTML): montam juntos, sem saltos de layout.
// Nenhum vídeo da galeria baixa nada antes do toque.
$$('[data-component]').forEach(mount);
initHeader();
initHeroMotion();
initDust();
initBuyBar();
initOfferView();
initAutoplayUnlock();
