import { useRef } from 'react';
import Img from './Img';
import { L } from '../data';
import { useI18n } from '../i18n';
import { useScrollFrame } from '../lib/scroll';

// Piso de baldosas de colores (como el de la entrada): se voltean en 3D en ola al hacer scroll
function Mosaic() {
  const ref = useRef(null);
  const cols = 8, rows = 6;
  useScrollFrame(ref, (p) => { ref.current?.style.setProperty('--p', p.toFixed(3)); });
  return (
    <div ref={ref} className="mosaic" style={{ '--cols': cols }} aria-hidden="true">
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        return <i key={i} className={`tile t${(c + r) % 3}`} style={{ '--d': ((c + r) * 0.035).toFixed(3) }} />;
      })}
    </div>
  );
}

export default function House() {
  const { t } = useI18n();
  const photo = useRef(null);
  useScrollFrame(photo, (p) => {
    const el = photo.current;
    if (!el) return;
    const k = (p - 0.5) * 2; // -1 … 1
    el.style.transform = `perspective(1100px) rotateY(${(-k * 10).toFixed(2)}deg) rotateX(${(k * 4).toFixed(2)}deg) translate3d(0, ${(k * -30).toFixed(1)}px, 0)`;
  });
  return (
    <section id="casa" className="house-sec relative overflow-hidden">
      <div className="wrap grid items-center gap-14 py-[clamp(80px,10vw,130px)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="house-visual">
          <Mosaic />
          <div ref={photo} className="house-photo"><Img id={L.fachada} alt="Casa Vieja" w={700} className="h-full w-full" /></div>
          <div className="house-photo2 rv"><Img id={L.barista} alt="" w={500} className="h-full w-full" /></div>
        </div>
        <div>
          <p className="eyebrow">{t.house.eyebrow}</p>
          <h2 className="rv mask-up sec-title mt-3"><span>{t.house.title}</span></h2>
          <p className="rv mt-5 max-w-[50ch] text-[16.5px] leading-relaxed text-cafe/80">{t.house.lead}</p>
          <ul className="mt-7 grid gap-3">
            {t.house.points.map((p) => <li key={p} className="house-pt rv"><i aria-hidden="true" />{p}</li>)}
          </ul>
          <p className="rv mt-8 font-hand text-[clamp(28px,3vw,38px)] leading-tight text-vino">“{t.house.quote}”</p>
        </div>
      </div>
    </section>
  );
}
