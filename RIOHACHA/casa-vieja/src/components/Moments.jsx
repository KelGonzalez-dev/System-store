import { useEffect, useRef, useState } from 'react';
import Img from './Img';
import { MOMENTS } from '../data';
import { useI18n } from '../i18n';
import { useInView } from '../lib/scroll';

// Las 5 historias destacadas (Café, Desayunos, Tortas, Bar, Karaoke): la tarjeta gira en 3D al cambiar
export default function Moments() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(0);
  const [hold, setHold] = useState(false);
  const ref = useRef(null);
  const seen = useInView(ref);
  const pick = (n) => { if (n === i) return; setI(n); setFlip((f) => f + 1); };
  useEffect(() => {
    if (!seen || hold) return undefined;
    const id = setTimeout(() => pick((i + 1) % MOMENTS.length), 5200);
    return () => clearTimeout(id);
  }, [i, seen, hold]);
  const m = MOMENTS[i];
  const it = t.moments.items[m.id];
  return (
    <section ref={ref} className="moments-sec relative overflow-hidden" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="wrap py-[clamp(80px,10vw,120px)]">
        <div className="text-center">
          <p className="eyebrow justify-center">{t.moments.eyebrow}</p>
          <h2 className="rv mask-up sec-title mt-3"><span>{t.moments.title}</span></h2>
        </div>
        <div className="hl-row" role="tablist" aria-label={t.moments.title}>
          {MOMENTS.map((x, n) => (
            <button key={x.id} type="button" role="tab" aria-selected={n === i} className={`hl-btn ${n === i ? 'on' : ''}`} onClick={() => pick(n)}>
              <span className="hl-ring"><span className="hl-ico">{x.icon}</span></span>
              <b>{t.moments.items[x.id].t}</b>
            </button>
          ))}
        </div>
        <div className="moment-stage">
          <article key={flip} className="moment-card">
            <div className="mc-photo"><Img id={m.img} alt={it.t} w={800} className="h-full w-full" /></div>
            <div className="mc-body">
              <span className="mc-num">0{i + 1} / 0{MOMENTS.length}</span>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
              {!hold && <i className="mc-timer" aria-hidden="true" />}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
