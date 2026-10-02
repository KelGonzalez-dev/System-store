import { useEffect } from 'react';
export function useTilt(ref, max = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.classList.add('is-tilting');
        el.style.transform = `perspective(900px) rotateY(${(x * max).toFixed(2)}deg) rotateX(${(-y * max).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`;
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.classList.remove('is-tilting');
      el.style.transform = '';
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref, max]);
}
