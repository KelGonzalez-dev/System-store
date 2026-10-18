import { useEffect, useRef } from 'react';

export function useTilt(maxDeg = 8) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!fine.matches) return undefined;

    let raf = null;
    let px = 0;
    let py = 0;

    const apply = () => {
      raf = null;
      el.style.transform = `perspective(900px) rotateY(${px.toFixed(2)}deg) rotateX(${py.toFixed(2)}deg) scale3d(1.015,1.015,1.015)`;
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      px = x * maxDeg * 2;
      py = -y * maxDeg * 2;
      el.classList.add('is-tilting');
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      el.classList.remove('is-tilting');
      if (!raf) raf = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxDeg]);

  return ref;
}

export default useTilt;
