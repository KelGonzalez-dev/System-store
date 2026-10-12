import { useState } from 'react';
import Img from './Img';
import { METHODS } from '../data';
import { useI18n } from '../i18n';

// Calculadora de recetas del Coffee Lab: la tarjeta gira en 3D al cambiar de método
export default function Lab() {
  const { t, pick } = useI18n();
  const [mid, setMid] = useState('v60');
  const [g, setG] = useState(18);
  const m = METHODS.find((x) => x.id === mid);
  const water = Math.round(g * m.ratio);
  return (
    <section id="lab" className="lab-sec">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="max-w-[720px]">
          <p className="eyebrow">{t.lab.eyebrow}</p>
          <h2 className="rv mask-up sec-title mt-3"><span>{t.lab.title}</span></h2>
          <p className="rv mt-4 text-[16.5px] leading-relaxed opacity-80">{t.lab.lead}</p>
        </div>
        <div className="lab-methods" role="tablist" aria-label={t.lab.title}>
          {METHODS.map((x) => <button key={x.id} type="button" role="tab" aria-selected={x.id === mid} className={x.id === mid ? 'on' : ''} onClick={() => setMid(x.id)}>{pick(x.n)}</button>)}
        </div>
        <div className="lab-grid">
          <div key={mid} className="lab-card">
            <div className="lc-photo"><Img id={m.img} alt={pick(m.n)} w={700} className="h-full w-full" /></div>
            <div className="lc-body">
              <h3>{pick(m.n)}</h3>
              <div className="lc-big">
                <div><span>{t.lab.coffee}</span><b>{g} g</b></div>
                <i>→</i>
                <div><span>{t.lab.water}</span><b>{water} {mid === 'espresso' ? 'g' : 'ml'}</b></div>
              </div>
              <dl className="lc-specs">
                <div><dt>{t.lab.ratio}</dt><dd>1 : {m.ratio}</dd></div>
                <div><dt>{t.lab.temp}</dt><dd>{pick(m.temp)}</dd></div>
                <div><dt>{t.lab.grind}</dt><dd>{pick(m.grind)}</dd></div>
                <div><dt>{t.lab.time}</dt><dd>{m.time}</dd></div>
              </dl>
            </div>
          </div>
          <div className="lab-dose">
            <p className="ld-label">{t.lab.coffee}</p>
            <p className="ld-num">{g}<small> g</small></p>
            <input type="range" min="8" max="40" value={g} onChange={(e) => setG(+e.target.value)} aria-label={t.lab.grams} style={{ '--p': `${((g - 8) / 32) * 100}%` }} />
            <div className="dose-beans" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} className={i < Math.round((g / 40) * 12) ? 'on' : ''} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
