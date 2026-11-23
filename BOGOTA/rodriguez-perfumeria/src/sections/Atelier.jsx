import { useEffect, useRef, useState } from 'react';
import { PRODUCTS, cop, waLink } from '../data/content';
import { useTilt } from '../hooks/useTilt';
import { link } from '../router';
import Reveal from '../components/Reveal';
import ProductArt from '../components/ProductArt';
import ProductModal from '../components/ProductModal';
import { Icon, WhatsAppIcon } from '../components/Icons';

const FEATURED = PRODUCTS.filter((p) => p.feat);

export default function Atelier() {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const auto = useRef(true);
  const visible = useRef(false);
  const root = useRef(null);
  const stage = useRef(null);
  useTilt(stage, 8);
  const p = FEATURED[i];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    io.observe(root.current);
    const id = setInterval(() => {
      if (auto.current && visible.current && !document.hidden) setI((n) => (n + 1) % FEATURED.length);
    }, 5200);
    return () => { io.disconnect(); clearInterval(id); };
  }, []);

  const pick = (n) => { auto.current = false; setI(n); };

  return (
    <section id="coleccion" ref={root} className="relative overflow-hidden bg-ink py-20 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Colección</p>
            <h2 className="h-display mt-5 text-5xl sm:text-7xl">
              Seis firmas <span className="glow-gold block">para empezar</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <a {...link('#/catalogo')} className="btn btn-line">Ver catálogo completo<Icon name="arrow" className="h-4 w-4" /></a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-6">
                    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:col-span-3 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {FEATURED.map((f, n) => (
              <button key={f.id} type="button" onClick={() => pick(n)} aria-pressed={i === n} className={`group relative shrink-0 rounded-full border px-5 py-2.5 text-left transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-5 ${i === n ? 'border-gold bg-gold/10 lg:bg-transparent' : 'hairline'} lg:hairline`}>
                <span className="flex items-baseline gap-4">
                  <span className={`hidden font-body text-[11px] tracking-[.3em] lg:inline ${i === n ? 'text-gold' : 'text-ivory/30'}`}>0{n + 1}</span>
                  <span className={`font-display text-xl transition-all duration-500 lg:text-3xl ${i === n ? 'text-ivory lg:translate-x-2' : 'text-ivory/45 group-hover:text-ivory/80'}`}>{f.name}</span>
                </span>
                <span className={`absolute -bottom-px left-0 hidden h-px bg-gold transition-all duration-700 lg:block ${i === n ? 'w-full' : 'w-0'}`} style={{ boxShadow: '0 0 8px #d4af6a' }} />
              </button>
            ))}
          </div>

                    <div className="lg:col-span-5">
            <div ref={stage} className="tilt relative mx-auto aspect-[4/5] w-full max-w-[26rem]">
              <div key={`g${p.id}`} className="glow-in absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 50% 52%, ${p.glow}55, transparent 62%)` }} />
              <svg viewBox="0 0 400 400" className="animate-spin-slow absolute left-0 top-[5%] h-[90%] w-full" fill="none" aria-hidden="true">
                <circle cx="200" cy="200" r="190" stroke="#d4af6a" strokeOpacity=".3" strokeDasharray="1 8" strokeLinecap="round" strokeWidth="2" />
              </svg>
              <div className="animate-floaty tilt-pop absolute inset-x-[16%] bottom-[8%] top-[6%]">
                <div key={p.id} className="bottle-in h-full w-full"><ProductArt p={p} className="h-full w-full drop-shadow-[0_28px_34px_rgba(0,0,0,.55)]" /></div>
              </div>
            </div>
          </div>

                    <div key={`d${p.id}`} className="fade-up lg:col-span-4 lg:pl-6">
            {p.tag && <span className="hairline mb-4 inline-block rounded-full border px-3 py-1 font-body text-[10px] font-medium uppercase tracking-[.28em] text-gold">{p.tag}</span>}
            <h3 className="h-display text-5xl sm:text-6xl">{p.name}</h3>
            <p className="mt-2 font-display text-xl text-gold">{p.family}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ivory/60">{p.desc}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[...p.notes.top.slice(0, 1), ...p.notes.heart.slice(0, 1), ...p.notes.base.slice(0, 1)].map((n) => (
                <li key={n} className="hairline rounded-full border px-3.5 py-1.5 font-body text-[10px] uppercase tracking-[.2em] text-ivory/75">{n}</li>
              ))}
            </ul>
            <p className="gold-text mt-8 font-display text-5xl font-light tabular-nums">{cop(p.price)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={waLink(`Hola Rodriguez Perfumería, me interesa *${p.name}* (100 ml) - ${cop(p.price)}. ¿Está disponible?`)} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WhatsAppIcon className="h-4 w-4" />Pedir</a>
              <button type="button" onClick={() => setSel(p)} className="btn btn-line">Detalle</button>
            </div>
          </div>
        </div>
      </div>
      {sel && <ProductModal p={sel} onClose={() => setSel(null)} />}
    </section>
  );
}
