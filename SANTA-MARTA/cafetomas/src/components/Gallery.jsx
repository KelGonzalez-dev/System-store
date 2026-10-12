import { useRef, useState } from 'react';
import { GALLERY } from '../data';
import { IG, useI18n } from '../i18n';
import { useScrollFrame } from '../lib/scroll';

const N = GALLERY.length;

// Prisma 3D de seis caras que gira con el scroll (sección fija)
export default function Gallery() {
  const { t, pick } = useI18n();
  const sec = useRef(null);
  const prism = useRef(null);
  const [face, setFace] = useState(0);
  const fRef = useRef(0);
  useScrollFrame(sec, (p) => {
    const a = p * 360 * ((N - 1) / N);
    if (prism.current) prism.current.style.transform = `translateZ(calc(var(--r) * -1)) rotateY(${(-a).toFixed(2)}deg)`;
    const f = Math.round((a / 360) * N) % N;
    if (f !== fRef.current) { fRef.current = f; setFace(f); }
  }, 'pin');
  return (
    <section id="galeria" ref={sec} className="gal-sec">
      <div className="gal-sticky">
        <div className="wrap gal-head">
          <div>
            <p className="eyebrow">{t.gal.eyebrow}</p>
            <h2 className="sec-title mt-2">{t.gal.title}</h2>
          </div>
          <a className="btn btn-line" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">@{IG}</a>
        </div>
        <div className="prism-stage">
          <div ref={prism} className="prism">
            {GALLERY.map((g, i) => (
              <figure key={g.src} className="pface" style={{ '--a': `${(360 / N) * i}deg` }}>
                <img src={g.src} alt={pick(g.t)} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
        <p key={face} className="gal-cap">{pick(GALLERY[face].t)}<span>{String(face + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span></p>
      </div>
    </section>
  );
}
