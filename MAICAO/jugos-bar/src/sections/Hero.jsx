import { useEffect, useState } from 'react';
import { FEATURED, SEDES, cop } from '../data/content';
import { link } from '../router';
import Photo from '../components/Photo';
import { Icon } from '../components/Icons';

const Item = ({ d, className = '', children }) => (
  <div className={`hero-item ${className}`} style={{ '--d': `${d}ms` }}>{children}</div>
);

function Slice({ className = '', c1 = '#ff9f1c', c2 = '#ffd27a' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill={c1} />
      <circle cx="50" cy="50" r="42" fill={c2} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M50 50 L50 12" stroke={c1} strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 45} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="5" fill={c1} />
    </svg>
  );
}

export default function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const cur = FEATURED[i];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      if (!document.hidden) setI((v) => (v + 1) % FEATURED.length);
    }, 3600);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section id="inicio" className="lt-green relative isolate overflow-hidden bg-s1">
      <div className="hero-glow absolute inset-0 -z-10" />

      <div className="container-x grid min-h-[100svh] items-center gap-10 pb-16 pt-28 lg:grid-cols-12 lg:gap-6 lg:pb-20">
        <div className="lg:col-span-7">
          <Item d={150}>
            <span className="chip"><Icon name="pin" className="h-4 w-4 text-acc" />Maicao y Uribia, La Guajira</span>
          </Item>
          <Item d={300}>
            <h1 className="h-display mt-6 text-[clamp(3.6rem,19vw,5.6rem)] sm:text-[clamp(4rem,10vw,7.4rem)] lg:text-[clamp(4rem,8.4vw,8rem)]">
              <span className="block">El sabor</span>
              <span className="block">de lo</span>
              <span className="relative block text-acc">
                natural
                <svg viewBox="0 0 300 24" className="scribble absolute -bottom-1 left-0 h-[.16em] w-[88%]" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength="1" d="M4 16C60 4 120 22 180 10S260 6 296 12" style={{ stroke: 'rgb(var(--fg))' }} strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </Item>
          <Item d={520}>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-fg/75 lt:text-ink/80">Jugos, batidos, sándwiches y más, <b className="text-fg lt:text-ink">hechos al momento</b>. Pide a domicilio por WhatsApp desde la sede más cercana.</p>
          </Item>
          <Item d={700} className="mt-8 flex flex-wrap gap-4">
            <a {...link('#/menu')} className="btn btn-green px-8 py-4 text-[15px]">Pedir ahora<Icon name="arrow" className="h-4 w-4" /></a>
            <a {...link('#favoritos')} className="btn btn-line">Ver favoritos</a>
          </Item>
          <Item d={860} className="mt-9">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-fg/50 lt:text-ink/70">Pide en tu sede</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SEDES.map((s) => (
                <a key={s.id} {...link(`#/menu/${s.id}`)} className="qchip group inline-flex items-center gap-2 rounded-full border border-fg/15 bg-fg/5 px-4 py-2.5 text-sm font-bold transition-[background-color,color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-ink">
                  <span className="h-2 w-2 rounded-full bg-brand transition-colors group-hover:bg-ink lt:group-hover:bg-white" />{s.name}
                </a>
              ))}
            </div>
          </Item>
          <Item d={1020} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-fg/10 pt-6 lt:border-white/35">
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold text-acc">17,6 mil</span>
              <span className="text-xs font-bold uppercase leading-tight tracking-[.16em] text-fg/55 lt:text-ink/70">seguidores<br />en Instagram</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold text-acc">4</span>
              <span className="text-xs font-bold uppercase leading-tight tracking-[.16em] text-fg/55 lt:text-ink/70">sedes con<br />su menú</span>
            </div>
          </Item>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-[min(86vw,28rem)] lg:w-full" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
            <div className="hero-pop absolute inset-0 rotate-3 rounded-t-[999px] rounded-b-[2.5rem] border-2 border-brand/70 lt:border-white/80" style={{ '--d': '350ms' }} />
            <div className="hero-pop absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-leaf" style={{ '--d': '450ms' }}>
              {FEATURED.map((f, k) => (
                <div key={f.id} className={`absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-out ${k === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
                  <Photo k={f.feat} w={900} eager={k < 2} alt={f.name} className="h-full w-full" />
                </div>
              ))}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,9,6,.55), transparent 50%)' }} />
            </div>

            <div className="hero-pop absolute -left-[6%] bottom-[13%] w-[78%] max-w-[18rem]" style={{ '--d': '900ms' }}>
              <a key={cur.id} {...link('#/menu')} className="pop-in animate-floaty2 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-ink shadow-[0_20px_40px_-12px_rgba(0,0,0,.45)]">
                <span className="h-12 w-2 shrink-0 rounded-full" style={{ background: cur.c }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-extrabold uppercase leading-none">{cur.name}</span>
                  <span className="mt-1 block font-display text-xl font-extrabold text-brand-deep">{cop(cur.price)}</span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white"><Icon name="plus" className="h-5 w-5" stroke={2.4} /></span>
              </a>
            </div>

            <div className="absolute inset-x-0 -bottom-7 flex justify-center gap-2">
              {FEATURED.map((f, k) => (
                <button key={f.id} type="button" onClick={() => setI(k)} aria-label={`Ver ${f.name}`} className={`h-2 rounded-full transition-[width,background-color] duration-500 ${k === i ? 'w-8 bg-brand lt:bg-white' : 'w-2 bg-fg/30 hover:bg-fg/60'}`} />
              ))}
            </div>

            <div className="hero-pop absolute -right-[4%] top-[8%] w-[27%]" style={{ '--d': '1000ms' }}>
              <div className="animate-floaty aspect-square overflow-hidden rounded-full border-4 border-s1 shadow-[0_0_0_3px_rgb(var(--fg))]">
                <Photo k="straw" w={320} eager alt="Jugo de naranja con pitillo" className="h-full w-full" />
              </div>
            </div>

            <div className="hero-pop absolute -right-[3%] bottom-[24%] w-[26%]" style={{ '--d': '1150ms' }}>
              <div className="animate-spin-slow relative aspect-square rounded-full bg-brand text-ink lt:bg-white lt:text-brand-deep">
                <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs><path id="circ" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
                  <text fontSize="11" fontWeight="800" fill="currentColor" fontFamily="DM Sans, sans-serif">
                    <textPath href="#circ" textLength="272" lengthAdjust="spacing">100% NATURAL · MAICAO · URIBIA ·</textPath>
                  </text>
                </svg>
              </div>
            </div>

            <Slice className="animate-spin-slow absolute -left-[6%] top-[2%] hidden w-[16%] sm:block" />
            <Slice className="animate-floaty2 absolute right-[34%] -top-[5%] hidden w-[10%] sm:block" c1="#ffffff" c2="#e9f6d6" />
          </div>
        </div>
      </div>
    </section>
  );
}
