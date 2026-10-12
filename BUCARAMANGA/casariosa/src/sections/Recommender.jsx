import { useState } from 'react';
import { pic, waLink } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

export default function Recommender() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const pick = t.recommender.occasions[active];

  return (
    <section className="relative overflow-hidden bg-night py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-wine/25 blur-[120px]" />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.recommender.eyebrow}</p>
          <h2 className="h-display mt-5 text-4xl text-cream sm:text-6xl">
            {t.recommender.title1}{' '}
            <span className="script gold-shimmer font-normal">{t.recommender.title2}</span>
          </h2>
          <p className="mt-5 text-cream/70">{t.recommender.text}</p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-10 max-w-3xl">
          <p className="mb-4 text-center font-display text-[12px] font-bold uppercase tracking-[.26em] text-cream/55">{t.recommender.question}</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {t.recommender.occasions.map((o, i) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`rounded-full border px-4 py-2 font-display text-[13px] font-bold transition-colors duration-300 ${
                  active === i ? 'border-wine bg-wine text-cream' : 'border-cream/20 text-cream/70 hover:border-gold hover:text-cream'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200} className="mx-auto mt-10 max-w-4xl">
          <div key={pick.key} className="grid overflow-hidden rounded-[2rem] border border-cream/10 bg-coal sm:grid-cols-2">
            <div className="relative aspect-[4/3] sm:aspect-auto">
              <SmartImage src={pic(pick.categoryKey, 900)} alt={pick.category} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="font-display text-[12px] font-bold uppercase tracking-[.26em] text-gold">{pick.label}</span>
              <h3 className="mt-3 font-display text-3xl font-bold text-cream">{pick.category}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-cream/75">{pick.note}</p>
              <p className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-gold-light">
                <Icon name="heart" className="h-4 w-4" />{pick.pairing}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={waLink(`Hola Casa Riosa, el recomendador me sugirió ${pick.category}. ${t.recommender.ask}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-wine btn-sm">
                  {t.recommender.ask}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
