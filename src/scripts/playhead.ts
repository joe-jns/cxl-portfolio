import { scroll } from 'motion';

// Progress "playhead" bar driven by page scroll (no manual scroll listener).
// In horizontal mode the GSAP pin maps vertical scroll to horizontal travel,
// so this 0..1 page progress still reflects how far through the site you are.
// The chapter-nav active state is owned by horizontal.ts (it knows the panel
// layout in both the pinned-horizontal and the vertical fallback).
const bar = document.getElementById('playhead-bar');
if (bar) {
  scroll((progress: number) => {
    bar.style.width = `${progress * 100}%`;
  });
}
