import { useEffect } from 'react';
// Activa la animación de entrada en todos los elementos .rv al hacerse visibles
export default function useReveal(dep) {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv:not(.in)').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [dep]);
}
