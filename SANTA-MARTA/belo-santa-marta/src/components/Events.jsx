import { useRef } from 'react';
import Img from './Img';
import { L } from '../data';
import { useI18n, wa } from '../i18n';
import { useScrollFrame } from '../lib/scroll';

const IMGS = [L.cumple, L.barraOro, L.rooftop];

// Tres tarjetas que se despliegan en abanico 3D al entrar en pantalla
export default function Events() {
  const { t } = useI18n();
  const sec = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--p', p.toFixed(3)); });
  return (
    <section id="eventos" ref={sec} className="events-sec">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="text-center">
          <p className="eyebrow justify-center">{t.events.eyebrow}</p>
          <h2 className="rv mask-up sec-title"><span>{t.events.title}</span></h2>
        </div>
        <div className="ev-fan">
          {t.events.items.map((e, i) => (
            <article key={e.t} className="ev-card" style={{ '--i': i - 1 }}>
              <div className="ev-photo"><Img id={IMGS[i]} alt={e.t} w={700} className="h-full w-full" /></div>
              <div className="ev-body">
                <h3>{e.t}</h3>
                <p>{e.d}</p>
                <a href={wa(e.msg)} target="_blank" rel="noopener noreferrer">{e.cta} →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
