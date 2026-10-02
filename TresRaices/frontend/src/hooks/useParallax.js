import { useEffect } from 'react';
import { subscribeScroll } from './scrollBus';

/* Parallax suave: solo en pantallas ≥768px y sin "reducir movimiento".
   En teléfonos no hace nada, para que el scroll sea siempre fluido. */
export function useParallax(ref, factor = 0.12, scale = 1.18) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;
    el.style.willChange = 'transform';
    return subscribeScroll(() => {
      const box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -120 || box.top > window.innerHeight + 120) return;
      const center = box.top + box.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-center * factor).toFixed(1)}px, 0) scale(${scale})`;
    });
  }, [ref, factor, scale]);
}
