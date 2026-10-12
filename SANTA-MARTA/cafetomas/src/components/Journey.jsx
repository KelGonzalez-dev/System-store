import { useRef, useState } from 'react';
import Img from './Img';
import { JOURNEY_IMG } from '../data';
import { useI18n } from '../i18n';
import { useScrollFrame } from '../lib/scroll';

// Colores del grano en cada paso: cereza roja → verde → tostado → molido → espresso → taza
const COLORS = ['#c8263a', '#7aa35a', '#7a4422', '#4a2a17', '#2a160c', '#c98a4a'];

// "Del grano a la taza": sección fija; al bajar, un grano en 3D gira y cambia de color paso a paso
export default function Journey() {
  const { t } = useI18n();
  const sec = useRef(null);
  const bean = useRef(null);
  const [step, setStep] = useState(0);
  const st = useRef(0);
  const steps = t.journey.steps;
  useScrollFrame(sec, (p) => {
    const f = p * (steps.length - 1);
    const i = Math.min(steps.length - 1, Math.round(f));
    if (bean.current) bean.current.style.transform = `rotateY(${(p * 720).toFixed(1)}deg) rotateZ(${(Math.sin(p * Math.PI * 2) * 14).toFixed(1)}deg)`;
    if (i !== st.current) { st.current = i; setStep(i); }
    sec.current?.style.setProperty('--jp', p.toFixed(3));
  }, 'pin');
  return (
    <section id="grano" ref={sec} className="journey" style={{ '--bean': COLORS[step] }}>
      <div className="journey-sticky">
        <div className="wrap journey-grid">
          <div>
            <p className="eyebrow">{t.journey.eyebrow}</p>
            <h2 className="sec-title mt-3">{t.journey.title}</h2>
            <ol className="j-steps">
              {steps.map((s, i) => (
                <li key={s.t} className={i === step ? 'on' : i < step ? 'done' : ''}>
                  <span className="j-n">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3>{s.t}</h3><p>{s.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="j-visual">
            <div className="j-photos">
              {JOURNEY_IMG.map((src, i) => <div key={i} className={`j-photo ${i === step ? 'on' : ''}`}><Img id={src} alt="" w={700} className="h-full w-full" /></div>)}
            </div>
            <div className="j-bean-wrap" aria-hidden="true">
              <div ref={bean} className="j-bean">
                <svg viewBox="0 0 100 130" className="bean-front"><ellipse cx="50" cy="65" rx="44" ry="60" /><path d="M50 10c-18 20 18 40 0 55s18 35 0 55" /></svg>
                <svg viewBox="0 0 100 130" className="bean-back"><ellipse cx="50" cy="65" rx="44" ry="60" /></svg>
              </div>
              <span className="j-step-n">{String(step + 1).padStart(2, '0')}<small>/06</small></span>
            </div>
          </div>
        </div>
        <i className="j-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
