import { useRef } from 'react';
import Img from './Img';
import { WaIcon } from './Nav';
import { L } from '../data';
import { useI18n, wa } from '../i18n';
import { useScrollFrame, useTilt } from '../lib/scroll';

// De noche: letrero de neón "Karaoke", ecualizador, bombillas y fotos que giran en 3D con el scroll
export default function Night() {
  const { t } = useI18n();
  const ref = useRef(null);
  const card = useRef(null);
  useTilt(card, 8);
  useScrollFrame(ref, (p) => { ref.current?.style.setProperty('--p', p.toFixed(3)); });
  return (
    <section id="noche" ref={ref} className="night-sec relative overflow-hidden">
      <div className="night-bulbs" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="wrap grid items-center gap-14 py-[clamp(90px,11vw,140px)] lg:grid-cols-2">
        <div>
          <p className="eyebrow eyebrow-night">{t.night.eyebrow}</p>
          <h2 className="rv mask-up sec-title mt-3 text-crema"><span>{t.night.title}</span></h2>
          <p className="neon font-hand" aria-hidden="true">{t.night.sign}</p>
          <p className="rv mt-2 max-w-[48ch] text-[16.5px] leading-relaxed text-crema/75">{t.night.lead}</p>
          <ul className="night-hours">
            {t.night.hours.map(([d, h]) => <li key={d}><b>{d}</b><span>{h}</span></li>)}
          </ul>
          <a href={wa(t.night.resMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-8"><WaIcon />{t.night.cta}</a>
        </div>
        <div className="night-visual">
          <div className="eq" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
          <div ref={card} className="night-card"><Img id={L.michelada} alt="Michelada" w={700} className="h-full w-full" /><span className="glare" /></div>
          <div className="night-card2"><Img id={L.barista} alt="" w={500} className="h-full w-full" /></div>
          <span className="mic" aria-hidden="true">🎤</span>
        </div>
      </div>
    </section>
  );
}
