import { useEffect, useRef } from 'react';

let observer;
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
  }
  return observer;
}

export function useReveal({ index = 0, threshold, rootMargin } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.style.setProperty('--d', `${Math.min(index, 8) * 70}ms`);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return undefined;
    }

    if (threshold !== undefined || rootMargin !== undefined) {
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        }),
        { threshold: threshold ?? 0.14, rootMargin: rootMargin ?? '0px 0px -8% 0px' }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }

    const obs = getObserver();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [index, threshold, rootMargin]);

  return ref;
}

export default useReveal;
