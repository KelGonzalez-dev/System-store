import { MARQUEE } from '../data/content';

export default function Marquee() {
  return (
    <div className="hairline overflow-hidden border-y bg-noir py-4" aria-hidden="true">
      <div className="animate-marquee flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-8 pr-8">
            {MARQUEE.map((w, i) => (
              <span key={w} className="flex items-center gap-8 font-display text-4xl uppercase tracking-[.06em] sm:text-5xl">
                <span className={i % 2 ? 'outline-text' : 'text-ivory/85'}>{w}</span>
                <span className="h-2 w-2 rotate-45 bg-gold" style={{ boxShadow: '0 0 10px #d4af6a' }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
