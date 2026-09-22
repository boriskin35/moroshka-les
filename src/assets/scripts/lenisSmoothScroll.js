import '@styles/lenis.css';

import Lenis from 'lenis';

// Respect reduced-motion preferences — skip smooth scrolling when requested.
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReducedMotion) {
  // https://github.com/darkroomengineering/lenis
  const lenis = new Lenis({
    autoRaf: true,
  });
  // Expose for scroll-locking (e.g. mobile menu modal).
  window.__moroshkaLenis = lenis;
} else {
  document.documentElement.classList.remove('lenis', 'lenis-smooth');
}
