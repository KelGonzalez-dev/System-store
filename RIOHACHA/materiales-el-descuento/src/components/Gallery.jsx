import { useCallback, useEffect, useState } from 'react';
import Photo from './Photo';
import { CONFIG, GALLERY } from '../data';
import { lockScroll } from '../lib/scroll';

// Galería en mosaico con visor (flechas y teclado)
export default function Gallery() {
  const [i, setI] = useState(-1);
  const N = GALLERY.length;
  const go = useCallback((d) => setI((v) => (v + d + N) % N), [N]);
  useEffect(() => {
    if (i < 0) return undefined;
    lockScroll(true);
    const k = (e) => { if (e.key === 'Escape') setI(-1); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [i, go]);
  return (
    <section id="galeria" className="sec gal-sec">
      <div className="wrap">
        <div className="sec-head">
          <div><p className="kicker">Galería</p><h2 className="sec-title">Nuestro local y tu obra</h2></div>
          <a className="btn btn-outline" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Síguenos en Instagram</a>
        </div>
        <div className="gallery">
          {GALLERY.map((g, k) => (
            <button key={g.src} type="button" className={`gl g${k}`} onClick={() => setI(k)} aria-label={`Ver foto: ${g.t}`}>
              <Photo src={g.src} art={g.art} w={700} alt={g.t} />
              <span className="gl-cap">{g.t}</span>
            </button>
          ))}
        </div>
      </div>
      {i >= 0 && (
        <div className="viewer" role="dialog" aria-modal="true" onClick={() => setI(-1)}>
          <figure onClick={(e) => e.stopPropagation()}><Photo src={GALLERY[i].src} art={GALLERY[i].art} w={1400} alt={GALLERY[i].t} /><figcaption>{GALLERY[i].t} <span>{i + 1} / {N}</span></figcaption></figure>
          <button type="button" className="vw-btn prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Anterior">‹</button>
          <button type="button" className="vw-btn next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Siguiente">›</button>
          <button type="button" className="vw-btn close" onClick={() => setI(-1)} aria-label="Cerrar">✕</button>
        </div>
      )}
    </section>
  );
}
