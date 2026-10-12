import { useRef } from 'react';
import { WaIcon } from './Nav';
import { Deco } from './Brand';
import { useI18n, wa } from '../i18n';
import { useScrollFrame } from '../lib/scroll';

// Lunch Day: cartel negro y oro con un reloj art déco cuyas manecillas giran con el scroll
export default function Lunch() {
  const { t } = useI18n();
  const sec = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--p', p.toFixed(3)); });
  return (
    <section id="lunch" ref={sec} className="lunch-sec">
      <div className="wrap lunch-grid py-[clamp(80px,10vw,130px)]">
        <div className="lunch-clock" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.6" opacity=".5" />
            {Array.from({ length: 12 }, (_, i) => <line key={i} x1="100" y1="12" x2="100" y2={i % 3 ? 20 : 28} stroke="currentColor" strokeWidth={i % 3 ? 1 : 2} transform={`rotate(${i * 30} 100 100)`} />)}
            <path d="M100 100L100 44" stroke="#e7cd8f" strokeWidth="3" strokeLinecap="round" className="h-hour" />
            <path d="M100 100L100 26" stroke="#e7cd8f" strokeWidth="1.6" strokeLinecap="round" className="h-min" />
            <circle cx="100" cy="100" r="5" fill="#e7cd8f" />
          </svg>
          <span>12:00 – 3:00</span>
        </div>
        <div className="lunch-card">
          <div className="lc-corner" aria-hidden="true"><Deco /><Deco /><Deco /><Deco /></div>
          <p className="eyebrow justify-center">{t.lunch.eyebrow}</p>
          <h2 className="lunch-title"><span>{t.lunch.title}</span></h2>
          <p className="lunch-sub">{t.lunch.sub}</p>
          <p className="lunch-lead">{t.lunch.lead}</p>
          <div className="lunch-price"><span>{t.lunch.from}</span><b>$25.000</b></div>
          <p className="lunch-when">{t.lunch.days} · {t.lunch.hours}</p>
          <a href={wa(t.lunch.msg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-8"><WaIcon />{t.lunch.cta}</a>
        </div>
      </div>
    </section>
  );
}
