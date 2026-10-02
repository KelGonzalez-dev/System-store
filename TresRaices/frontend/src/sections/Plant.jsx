import { useEffect, useRef } from 'react';
import { PLANT, pic } from '../data/content';
import { subscribeScroll } from '../hooks/scrollBus';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';

export default function Plant() {
  const track = useRef(null);
  const fill = useRef(null);

  /* La línea se "dibuja" mientras haces scroll (solo transform) */
  useEffect(() => {
    return subscribeScroll(() => {
      const el = track.current;
      if (!el || !fill.current) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
      fill.current.style.transform = `scaleY(${p.toFixed(3)})`;
    });
  }, []);

  return (
    <section id="planta" className="relative overflow-hidden bg-forest py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-leaf/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="h-display text-4xl sm:text-5xl">{PLANT.title}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">{PLANT.text}</p>
            </Reveal>
            <Reveal v="clip" delay={150} className="mt-8">
              <div className="s3d-l aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/15">
                <SmartImage src={pic('plant', 900)} alt="Granos de café y cacao en proceso" className="h-full w-full" />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ol ref={track} className="relative space-y-10 pl-14 sm:pl-16">
            <span className="absolute bottom-3 left-[22px] top-3 w-[3px] rounded-full bg-white/15 sm:left-[26px]" aria-hidden="true">
              <span ref={fill} className="absolute inset-0 origin-top scale-y-0 rounded-full bg-gradient-to-b from-lime via-gold-light to-berry" />
            </span>
            {PLANT.steps.map((s, i) => (
              <Reveal as="li" key={s.title} v="right" delay={80} className="relative">
                <span className="absolute -left-14 top-0 grid h-11 w-11 place-items-center rounded-full bg-gold-light font-display text-lg font-extrabold text-forest ring-4 ring-forest sm:-left-16 sm:h-[52px] sm:w-[52px]">
                  {i + 1}
                </span>
                <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 max-w-lg text-[16px] leading-relaxed text-white/75">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
