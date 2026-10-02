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
  useParallax(bg, 0.2, 1.22);

  return (
    <section id="inicio" className="grain relative isolate overflow-hidden bg-night">
      <div className="absolute inset-0 -z-10">
        <div ref={bg} className="absolute inset-0">
          <SmartImage src={pic('hero', 1800)} alt="" eager className="h-full w-full" imgClassName="opacity-55" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/60" />
        <div className="absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-wine/30 blur-[120px]" />
      </div>

      <div className="container-x grid min-h-[100svh] items-center gap-10 pb-28 pt-32 md:grid-cols-12">
        <div className="md:col-span-8">
          <Item d={150}><p className="eyebrow flex items-center gap-2"><Icon name="heart" className="h-4 w-4 text-wine-light" />{t.hero.eyebrow}</p></Item>
          <Item d={320}>
            <h1 className="h-display mt-6 text-cream">
              <span className="block text-[clamp(2.6rem,7.5vw,5.6rem)] uppercase tracking-tight">{t.hero.line1}</span>
              <span className="script gold-shimmer -mt-1 block text-[clamp(3.4rem,10vw,7.4rem)] font-normal normal-case">{t.hero.line2}</span>
            </h1>
          </Item>
          <Item d={560}><p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/80">{t.hero.text}</p></Item>
          <Item d={760} className="mt-9 flex flex-wrap gap-4">
            <a href="#reservas" className="btn btn-wine">{t.hero.ctaReserve}<Icon name="arrow" className="h-4 w-4" /></a>
            <a href="#carta" className="btn btn-outline">{t.hero.ctaMenu}</a>
          </Item>
        </div>

        <div className="hidden md:col-span-4 md:block">
          <Item d={900}>
            <div className="animate-floaty relative mx-auto w-full max-w-[20rem]">
              <div className="absolute -inset-8 rounded-full bg-gold/20 blur-3xl" />
              <img src="/logo-badge.png" alt="Casa Riosa" className="relative w-full rounded-full" style={{ boxShadow: '0 0 80px rgba(198,161,91,.4)' }} draggable="false" fetchpriority="high" />
            </div>
          </Item>
        </div>
      </div>

      <div className="hero-item absolute inset-x-0 bottom-8 flex flex-col items-center gap-3" style={{ '--d': '1150ms' }}>
        <span className="font-display text-[11px] font-bold uppercase tracking-[.4em] text-cream/55">{t.hero.scroll}</span>
        <span className="relative h-12 w-px overflow-hidden bg-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gold" style={{ animation: 'scrollHint 2s cubic-bezier(.6,0,.3,1) infinite' }} />
        </span>
      </div>
    </section>
  );
}
