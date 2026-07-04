import { inView, animate } from 'motion';
import type { DOMKeyframesDefinition } from 'motion';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const keyframes: DOMKeyframesDefinition = {
  opacity: [0, 1],
  transform: ['translateY(24px)', 'translateY(0px)'],
};

document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
  if (reduce) { el.style.opacity = '1'; return; }
  el.style.opacity = '0';
  const stop = inView(el, () => {
    animate(el as Element, keyframes, { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const });
    stop(); // reveal once: stop observing so it does not re-hide/replay on re-entry
  }, { amount: 0.25 });
});
