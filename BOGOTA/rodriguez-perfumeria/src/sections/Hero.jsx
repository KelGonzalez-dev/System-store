import { useRef } from 'react';
import { useTilt } from '../hooks/useTilt';
import { link } from '../router';
import { LOGO, waLink } from '../data/content';
import Photo from '../components/Photo';
import GoldDust from '../components/GoldDust';
import { Icon, WhatsAppIcon } from '../components/Icons';

const Item = ({ d, className = '', children }) => (
  <div className={`hero-item ${className}`} style={{ '--d': `${d}ms` }}>{children}</div>
);

const BUBBLES = [
  { k: 'closeup', cls: 'left-[56%] top-[0%] w-[24%]', anim: 'animate-floaty', delay: '0s', pop: 700 },
  { k: 'pour', cls: 'left-[-1%] top-[28%] w-[21%]', anim: 'animate-floaty2', delay: '-2s', pop: 850 },
  { k: 'malle', cls: 'left-[79%] top-[54%] w-[21%]', anim: 'animate-floaty', delay: '-4s', pop: 1000 },
  { k: 'bottle', cls: 'left-[26%] top-[79%] w-[22%]', anim: 'animate-floaty2', delay: '-1s', pop: 1150 },
];

export default function Hero() {
  const stage = useRef(null);
  useTilt(stage, 6);

  return (
    <section id="inicio" className="grain relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(50% 55% at 74% 48%, rgba(212,175,106,.2), transparent 70%), radial-gradient(45% 45% at 6% 100%, rgba(138,106,46,.22), transparent 70%), radial-gradient(40% 40% at 100% 100%, rgba(168,70,60,.12), transparent 70%)' }} />
        <GoldDust count={window.innerWidth < 768 ? 22 : 46} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="container-x grid min-h-[100svh] items-center gap-6 pb-20 pt-28 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-28">
        <div className="md:col-span-7">
          <Item d={200} className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Perfumería de autor</p>
            <span className="pill"><span className="dot-live" />Pedidos por WhatsApp · Envíos a todo el país</span>
          </Item>
          <Item d={380}>
            <h1 className="h-display mt-6 text-[clamp(5rem,12vw,10.5rem)]">
              <span className="glow-ivory block">Tu esencia</span>
              <span className="glow-gold block">tu firma</span>
            </h1>
          </Item>
          <Item d={600}>
            <p className="mt-6 font-body text-2xl font-semibold text-ivory/80 sm:text-3xl">Hoy se me antoja oler increíble</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ivory/65 sm:text-lg">Perfumes originales, árabes y de nicho. Decants para probar, frascos completos para quedarte y asesoría personal por WhatsApp.</p>
          </Item>
          <Item d={800} className="mt-9 flex flex-wrap gap-4">
            <a href={waLink('Hola Rodriguez Perfumería, quiero asesoría para elegir mi perfume.')} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WhatsAppIcon className="h-5 w-5" />Pedir por WhatsApp</a>
            <a {...link('#coleccion')} className="btn btn-line">Ver colección<Icon name="arrow" className="h-4 w-4" /></a>
          </Item>
        </div>

        <div className="order-first md:order-none md:col-span-5">
          <div ref={stage} className="tilt relative mx-auto aspect-square w-[min(84vw,32rem)] md:w-full">
            <svg viewBox="0 0 400 400" className="animate-spin-slow absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
              <circle cx="200" cy="200" r="190" stroke="#d4af6a" strokeOpacity=".35" strokeDasharray="2 10" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
            <svg viewBox="0 0 400 400" className="animate-spin-rev absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
              <path d="M62 300A170 170 0 0 1 130 62" stroke="#d4af6a" strokeOpacity=".18" strokeWidth="12" strokeLinecap="round" />
              <path d="M62 300A170 170 0 0 1 130 62" stroke="#f1d9a0" strokeWidth="3" strokeLinecap="round" />
              <path d="M338 100A170 170 0 0 1 270 338" stroke="#d4af6a" strokeOpacity=".18" strokeWidth="12" strokeLinecap="round" />
              <path d="M338 100A170 170 0 0 1 270 338" stroke="#d4af6a" strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="hero-pop absolute inset-[14%]" style={{ '--d': '500ms' }}>
              <div className="h-full w-full overflow-hidden rounded-full p-[3%]" style={{ background: 'radial-gradient(circle at 50% 38%, #1d1710, #050403 72%)', boxShadow: '0 0 0 2px rgba(241,217,160,.85), 0 0 0 9px rgba(212,175,106,.1), 0 0 70px 6px rgba(212,175,106,.32), inset 0 0 60px rgba(212,175,106,.12)' }}>
                <img src={LOGO} alt="Rodriguez Perfumería" className="h-full w-full object-contain" draggable="false" fetchpriority="high" />
              </div>
            </div>

            {BUBBLES.map((b) => (
              <div key={b.k} className={`hero-pop absolute aspect-square ${b.cls}`} style={{ '--d': `${b.pop}ms` }}>
                <div className={`tilt-pop h-full w-full ${b.anim}`} style={{ animationDelay: b.delay }}>
                  <div className="h-full w-full overflow-hidden rounded-full" style={{ boxShadow: '0 0 0 2px #d4af6a, 0 0 0 5px rgba(5,4,3,.9), 0 0 26px rgba(212,175,106,.5)' }}>
                    <Photo k={b.k} w={420} eager className="h-full w-full" />
                  </div>
                </div>
              </div>
            ))}

            <span className="hero-pop absolute left-[3%] top-[8%] aspect-square w-[11%]" style={{ '--d': '900ms' }}>
              <span className="animate-floaty block h-full w-full rounded-full" style={{ background: 'radial-gradient(circle at 32% 28%, #fff1c9, #d4af6a 45%, #7a5a22)', boxShadow: '0 10px 30px rgba(212,175,106,.35)' }} />
            </span>
            <span className="hero-pop absolute left-[88%] top-[24%] aspect-square w-[8%]" style={{ '--d': '1050ms' }}>
              <span className="animate-floaty2 block h-full w-full rounded-full" style={{ background: 'radial-gradient(circle at 32% 28%, #5a4a30, #1b150d 60%, #050403)', boxShadow: '0 8px 24px rgba(0,0,0,.6)' }} />
            </span>

            <span className="hero-pop animate-floaty absolute left-[52%] top-[87%] hidden -rotate-6 rounded-full border border-gold/60 bg-ink/80 px-4 py-2 font-cond text-[15px] font-bold uppercase tracking-[.14em] text-gold-light sm:block" style={{ '--d': '1200ms' }}>100% originales</span>
            <span className="hero-pop animate-floaty2 absolute left-[1%] top-[68%] hidden rotate-[-7deg] rounded-full border border-gold bg-gold px-4 py-2 font-cond text-[15px] font-bold uppercase tracking-[.14em] text-ink sm:block" style={{ '--d': '1300ms' }}>Árabes y nicho</span>
          </div>
        </div>
      </div>

      <div className="hero-item absolute inset-x-0 bottom-6 hidden flex-col items-center gap-3 md:flex" style={{ '--d': '1500ms' }}>
        <span className="font-cond text-[12px] font-semibold uppercase tracking-[.4em] text-ivory/50">Desliza</span>
        <span className="relative h-10 w-px overflow-hidden bg-ivory/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gold" style={{ animation: 'scrollHint 2s cubic-bezier(.6,0,.3,1) infinite' }} />
        </span>
      </div>
    </section>
  );
}
