import { useEffect, useState } from 'react';
import { GALERIA } from '../data';
import { lockScroll } from '../lib/scroll';

/** Galería clásica en cuadrícula, con visor para ver cada foto más grande. */
export default function Galeria() {
  const [ver, setVer] = useState(null);
  useEffect(() => {
    if (ver === null) return undefined;
    lockScroll(true);
    const k = (e) => { if (e.key === 'Escape') setVer(null); if (e.key === 'ArrowRight') setVer((v) => (v + 1) % GALERIA.length); if (e.key === 'ArrowLeft') setVer((v) => (v - 1 + GALERIA.length) % GALERIA.length); };
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [ver]);
  return (
    <section id="galeria" className="galeria">
      <div className="wrap">
        <div className="cabeza rv">
          <p className="sobre">Galería</p>
          <h2 className="titulo">La casa por dentro</h2>
          <span className="filete filete--centro" />
        </div>
        <div className="galeria__grid">
          {GALERIA.map((g, i) => (
            <button key={g.foto + i} type="button" className="galeria__item rv" onClick={() => setVer(i)} aria-label={`Ver: ${g.txt}`}>
              <img src={g.foto} alt={g.txt} loading="lazy" decoding="async" />
              <span>{g.txt}</span>
            </button>
          ))}
        </div>
      </div>
      {ver !== null && (
        <div className="visor" role="dialog" aria-modal="true" onClick={() => setVer(null)}>
          <figure onClick={(e) => e.stopPropagation()}><img src={GALERIA[ver].foto} alt={GALERIA[ver].txt} /><figcaption>{GALERIA[ver].txt}</figcaption></figure>
          <button type="button" className="visor__b l" onClick={(e) => { e.stopPropagation(); setVer((ver - 1 + GALERIA.length) % GALERIA.length); }} aria-label="Anterior">‹</button>
          <button type="button" className="visor__b r" onClick={(e) => { e.stopPropagation(); setVer((ver + 1) % GALERIA.length); }} aria-label="Siguiente">›</button>
          <button type="button" className="visor__b x" onClick={() => setVer(null)} aria-label="Cerrar">✕</button>
        </div>
      )}
    </section>
  );
}
