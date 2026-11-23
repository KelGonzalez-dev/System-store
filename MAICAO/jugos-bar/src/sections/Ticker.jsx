import { TICKER } from '../data/content';

export default function Ticker() {
  return (
    <div className="overflow-hidden bg-brand py-4 text-ink lt:bg-ink lt:text-white" aria-hidden="true">
      <div className="animate-marquee flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-7 pr-7">
            {TICKER.map((w) => (
              <span key={w} className="flex items-center gap-7 font-display text-3xl font-extrabold uppercase tracking-[-.01em] sm:text-4xl">
                {w}
                <span className="h-3 w-3 rounded-full bg-ink lt:bg-brand" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
