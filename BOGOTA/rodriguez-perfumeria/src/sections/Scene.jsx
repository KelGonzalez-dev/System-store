import { useEffect, useRef, useState } from 'react';
import { STAGES } from '../data/content';
import { subscribeScroll } from '../hooks/scrollBus';
import Bottle from '../components/Bottle';

const ACT = ['I', 'II', 'III'];

export default function Scene() {
  const wrap = useRef(null);
  const art = useRef(null);
  const ring = useRef(null);
  const glow = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const apply = (p) => {
      art.current?.style.setProperty('--lvl', (0.1 + p * 0.84).toFixed(3));
      if (ring.current) ring.current.style.strokeDashoffset = (1 - p).toFixed(3);
      if (glow.current) glow.current.style.opacity = (0.2 + p * 0.8).toFixed(2);
      const i = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      setIdx((prev) => (prev === i ? prev : i));
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.current.dataset.static = '1';
      apply(0.9);
      return;
    }
    return subscribeScroll(() => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      apply(Math.min(1, Math.max(0, -r.top / total)));
    });
  }, []);

  return (
    <section id="esencia" ref={wrap} className="relative bg-noir" style={{ height: '320svh' }}>
      <div className="scene-stick sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 50% at 28% 52%, rgba(212,175,106,.10), transparent 70%)' }} />
        <div className="container-x relative grid h-full items-center gap-2 pb-6 pt-20 md:grid-cols-2 md:gap-16 md:pt-16">
          <div className="relative mx-auto aspect-square w-[min(62vw,38svh,30rem)] md:w-[min(46vw,60svh,32rem)]">
            <div ref={glow} className="absolute -inset-[18%] rounded-full" style={{ opacity: 0.2, background: 'radial-gradient(circle, rgba(212,175,106,.38), transparent 62%)' }} />
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
              <circle cx="100" cy="100" r="97" stroke="#d4af6a" strokeOpacity=".15" />
              <g transform="rotate(-90 100 100)">
                <circle ref={ring} cx="100" cy="100" r="97" stroke="#f1d9a0" strokeWidth="1.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
              </g>
            </svg>
            <div ref={art} className="absolute inset-[10%]" style={{ '--lvl': 0.1 }}>
              <Bottle shape="classic" liquid="#c58a2f" className="h-full w-full drop-shadow-[0_24px_36px_rgba(0,0,0,.6)]" />
            </div>
          </div>

          <div className="relative">
            <p className="eyebrow">La esencia</p>
            <h2 className="h-display mt-4 text-5xl sm:text-7xl">
              Una fragancia <span className="glow-gold">en tres actos</span>
            </h2>

            <div className="relative mt-6 h-[13rem] sm:h-[19rem]">
              {STAGES.map((s, i) => (
                <div key={s.k} className={`absolute inset-0 transition-[opacity,transform] ${idx === i ? 'translate-y-0 opacity-100 duration-700 delay-200' : 'pointer-events-none translate-y-6 opacity-0 duration-200'}`}>
                  <span className="outline-text pointer-events-none absolute -top-2 right-0 font-display text-[7rem] font-light leading-none sm:text-[11rem]">{`0${i + 1}`}</span>
                  <p className="font-body text-[11px] font-medium uppercase tracking-[.38em] text-ivory/45">Acto {ACT[i]}</p>
                  <h3 className="gold-text font-display text-5xl font-light sm:text-7xl">{s.k}</h3>
                  <p className="mt-2 font-display text-xl text-ivory/70 sm:text-2xl">{s.t}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.n.map((n) => <li key={n} className="hairline rounded-full border bg-ink/50 px-4 py-1.5 font-body text-[11px] uppercase tracking-[.2em] text-ivory/80">{n}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
