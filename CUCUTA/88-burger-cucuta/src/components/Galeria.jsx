import { useEffect, useRef, useState } from 'react';
import Foto from './Foto';
import { CONFIG, GALERIA } from '../data';
import { lockScroll, useScrollFrame } from '../lib/scroll';

const ARTES = ['burger', 'salchipapa', 'burger', 'hotdog', 'picada', 'burger', 'shake', 'burger', 'fries', 'hotdog', 'burger', 'picada'];
// Posición inicial "desarmada" de cada foto en el espacio 3D (determinística para que no cambie al recargar)
const INICIO = GALERIA.map((_, i) => ({
  x: ((i * 73) % 11 - 5) * 70,
  y: ((i * 41) % 9 - 4) * 60,
  z: -900 + ((i * 97) % 7) * 220,
  rx: ((i * 37) % 9 - 4) * 16,
  ry: ((i * 53) % 9 - 4) * 20,
  rz: ((i * 29) % 7 - 3) * 12,
}));

/**
 * Galería "Ensamble 3D" (sección fija): las fotos llegan flotando desde distintas profundidades
 * del espacio, girando, y al bajar se ensamblan en un mosaico perfecto. Toca una para verla en grande.
 */
export default function Galeria() {
  const sec = useRef(null);
  const tiles = useRef([]);
  const [ver, setVer] = useState(null);
  useScrollFrame(sec, (p) => {
    const k = Math.min(1, p / 0.6);
    const e = 1 - Math.pow(1 - k, 3);
    tiles.current.forEach((el, i) => {
      if (!el) return;
      const s = INICIO[i];
      const r = 1 - e;
      el.style.transform = `translate3d(${(s.x * r).toFixed(1)}px, ${(s.y * r).toFixed(1)}px, ${(s.z * r).toFixed(1)}px) rotateX(${(s.rx * r).toFixed(2)}deg) rotateY(${(s.ry * r).toFixed(2)}deg) rotateZ(${(s.rz * r).toFixed(2)}deg)`;
      el.style.opacity = (0.25 + 0.75 * Math.min(1, e * 1.4)).toFixed(3);
    });
    sec.current?.style.setProperty('--e', e.toFixed(3));
  }, 'pin');
  useEffect(() => {
    if (ver === null) return undefined;
    lockScroll(true);
    const k = (e) => { if (e.key === 'Escape') setVer(null); if (e.key === 'ArrowRight') setVer((v) => (v + 1) % GALERIA.length); if (e.key === 'ArrowLeft') setVer((v) => (v - 1 + GALERIA.length) % GALERIA.length); };
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [ver]);
  return (
    <section id="galeria" ref={sec} className="gal">
      <div className="gal__sticky">
        <div className="wrap gal__head">
          <div>
            <p className="eyebrow">Galería</p>
            <h2 className="titulo">Se ve <span className="queso">rico.</span> Sabe mejor.</h2>
          </div>
          <a className="btn btn--linea" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">@{CONFIG.instagram}</a>
        </div>
        <div className="gal__escena">
          <div className="gal__mosaico">
            {GALERIA.map((id, i) => (
              <button key={i} type="button" ref={(el) => { tiles.current[i] = el; }} className={`gal__t t${i}`} onClick={() => setVer(i)} aria-label="Ver foto en grande">
                <Foto id={id} arte={ARTES[i]} alt="Plato de 88 Burger" w={700} />
              </button>
            ))}
          </div>
        </div>
      </div>
      {ver !== null && (
        <div className="visor" role="dialog" aria-modal="true" onClick={() => setVer(null)}>
          <div className="visor__foto" onClick={(e) => e.stopPropagation()}><Foto key={ver} id={GALERIA[ver]} arte={ARTES[ver]} alt="Plato de 88 Burger" w={1600} eager /></div>
          <button type="button" className="visor__b l" onClick={(e) => { e.stopPropagation(); setVer((ver - 1 + GALERIA.length) % GALERIA.length); }} aria-label="Anterior">‹</button>
          <button type="button" className="visor__b r" onClick={(e) => { e.stopPropagation(); setVer((ver + 1) % GALERIA.length); }} aria-label="Siguiente">›</button>
          <button type="button" className="visor__b x" onClick={() => setVer(null)} aria-label="Cerrar">✕</button>
          <span className="visor__n">{ver + 1} / {GALERIA.length}</span>
        </div>
      )}
    </section>
  );
}
