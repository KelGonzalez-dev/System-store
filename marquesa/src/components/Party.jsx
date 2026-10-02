import { useRef } from 'react';
import Img from './Img';
import { LOCAL } from '../data';
import { useI18n } from '../i18n';
import { clamp, ease, lerp, scrollToTarget, useScrollFrame } from '../lib/scroll';

// Celebraciones: letrero de neón que se escribe solo y fotos que se abren en abanico
export default function Party() {
  const { t } = useI18n();
  const sec = useRef(null);
  const fan = useRef(null);
  useScrollFrame(sec, (p) => {
    const e = ease(clamp((p - 0.12) / 0.38));
    const cards = fan.current.children;
    const conf = [[-16, -34], [0, 0], [14, 34]];
    for (let i = 0; i < cards.length; i++) {
      const [r, x] = conf[i];
      cards[i].style.transform = `translate3d(${lerp(0, x, e)}%,${lerp(40, i === 1 ? -6 : 6, e)}px,0) rotate(${lerp(0, r, e)}deg)`;
    }
  });
  return (
    <section id="celebraciones" ref={sec} className="relative overflow-hidden bg-noche-2 py-[clamp(80px,10vw,140px)]">
      <div className="party-glow" aria-hidden="true" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <svg viewBox="0 0 640 150" className="neon-sign rv" aria-label="De la Marquesa con Amor" role="img">
            <text x="0" y="70">De la Marquesa</text>
            <text x="150" y="138">con Amor</text>
          </svg>
          <h2 className="rv mask-up sec-title mt-6 text-hueso"><span>{t.party.title}</span></h2>
          <p className="rv mt-5 max-w-[46ch] text-[17px] leading-relaxed text-hueso/75">{t.party.lead}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.party.points.map((x) => (
              <li key={x} className="party-pt"><i aria-hidden="true" />{x}</li>
            ))}
          </ul>
          <a href="#visitanos" onClick={(e) => { e.preventDefault(); scrollToTarget('#visitanos'); }} className="btn btn-neon mt-10">{t.party.cta}</a>
        </div>
        <div className="party-stage">
          <i className="em-balloon pb1" aria-hidden="true" /><i className="em-balloon pb2" aria-hidden="true" />
          <div ref={fan} className="party-fan">
            {[LOCAL.espacio, LOCAL.neonGlobos, LOCAL.neonAmor].map((src) => (
              <div key={src} className="party-card will-change-transform"><Img id={src} className="h-full w-full" alt="" /></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
