import { useEffect, useState } from 'react';
import Palm from './Palm';
import { LOCAL } from '../data';
import { HOUSES, domiLink, useI18n } from '../i18n';
import { status } from '../lib/hours';

// Ilustración de una casa rosa (fachada con puerta en arco, rejas y el letrero pintado)
function House({ v = 0 }) {
  return (
    <svg viewBox="0 0 320 230" className="house-svg" aria-hidden="true">
      <rect x="0" y="214" width="320" height="16" fill="#F3D9C4" />
      <g className="house-body">
        <rect x="46" y="58" width="228" height="158" fill="#F9A8D4" stroke="#E8323C" strokeWidth="3" />
        <rect x="38" y="46" width="244" height="16" rx="3" fill="#F48CC4" stroke="#E8323C" strokeWidth="3" />
        {v === 0 ? (
          <>
            <path d="M140 216v-62a20 20 0 0 1 40 0v62z" fill="#FFF1E6" stroke="#E8323C" strokeWidth="3" />
            <g className="win"><rect x="68" y="120" width="48" height="56" fill="#FFF59D" stroke="#E8323C" strokeWidth="3" /><path d="M80 120v56M92 120v56M104 120v56" stroke="#E8323C" strokeWidth="2" /></g>
            <g className="win w2"><rect x="204" y="120" width="48" height="56" fill="#FFF59D" stroke="#E8323C" strokeWidth="3" /><path d="M216 120v56M228 120v56M240 120v56" stroke="#E8323C" strokeWidth="2" /></g>
          </>
        ) : (
          <>
            <rect x="132" y="150" width="56" height="66" fill="#FFF1E6" stroke="#E8323C" strokeWidth="3" />
            <g className="win"><path d="M66 176v-38a24 24 0 0 1 48 0v38z" fill="#FFF59D" stroke="#E8323C" strokeWidth="3" /><path d="M90 114v62M66 150h48" stroke="#E8323C" strokeWidth="2" /></g>
            <g className="win w2"><path d="M206 176v-38a24 24 0 0 1 48 0v38z" fill="#FFF59D" stroke="#E8323C" strokeWidth="3" /><path d="M230 114v62M206 150h48" stroke="#E8323C" strokeWidth="2" /></g>
          </>
        )}
        <text x="160" y="84" textAnchor="middle" className="house-sign">DON’T STRESS,</text>
        <text x="160" y="104" textAnchor="middle" className="house-sign">FEEL FRESCO</text>
      </g>
      <Palm color="#2E9E5B" className="house-palm" x="248" y="92" width="112" height="124" />
    </svg>
  );
}

export default function Houses() {
  const { t } = useI18n();
  const [s, setS] = useState(status);
  useEffect(() => { const id = setInterval(() => setS(status()), 60000); return () => clearInterval(id); }, []);
  return (
    <section id="casas" className="relative overflow-hidden bg-crema py-[clamp(80px,10vw,130px)]">
      <div className="wrap">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <h2 className="rv mask-up sec-title text-rojo"><span>{t.houses.title}</span></h2>
          <p className="rv max-w-[42ch] text-[16px] font-medium leading-relaxed text-vino/80">{t.houses.lead}</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {HOUSES.map((h, i) => (
            <article key={h.id} className="house-card rv" style={{ '--r': i ? '1deg' : '-1deg' }}>
              <House v={i} />
              {i === 0 && <div className="house-polaroid" aria-hidden="true"><img src={LOCAL.casa} alt="" loading="lazy" /></div>}
              <div className="p-6 pt-2 md:p-8 md:pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-[clamp(34px,3.4vw,46px)] leading-none text-rojo">{h.name}</h3>
                  <span className={`open-badge ${s.open ? 'is-open' : ''}`}><i aria-hidden="true" />{s.open ? t.houses.open : t.houses.closed}</span>
                </div>
                <p className="mt-3 text-[16px] font-semibold text-vino">📍 {h.address}</p>
                <p className="mt-1 text-[14px] text-vino/70">⏰ {t.houses.hours}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={domiLink(h)} target="_blank" rel="noopener noreferrer" className="btn btn-yellow !h-12 !text-[15px]">{t.houses.domi}</a>
                  <a href={h.maps} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !h-12 !text-[15px]">{t.houses.map}</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
