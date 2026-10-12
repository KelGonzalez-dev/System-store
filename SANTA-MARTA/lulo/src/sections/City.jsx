import { useEffect, useRef } from 'react';
import { pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import { subscribeScroll } from '../hooks/scrollBus';
import SmartImage from '../components/SmartImage';

export default function City() {
  const { t } = useLang();
  const wrap = useRef(null);
  const img = useRef(null);
  const text = useRef(null);
  const veil = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;
    return subscribeScroll(() => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      if (img.current) img.current.style.transform = `scale(${(1 + p * 0.45).toFixed(3)})`;
      if (veil.current) veil.current.style.opacity = (0.35 + p * 0.45).toFixed(3);
      if (text.current) {
        const enter = Math.min(1, p / 0.25);
        text.current.style.opacity = enter.toFixed(3);
        text.current.style.transform = `translate3d(0, ${((1 - enter) * 60 - p * 40).toFixed(1)}px, 0)`;
      }
    });
  }, []);

  return (
    <section id="ciudad" ref={wrap} className="relative bg-night md:h-[240vh]">
      <div className="relative h-[90svh] w-full overflow-hidden md:sticky md:top-0 md:h-screen">
        <div ref={img} className="absolute inset-0 will-change-transform">
          <SmartImage src={pic('city', 1800)} alt="" className="h-full w-full" />
        </div>
        <div ref={veil} className="absolute inset-0 bg-night" style={{ opacity: 0.55 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/80" />

        <div className="container-x relative flex h-full items-center">
          <div ref={text} className="max-w-3xl will-change-transform">
            <p className="eyebrow">{t.city.eyebrow}</p>
            <h2 className="h-thin mt-5 text-[clamp(2.6rem,7.5vw,6.5rem)]">
              {t.city.title1}
              <span className="neon-soft block font-serif font-light italic text-ember-light">{t.city.title2}</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-neon/80">{t.city.text}</p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {t.city.chips.map((c) => (
                <li key={c} className="rounded-full border border-neon/30 bg-night/50 px-5 py-2 font-display text-[12px] uppercase tracking-[.22em]">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
