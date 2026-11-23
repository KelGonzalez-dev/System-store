import { useEffect, useRef, useState } from 'react';
import Foto from './Foto';
import { CONFIG, TIRAS } from '../data';
import { lockScroll, useScrollFrame } from '../lib/scroll';

/**
 * Galería "Fotomatón" (sección fija): tres tiras de fotomatón cuelgan inclinadas y se deslizan
 * a distinta velocidad y en sentidos opuestos al hacer scroll. Toca una foto para verla en grande.
 */
export default function Galeria() {
  const sec = useRef(null);
  const tiras = useRef([]);
  const [ver, setVer] = useState(null);
  const todas = TIRAS.flat();
  useScrollFrame(sec, (p) => {
    tiras.current.forEach((el, i) => {
      if (!el) return;
      const dir = i % 2 ? 1 : -1;
      const amp = window.innerHeight * (0.35 + i * 0.08);
      el.style.transform = `translate3d(0, ${(dir * (p - 0.5) * amp).toFixed(1)}px, 0) rotate(${[-4, 3, -2][i]}deg)`;
    });
  }, 'pin');
  useEffect(() => {
    if (ver === null) return undefined;
    lockScroll(true);
    const k = (e) => { if (e.key === 'Escape') setVer(null); if (e.key === 'ArrowRight') setVer((v) => (v + 1) % todas.length); if (e.key === 'ArrowLeft') setVer((v) => (v - 1 + todas.length) % todas.length); };
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [ver, todas.length]);
  return (
    <section id="galeria" ref={sec} className="gal">
      <div className="gal__sticky">
        <div className="wrap gal__grid">
          <div className="gal__copy">
            <p className="eyebrow">Galería</p>
            <h2 className="titulo">Lo que pasa en el saloon <em>se queda en fotos.</em></h2>
            <a className="btn btn--linea" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">@{CONFIG.instagram}</a>
          </div>
          <div className="gal__tiras">
            {TIRAS.map((t, i) => (
              <div key={i} ref={(el) => { tiras.current[i] = el; }} className="tira">
                {t.map((f, k) => (
                  <button key={k} type="button" className="tira__foto" onClick={() => setVer(i * 4 + k)} aria-label="Ver foto en grande">
                    <Foto id={f.foto} arte={f.arte} alt="Noche en Canta Corazón" w={500} />
                  </button>
                ))}
                <span className="tira__pie">CANTA CORAZÓN ♥ MED</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {ver !== null && (
        <div className="visor" role="dialog" aria-modal="true" onClick={() => setVer(null)}>
          <div className="visor__foto" onClick={(e) => e.stopPropagation()}><Foto key={ver} id={todas[ver].foto} arte={todas[ver].arte} alt="Noche en Canta Corazón" w={1400} eager /></div>
          <button type="button" className="visor__b l" onClick={(e) => { e.stopPropagation(); setVer((ver - 1 + todas.length) % todas.length); }} aria-label="Anterior">‹</button>
          <button type="button" className="visor__b r" onClick={(e) => { e.stopPropagation(); setVer((ver + 1) % todas.length); }} aria-label="Siguiente">›</button>
          <button type="button" className="visor__b x" onClick={() => setVer(null)} aria-label="Cerrar">✕</button>
        </div>
      )}
    </section>
  );
}
