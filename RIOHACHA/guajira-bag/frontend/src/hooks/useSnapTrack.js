import { useCallback, useEffect, useRef } from 'react';

/**
 * Carrusel con scroll-snap: sincroniza el índice cuando el usuario desliza,
 * y permite moverlo con botones sin que el evento de scroll lo "devuelva" a mitad de camino.
 */
export function useSnapTrack(index, setIndex, count) {
  const ref = useRef(null);
  const programmatic = useRef(false);
  const timer = useRef(0);

  const goTo = useCallback((k, smooth = true) => {
    const el = ref.current;
    const n = (k + count) % count;
    setIndex(n);
    if (!el) return;
    programmatic.current = true;
    clearTimeout(timer.current);
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    timer.current = setTimeout(() => { programmatic.current = false; }, smooth ? 650 : 50);
  }, [count, setIndex]);

  const onScroll = useCallback(() => {
    if (programmatic.current) return;
    const el = ref.current;
    if (!el) return;
    const k = Math.round(el.scrollLeft / el.clientWidth);
    if (k !== index) setIndex(k);
  }, [index, setIndex]);

  useEffect(() => () => clearTimeout(timer.current), []);
  return { ref, goTo, onScroll };
}
