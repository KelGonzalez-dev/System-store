import { useRef } from 'react';
import { ABOUT, BRAND, pic } from '../data/content';
import { useParallax } from '../hooks/useParallax';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

export default function About() {
  const img = useRef(null);
  useParallax(img, 0.08, 1.16);

  return (
    <section id="quienes-somos" className="overflow-hidden bg-cream py-16 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6">
          <Reveal v="clip">
            <div className="s3d-l relative aspect-[4/5] overflow-hidden rounded-3xl bg-forest shadow-2xl shadow-forest/25 sm:aspect-[5/5]">
              <div ref={img} className="absolute inset-0">
                <SmartImage src={pic('farmer', 1100)} alt="Productor frente a las montañas de la Sierra Nevada" className="h-full w-full" />
              </div>
            </div>
          </Reveal>
          {/* Sello con el banner de la marca */}
          <Reveal v="zoom" delay={350} className="absolute -bottom-6 right-2 w-[68%] max-w-xs sm:-right-4">
            <div className="rounded-2xl bg-white p-3 shadow-xl shadow-forest/25 ring-1 ring-ink/10">
              <img src="/banner.webp" alt="Tres Raíces, cooperativa agroecológica. Café, cacao, caña" className="w-full" loading="lazy" draggable="false" />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal>
            <p className="text-sm font-bold text-leaf">Nuestra cooperativa</p>
            <h2 className="h-display mt-2 text-4xl text-forest sm:text-5xl">{ABOUT.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{ABOUT.text}</p>
          </Reveal>

          <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {ABOUT.features.map((f, i) => (
              <Reveal as="li" key={f.title} v="right" delay={i * 120} className="flex items-center gap-4 py-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-white">
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <span className="font-display text-xl font-semibold text-forest">{f.title}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
              {BRAND.legal} · <span className="font-semibold">{BRAND.sigla}</span>
            </p>
            <a href="#productores" className="btn mt-6 border-2 border-forest text-forest hover:bg-forest hover:text-white">
              Conoce a los productores <Icon name="arrow" className="h-5 w-5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
