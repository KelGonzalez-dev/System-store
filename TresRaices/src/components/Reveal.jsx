import { useEffect, useRef } from 'react';

/* Un solo IntersectionObserver para todos los elementos: barato en móviles */
let io;
function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
  }
  return io;
}

/* v: up | left | right | zoom | clip */
export default function Reveal({ as: Tag = 'div', v = 'up', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = observer();
    o.observe(el);
    return () => o.unobserve(el);
  }, []);
  return (
    <Tag ref={ref} data-v={v} style={{ '--d': `${delay}ms` }} className={`rv ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
