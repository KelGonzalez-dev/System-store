/* Un único listener de scroll para toda la página (throttle con rAF) */
const subs = new Set();
let ticking = false;

function run() {
  ticking = false;
  const y = window.scrollY;
  subs.forEach((fn) => fn(y));
}
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(run);
}

export function subscribeScroll(fn) {
  if (subs.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  subs.add(fn);
  fn(window.scrollY);
  return () => {
    subs.delete(fn);
    if (subs.size === 0) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };
}
