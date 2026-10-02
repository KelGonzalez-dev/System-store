import { useRef } from 'react';
import { pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import { useParallax } from '../hooks/useParallax';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

const Item = ({ d, className = '', children }) => (
  <div className={`hero-item ${className}`} style={{ '--d': `${d}ms` }}>{children}</div>
);

export default function Hero() {
  const { t } = useLang();
  const bg = useRef(null);
  useParallax(bg, 0.22, 1.25);

  return (
    <section id="inicio" className="grain relative isolate overflow-hidden bg-night">
      <div className="absolute inset-0 -z-10">
        <div ref={bg} className="absolute inset-0">
          <SmartImage src={pic('hero', 1800)} alt="" eager className="h-full w-full" imgClassName="opacity-60" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/70 to-night/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/70" />
        <div className="absolute -right-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-ember/25 blur-[120px]" />
      </div>

      <div className="container-x grid min-h-[100svh] items-center gap-10 pb-32 pt-32 md:grid-cols-12">
        <div className="md:col-span-8">
          <Item d={200}><p className="eyebrow">{t.hero.eyebrow}</p></Item>
          <Item d={380}>
            <h1 className="h-thin mt-6 text-[clamp(2.9rem,9.2vw,8.4rem)]">
              <span className="block">{t.hero.line1}</span>
              <span className="neon-soft mt-1 block font-serif text-[.92em] font-light italic text-ember-light">{t.hero.line2}</span>
            </h1>
          </Item>
          <Item d={620}><p className="mt-8 max-w-xl text-lg leading-relaxed text-neon/75">{t.hero.text}</p></Item>
          <Item d={820} className="mt-10 flex flex-wrap gap-4">
            <a href="#reservas" className="btn btn-solid">{t.hero.ctaReserve}<Icon name="arrow" className="h-4 w-4" /></a>
            <a href="#carta" className="btn btn-neon">{t.hero.ctaMenu}</a>
          </Item>
        </div>

        <div className="hidden md:col-span-4 md:block">
          <Item d={900}>
            <div className="animate-floaty relative mx-auto w-full max-w-[22rem]">
              <div className="absolute -inset-10 rounded-full bg-ember/30 blur-3xl" />
              <img src="/logo.webp" alt="Lulo Café Bar" className="flicker relative w-full rounded-full" style={{ boxShadow: '0 0 90px rgba(255,122,47,.45)' }} draggable="false" fetchpriority="high" />
            </div>
          </Item>
        </div>
      </div>

      <div className="hero-item absolute inset-x-0 bottom-8 flex flex-col items-center gap-3" style={{ '--d': '1300ms' }}>
        <span className="font-display text-[11px] font-light uppercase tracking-[.4em] text-neon/60">{t.hero.scroll}</span>
        <span className="relative h-12 w-px overflow-hidden bg-neon/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-ember-light" style={{ animation: 'scrollHint 2s cubic-bezier(.6,0,.3,1) infinite' }} />
        </span>
      </div>
    </section>
  );
}
