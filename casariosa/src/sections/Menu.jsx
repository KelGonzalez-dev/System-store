import { useRef } from 'react';
import { CONTACT, pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import { useTilt } from '../hooks/useTilt';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

function Card({ item }) {
  const ref = useRef(null);
  useTilt(ref, 8);
  return (
    <div ref={ref} className="tilt group relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border border-cream/10 bg-coal">
      <SmartImage src={pic(item.key, 800)} alt="" className="absolute inset-0" imgClassName="opacity-80 transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: 'translateZ(50px)' }}>
        <span className="font-display text-sm font-bold tracking-[.3em] text-gold">{item.tag}</span>
        <h3 className="mt-2 font-display text-4xl font-bold text-cream">{item.title}</h3>
        <p className="mt-2 max-w-[17rem] text-[15px] leading-snug text-cream/70">{item.text}</p>
      </div>
    </div>
  );
}

export default function Menu() {
  const { t } = useLang();
  return (
    <section id="carta" className="relative overflow-hidden bg-coal py-20 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-wine/20 blur-[110px]" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">{t.menu.eyebrow}</p>
            <h2 className="h-display mt-5 text-5xl text-cream sm:text-7xl">
              {t.menu.title1}
              <span className="script gold-shimmer block text-[1.05em] font-normal">{t.menu.title2}</span>
            </h2>
          </Reveal>
          <Reveal delay={150} className="max-w-sm">
            <p className="text-cream/65">{t.menu.text}</p>
            <a href={CONTACT.menuUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-6">
              <Icon name="book" className="h-4 w-4" />{t.menu.cta}
            </a>
          </Reveal>
        </div>
      </div>

      <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:container-x lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
        {t.menu.items.map((item, i) => (
          <Reveal key={item.title} v="up" delay={i * 90} className="w-[78%] shrink-0 snap-center sm:w-[42%] lg:w-auto" style={{ perspective: '1000px' }}>
            <Card item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
