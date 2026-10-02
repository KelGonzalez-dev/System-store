import { useRef } from 'react';
import { pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import { useParallax } from '../hooks/useParallax';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';

export default function Concept() {
  const { t } = useLang();
  const img = useRef(null);
  useParallax(img, 0.08, 1.16);

  return (
    <section id="concepto" className="overflow-hidden bg-night py-20 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="relative lg:col-span-5">
          <Reveal v="clip">
            <div className="s3d-l relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-neon/10">
              <div ref={img} className="absolute inset-0">
                <SmartImage src={pic('concept', 1000)} alt="" className="h-full w-full" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
            </div>
          </Reveal>
          <Reveal v="zoom" delay={400} className="absolute -bottom-8 -right-2 w-40 sm:-right-8 sm:w-52">
            <img src="/logo.webp" alt="" className="animate-floaty rounded-full" style={{ boxShadow: '0 0 60px rgba(255,122,47,.5)' }} loading="lazy" draggable="false" />
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow">{t.concept.eyebrow}</p>
            <h2 className="h-thin mt-5 text-5xl sm:text-7xl">
              {t.concept.title1}
              <span className="neon-soft block font-serif font-light italic text-ember-light">{t.concept.title2}</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neon/75">{t.concept.p1}</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neon/60">{t.concept.p2}</p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {t.concept.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 130}>
                <div className="h-full rounded-2xl border border-neon/10 bg-coal p-6 transition-colors duration-500 hover:border-ember/60">
                  <span className="font-display text-sm font-light tracking-[.3em] text-ember-light">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl font-light">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neon/60">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
