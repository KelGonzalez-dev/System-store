import { useRef } from 'react';
import Img from './Img';
import { LOCAL } from '../data';
import { useI18n } from '../i18n';
import { clamp, ease, lerp, useScrollFrame } from '../lib/scroll';

const IMGS = [LOCAL.tacos, '1536935338788-846bb9981813', LOCAL.neonGlobos];

// Frase que se enciende en rosa palabra por palabra al hacer scroll
function Statement({ text }) {
  const ref = useRef(null);
  const last = useRef(-1);
  const words = text.split(' ');
  useScrollFrame(ref, (p) => {
    const n = Math.round(clamp((p - 0.15) / 0.4) * words.length);
    if (n === last.current) return;
    last.current = n;
    const s = ref.current.children;
    for (let i = 0; i < s.length; i++) s[i].classList.toggle('lit', i < n);
  });
  return <p ref={ref} className="vibe-statement font-display">{words.map((w, i) => <span key={i}>{w} </span>)}</p>;
}

// Tarjeta que entra girando en 3D desde un lado, alterno
function Card({ c, img, i }) {
  const ref = useRef(null);
  const inner = useRef(null);
  useScrollFrame(ref, (p) => {
    const e = ease(clamp(p / 0.42));
    const side = i % 2 ? 1 : -1;
    inner.current.style.transform = `perspective(1100px) rotateY(${lerp(side * 28, 0, e)}deg) rotateX(${lerp(10, 0, e)}deg) translate3d(0,${lerp(70, 0, e)}px,0)`;
    inner.current.style.opacity = lerp(0, 1, e);
  });
  return (
    <article ref={ref} className={`vibe-card vc-${i}`}>
      <div ref={inner} className="vc-inner will-change-transform">
        <div className="vc-photo"><Img id={img} w={700} sizes="(max-width: 768px) 90vw, 30vw" className="h-full w-full" alt="" /></div>
        <div className="vc-body">
          <span className="vc-num font-display">0{i + 1}</span>
          <h3 className="font-display">{c.t}</h3>
          <p>{c.d}</p>
        </div>
      </div>
    </article>
  );
}

export default function Vibe() {
  const { t } = useI18n();
  return (
    <section id="experiencia" className="relative overflow-hidden bg-noche py-[clamp(80px,10vw,140px)]">
      <div className="vibe-arc" aria-hidden="true" />
      <div className="wrap relative">
        <Statement key={t.vibe.statement} text={t.vibe.statement} />
        <div className="vibe-grid mt-[clamp(56px,7vw,96px)]">
          {t.vibe.cards.map((c, i) => <Card key={i} c={c} img={IMGS[i]} i={i} />)}
        </div>
      </div>
    </section>
  );
}
