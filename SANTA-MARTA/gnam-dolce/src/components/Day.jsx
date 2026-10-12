import { useRef, useState } from 'react';
import Img from './Img';
import { useMoney } from './Menu';
import { DAY, findItem } from '../data';
import { useI18n } from '../i18n';
import { useScrollFrame } from '../lib/scroll';

const SKY = ['#f6efe4', '#f7e6d2', '#ead2c6', '#3a2620'];

/**
 * "Un día en Gnam" (sección fija): un reloj de sol recorre el día de 8:00 a. m. a la noche.
 * Las tarjetas de cada momento giran en 3D como páginas de su carta y el fondo cambia de mañana a noche.
 */
export default function Day() {
  const { t } = useI18n();
  const fmt = useMoney();
  const sec = useRef(null);
  const hand = useRef(null);
  const [i, setI] = useState(0);
  const cur = useRef(0);
  useScrollFrame(sec, (p) => {
    const f = p * (DAY.length - 1);
    const n = Math.min(DAY.length - 1, Math.round(f));
    if (hand.current) hand.current.style.transform = `rotate(${(-80 + p * 160).toFixed(1)}deg)`;
    sec.current?.style.setProperty('--dp', p.toFixed(3));
    if (n !== cur.current) { cur.current = n; setI(n); }
  }, 'pin');
  const m = DAY[i];
  const mo = t.day.moments[i];
  const ampm = (k) => (k === 0 ? t.day.am : t.day.pm);
  return (
    <section id="dia" ref={sec} className={`day ${i === 3 ? 'is-night' : ''}`} style={{ '--sky': SKY[i] }}>
      <div className="day-sticky">
        <div className="wrap day-grid">
          <div className="day-left">
            <p className="kicker">{t.day.eyebrow}</p>
            <h2 className="sec-title">{t.day.title}</h2>
            <div className="sundial" aria-hidden="true">
              <svg viewBox="0 0 200 110">
                <path d="M10 100a90 90 0 0 1 180 0" className="sd-arc" />
                {[0, 1, 2, 3].map((k) => <circle key={k} cx={100 + 90 * Math.cos(Math.PI - (k / 3) * Math.PI)} cy={100 - 90 * Math.sin(Math.PI - (k / 3) * Math.PI)} r={k === i ? 6 : 3.5} className={k <= i ? 'sd-dot on' : 'sd-dot'} />)}
                <g ref={hand} className="sd-hand" style={{ transformOrigin: '100px 100px' }}><line x1="100" y1="100" x2="100" y2="22" /><circle cx="100" cy="16" r="9" className="sd-sun" /></g>
              </svg>
            </div>
            <p key={`h${i}`} className="day-time"><b>{m.at}</b> {ampm(i)}</p>
          </div>
          <div className="day-stage">
            <article key={i} className="day-card">
              <div className="dc-photo"><Img id={m.img} alt={mo.t} w={800} className="h-full w-full" /></div>
              <div className="dc-body">
                <h3>{mo.t}</h3>
                <p className="dc-d">{mo.d}</p>
                <ul>
                  {m.picks.map((name) => { const r = findItem(name); return r ? <li key={name}><span>{name}</span><i /><b>{fmt.format(r.it[2])}</b></li> : null; })}
                </ul>
                <a href={`./carta.html#cat-${m.cat}`} target="_blank" rel="noopener" className="dc-link">{t.day.see} →</a>
              </div>
            </article>
          </div>
        </div>
        <i className="day-bar" aria-hidden="true" />
      </div>
    </section>
  );
}
