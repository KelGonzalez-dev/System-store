import { useRef } from 'react';
import Img from './Img';
import { Mark } from './Brand';
import { L } from '../data';
import { contactLink, useI18n } from '../i18n';
import { useScrollFrame } from '../lib/scroll';

// Escuela de barismo: módulos como tarjetas que se voltean en 3D al pasar el mouse, y foto de graduados
export default function School() {
  const { t } = useI18n();
  const sec = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--p', p.toFixed(3)); });
  return (
    <section id="escuela" ref={sec} className="school-sec">
      <div className="wrap grid items-start gap-12 py-[clamp(80px,10vw,130px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="school-left">
          <p className="eyebrow">{t.school.eyebrow}</p>
          <h2 className="rv mask-up sec-title mt-3"><span>{t.school.title}</span></h2>
          <p className="rv mt-5 max-w-[46ch] text-[16.5px] leading-relaxed opacity-85">{t.school.lead}</p>
          <div className="grad-card">
            <Img id={L.graduados} alt={t.school.grads} w={600} className="h-full w-full" />
            <span className="grad-tag">{t.school.grads}</span>
          </div>
          <a href={contactLink(t.school.msg)} target="_blank" rel="noopener noreferrer" className="btn btn-yellow mt-8">🎓 {t.school.cta}</a>
        </div>
        <div className="modules">
          {t.school.modules.map((m, i) => (
            <div key={m.t} className="mod" style={{ '--i': i }} tabIndex={0}>
              <div className="mod-in">
                <div className="mod-front">
                  <span className="mod-n">0{i + 1}</span>
                  <h3>{m.t}</h3>
                  <Mark />
                </div>
                <div className="mod-back">
                  <h3>{m.t}</h3>
                  <p>{m.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
