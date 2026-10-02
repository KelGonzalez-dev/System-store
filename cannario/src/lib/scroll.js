// ============================================================
// Motor de scroll único: un solo requestAnimationFrame por frame,
// sin lecturas de layout dentro del bucle (solo escribe transforms).
// Así las animaciones 3D van fluidas en móvil y escritorio.
// ============================================================
import { useEffect, useLayoutEffect, useRef } from 'react';

const subs = new Set();
const state = { y: 0, vh: typeof window !== 'undefined' ? window.innerHeight : 800, vw: typeof window !== 'undefined' ? window.innerWidth : 1200 };
let queued = false;

function frame() {
  queued = false;
  state.y = window.scrollY;
  subs.forEach((fn) => fn(state));
}
export function requestFrame() {
  if (!queued) { queued = true; requestAnimationFrame(frame); }
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', () => { state.vh = window.innerHeight; state.vw = window.innerWidth; requestFrame(); }, { passive: true });
}

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Llama a `fn(progress, state, box)` en cada frame mientras el elemento está cerca del viewport.
 * box = { top, height } medido solo cuando cambia el tamaño (nunca dentro del bucle).
 * mode 'pass': 0 cuando el top entra por abajo, 1 cuando el bottom sale por arriba.
 * mode 'pin' : 0 cuando el top toca el techo, 1 cuando el bottom toca el piso (secciones sticky).
 */
export function useScrollFrame(ref, fn, mode = 'pass', deps = []) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const box = { top: 0, height: 0 };
    const measure = () => {
      const r = el.getBoundingClientRect();
      box.top = r.top + window.scrollY;
      box.height = r.height;
      requestFrame();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.body);
    const sub = (s) => {
      const { y, vh } = s;
      if (y + vh < box.top - vh * 0.25 || y > box.top + box.height + vh * 0.25) return; // fuera de vista: no trabajar
      const p = mode === 'pin'
        ? clamp((y - box.top) / Math.max(1, box.height - vh))
        : clamp((y + vh - box.top) / (box.height + vh));
      fnRef.current(p, s, box);
    };
    subs.add(sub);
    requestFrame();
    return () => { subs.delete(sub); ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Revela elementos .rv una sola vez al entrar en pantalla
export function useReveal(dep) {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv:not(.in)').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [dep]);
}

// Scroll 100 % nativo: responde exactamente a la velocidad de la rueda, el trackpad o el dedo.
export function startSmoothScroll() {}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

// Bloquea el scroll mientras hay un menú o visor abierto
let locks = 0;
export function lockScroll(on) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  document.body.classList.toggle('lock', locks > 0);
}
