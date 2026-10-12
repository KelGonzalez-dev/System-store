import { useRef } from 'react';
import { SUSTAIN, pic } from '../data/content';
import { useParallax } from '../hooks/useParallax';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

export default function Sustainability() {
  const bg = useRef(null);
  useParallax(bg, 0.14, 1.2);

  return (
    <section id="sostenibilidad" className="relative isolate overflow-hidden bg-forest py-20 text-white sm:py-28">
      <div className="absolute inset-0 -z-10">
        <div ref={bg} className="absolute inset-0">
          <SmartImage src={pic('mountains', 1600)} alt="Sierra Nevada de Santa Marta" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-forest/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest via-transparent to-forest" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="h-display text-4xl sm:text-6xl">{SUSTAIN.title}</h2>
          <p className="mt-4 font-script text-3xl text-gold-light">Sostenibilidad</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SUSTAIN.cards.map((c, i) => (
            <Reveal key={c.title} v="up" delay={i * 130}>
              <div className="s3d h-full rounded-3xl border border-white/20 bg-white/10 p-7 transition-transform duration-500 hover:-translate-y-2 md:backdrop-blur-sm">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-lime text-forest">
                  <Icon name={c.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold">{c.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-white/85">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
