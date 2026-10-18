import { useEffect, useRef, useState } from 'react';
import { CATS, CONFIG, L, PRODUCTS } from '../data';

function Count({ n, s = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const f = (now) => { const k = Math.min(1, (now - t0) / 1400); setV(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(f); };
      raf = requestAnimationFrame(f);
    });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [n]);
  return <b ref={ref}>{v}{s}</b>;
}

export default function About() {
  return (
    <section id="nosotros" className="sec about-sec">
      <div className="wrap about-grid">
        <div className="ab-photo"><img src={L.fachada} alt="Local de Materiales El Descuento" loading="lazy" /><span className="ab-stamp">Desde hace +{CONFIG.years} años</span></div>
        <div>
          <p className="kicker">Quiénes somos</p>
          <h2 className="sec-title">Tu <span className="red">aliado</span> en materiales para construir en Riohacha</h2>
          <p className="sec-lead mt-4">Somos {CONFIG.legal}, una empresa formalizada que trabaja para que tu obra tenga calidad y el mejor precio. Más de {CONFIG.years} años al servicio de maestros, contratistas y familias de La Guajira.</p>
          <div className="stats">
            <div><Count n={CONFIG.years} s="+" /><span>años de experiencia</span></div>
            <div><Count n={CATS.length} /><span>categorías</span></div>
            <div><Count n={PRODUCTS.length} s="+" /><span>productos</span></div>
          </div>
          <ul className="values">
            <li><b>Calidad</b><span>Marcas reconocidas como Ultracem, Cemex, Ecocemento, Sika y MK.</span></li>
            <li><b>Mejor precio</b><span>Precio al detal y precio especial al por mayor.</span></li>
            <li><b>Asesoría</b><span>Te ayudamos a calcular y elegir lo que tu obra necesita.</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
