import { useRef } from 'react';
import { GALLERY } from '../data';
import { IG, useI18n } from '../i18n';
import { clamp, ease, useScrollFrame } from '../lib/scroll';

const ROT = [-9, 7, -4, 11, -13, 5, 9, -6, 3];

// "Repartir la mesa": las fotos empiezan apiladas como una baraja y, al bajar, se reparten en 3D sobre una cuadrícula
export default function Gallery() {
  const { t } = useI18n();
  const sec = useRef(null);
  const stage = useRef(null);
  useScrollFrame(sec, (p) => {
    const el = stage.current;
    if (!el) return;
    const cards = el.children;
    const cs = cards[0]?.offsetWidth || 200;
    const gap = cs * 0.08;
    for (let i = 0; i < cards.length; i++) {
      const k = ease(clamp(p * 1.7 - 0.12 - i * 0.035));
      const col = (i % 3) - 1, row = Math.floor(i / 3) - 1;
      const x = col * (cs + gap) * k, y = row * (cs + gap) * k;
      cards[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${((1 - k) * i * 6).toFixed(1)}px) rotateZ(${(ROT[i] * (1 - k)).toFixed(2)}deg) rotateX(${((1 - k) * 28).toFixed(1)}deg) rotateY(${(Math.sin(i + k * 3) * (1 - k) * 18).toFixed(1)}deg)`;
    }
  }, 'pin');
  return (
    <section id="galeria" ref={sec} className="gal-sec">
      <div className="gal-sticky">
        <div className="gal-head">
          <p className="kicker justify-center">{t.gal.eyebrow}</p>
          <h2 className="sec-title">{t.gal.title}</h2>
          <p className="text-choco/65">{t.gal.lead} <a className="ulink font-semibold" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">@{IG}</a></p>
        </div>
        <div className="gal-table">
          <div ref={stage} className="gal-stage">
            {GALLERY.map((src, i) => <div key={src} className="gcard" style={{ zIndex: 20 - i }}><img src={src} alt="" loading="lazy" decoding="async" /></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
