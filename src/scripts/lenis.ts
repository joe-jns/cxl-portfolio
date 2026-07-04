import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth in-page anchor jumps (nav, hero CTA, footer rewind).
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.length <= 1) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(href, { offset: 0 });
    });
  });
}
