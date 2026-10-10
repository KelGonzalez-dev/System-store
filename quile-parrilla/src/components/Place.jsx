import { useEffect, useRef, useState } from 'react';
import Img from './Img';
import { L } from '../data';
import { useI18n } from '../i18n';

// Número que cuenta hacia arriba al entrar en pantalla
function Count({ to, suffix = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => { const k = Math.min(1, (now - t0) / 1400); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <b ref={ref}>{v.toLocaleString('es-CO')}{suffix}</b>;
}

export default function Place() {
  const { t } = useI18n();
  return (
    <section id="lugar" className="place-sec relative overflow-hidden">
      <div className="wrap grid items-center gap-12 py-[clamp(80px,10vw,130px)] lg:grid-cols-2">
        <div className="place-collage">
          <div className="pc-a rv"><Img id={L.interior} alt="Quile Parrilla" w={800} className="h-full w-full" /></div>
          <div className="pc-b rv"><Img id={L.ambiente} alt="" w={500} className="h-full w-full" /></div>
          <div className="pc-c rv"><Img id={L.parrillero} alt="" w={500} className="h-full w-full" /></div>
        </div>
        <div>
          <p className="eyebrow">{t.place.eyebrow}</p>
          <h2 className="rv mask-up sec-title mt-3 text-crema"><span>{t.place.title}</span></h2>
          <p className="rv mt-5 max-w-[50ch] text-[16.5px] leading-relaxed text-crema/75">{t.place.lead}</p>
          <ul className="mt-7 grid gap-3">
            {t.place.points.map((p) => <li key={p} className="place-pt"><i aria-hidden="true">🔥</i>{p}</li>)}
          </ul>
          <p className="rv mt-8 font-script text-[clamp(34px,3.6vw,48px)] leading-none text-fuego">“{t.place.quote}”</p>
          <div className="place-stats">
            <div><Count to={10000} suffix="+" /><span>{t.hero.fans}</span></div>
            <div><Count to={658} /><span>{t.hero.posts}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
