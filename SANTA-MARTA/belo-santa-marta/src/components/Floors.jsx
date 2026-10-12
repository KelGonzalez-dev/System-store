import { useRef, useState } from 'react';
import Img from './Img';
import { L } from '../data';
import { useI18n } from '../i18n';
import { clamp, ease, useScrollFrame } from '../lib/scroll';

// "Dos pisos, dos mundos": al hacer scroll se sube como en ascensor, de la cocina al rooftop.
// El indicador art déco gira y los pisos se reemplazan con un giro 3D.
export default function Floors() {
  const { t } = useI18n();
  const sec = useRef(null);
  const needle = useRef(null);
  const f1 = useRef(null);
  const f2 = useRef(null);
  const shaft = useRef(null);
  const [floor, setFloor] = useState(1);
  const fl = useRef(1);
  useScrollFrame(sec, (p) => {
    const k = ease(clamp((p - 0.25) / 0.5));
    if (needle.current) needle.current.style.transform = `rotate(${(-70 + k * 140).toFixed(1)}deg)`;
    if (shaft.current) shaft.current.style.transform = `translate3d(0, ${(k * 50).toFixed(1)}%, 0)`;
    if (f1.current) { f1.current.style.transform = `perspective(1400px) translate3d(0, ${(-k * 40).toFixed(1)}%, ${(-k * 200).toFixed(0)}px) rotateX(${(k * 55).toFixed(1)}deg)`; f1.current.style.opacity = (1 - k * 1.3).toFixed(3); }
    if (f2.current) { f2.current.style.transform = `perspective(1400px) translate3d(0, ${((1 - k) * 45).toFixed(1)}%, ${(-(1 - k) * 200).toFixed(0)}px) rotateX(${(-(1 - k) * 55).toFixed(1)}deg)`; f2.current.style.opacity = clamp(k * 1.3 - 0.3).toFixed(3); }
    const n = k > 0.5 ? 2 : 1;
    if (n !== fl.current) { fl.current = n; setFloor(n); }
  }, 'pin');
  const F = (ref, f, imgs, cls) => (
    <div ref={ref} className={`floor-card ${cls}`}>
      <div className="fc-photos">
        <div className="fc-a"><Img id={imgs[0]} alt={f.t} w={900} className="h-full w-full" /></div>
        <div className="fc-b"><Img id={imgs[1]} alt="" w={500} className="h-full w-full" /></div>
      </div>
      <div className="fc-text">
        <h3>{f.t}</h3>
        <p>{f.d}</p>
      </div>
    </div>
  );
  return (
    <section id="pisos" ref={sec} className="floors">
      <div className="floors-sticky">
        <div className="floors-shaft" aria-hidden="true"><i ref={shaft} /></div>
        <div className="wrap floors-grid">
          <div className="floors-side">
            <p className="eyebrow">{t.floors.eyebrow}</p>
            <div className="dial" aria-hidden="true">
              <svg viewBox="0 0 160 92">
                <path d="M14 84a66 66 0 0 1 132 0" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
                <path d="M26 84a54 54 0 0 1 108 0" fill="none" stroke="currentColor" strokeWidth="0.8" opacity=".3" />
                <g transform="rotate(-70 80 84)"><line x1="80" y1="22" x2="80" y2="30" stroke="currentColor" strokeWidth="1.6" /></g>
                <g transform="rotate(70 80 84)"><line x1="80" y1="22" x2="80" y2="30" stroke="currentColor" strokeWidth="1.6" /></g>
                <text x="30" y="58" className="dial-lbl">1</text><text x="124" y="58" className="dial-lbl">R</text>
                <g ref={needle} className="dial-needle" style={{ transformOrigin: '80px 84px' }}><line x1="80" y1="84" x2="80" y2="30" stroke="#e7cd8f" strokeWidth="2" strokeLinecap="round" /><circle cx="80" cy="84" r="5" fill="#e7cd8f" /></g>
              </svg>
              <p className="dial-floor"><span>{t.floors.floor}</span><b key={floor}>{floor === 1 ? t.floors.f1.n : t.floors.f2.n}</b></p>
            </div>
          </div>
          <div className="floors-stage">
            {F(f1, t.floors.f1, [L.salon, L.barraOro], 'f1')}
            {F(f2, t.floors.f2, [L.rooftop, L.nocheBar], 'f2')}
          </div>
        </div>
      </div>
    </section>
  );
}
