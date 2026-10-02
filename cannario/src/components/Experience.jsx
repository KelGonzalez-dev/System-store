import { useRef } from 'react';
import Img from './Img';
import { PILLAR_IMG } from '../data';
import { useI18n } from '../i18n';
import { clamp, ease, lerp, useScrollFrame } from '../lib/scroll';

// La frase se "enciende" palabra por palabra a medida que se desliza
function Statement({ text }) {
  const ref = useRef(null);
  const last = useRef(-1);
  const words = text.split(' ');
  useScrollFrame(ref, (p) => {
    const n = Math.round(clamp((p - 0.15) / 0.3) * words.length);
    if (n === last.current) return;
    last.current = n;
    const spans = ref.current.children;
    for (let i = 0; i < spans.length; i++) spans[i].classList.toggle('lit', i < n);
  }, 'pass', [text]);
  return (
    <p ref={ref} className="statement font-display">
      {words.map((w, i) => <span key={i}>{w} </span>)}
    </p>
  );
}

// Cada arco gira en 3D desde abajo hasta quedar de frente; la foto hace parallax interno
function Pillar({ img, title, text, index }) {
  const ref = useRef(null);
  const card = useRef(null);
  const pic = useRef(null);
  useScrollFrame(ref, (p) => {
    const e = ease(clamp(p / 0.38));
    card.current.style.transform = `rotateX(${lerp(18, 0, e)}deg) translate3d(0,${lerp(60, 0, e)}px,${lerp(-80, 0, e)}px)`;
    card.current.style.opacity = lerp(0.2, 1, e);
    pic.current.style.transform = `translate3d(0,${lerp(-9, 9, p)}%,0) scale(1.2)`;
  });
  return (
    <article ref={ref} className={`pillar pillar-${index}`}>
      <div ref={card} className="will-change-transform" style={{ transformOrigin: '50% 100%' }}>
        <div className="arch aspect-[4/5] overflow-hidden bg-stone-deep">
          <div ref={pic} className="h-full w-full will-change-transform">
            <Img id={img} w={800} sizes="(max-width: 768px) 88vw, 320px" className="h-full w-full" alt="" />
          </div>
        </div>
        <h3 className="mt-5 font-display text-[clamp(24px,2vw,30px)] leading-none text-ash">{title}</h3>
        <p className="mt-2.5 max-w-[34ch] text-[15px] font-light leading-relaxed text-mute">{text}</p>
      </div>
    </article>
  );
}

export default function Experience() {
  const { t } = useI18n();
  return (
    <section id="experiencia" className="relative bg-stone pb-[clamp(70px,9vw,120px)] pt-[clamp(80px,10vw,130px)]">
      <div className="wrap">
        <Statement key={t.exp.statement} text={t.exp.statement} />

        <div className="pillars mt-[clamp(56px,7vw,96px)]">
          {t.exp.pillars.map((c, i) => <Pillar key={i} index={i} img={PILLAR_IMG[i]} title={c.t} text={c.d} />)}
        </div>

        <p className="rv mt-[clamp(50px,6vw,80px)] flex items-center gap-4 border-t border-ash/15 pt-7 text-[16px] text-ash">
          <svg viewBox="0 0 32 32" className="w-8 shrink-0 fill-none stroke-gold" strokeWidth="1.3" aria-hidden="true"><rect x="4" y="12" width="24" height="10" rx="3" /><circle cx="10" cy="24" r="2.4" /><circle cx="22" cy="24" r="2.4" /><path d="M8 12l3-6h10l3 6" /></svg>
          {t.exp.valet}
        </p>
      </div>
    </section>
  );
}
