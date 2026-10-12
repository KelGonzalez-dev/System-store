import { useLang } from '../i18n/LangContext';

export default function Marquee() {
  const { t } = useLang();
  return (
    <div className="overflow-hidden border-y border-cream/10 bg-coal py-5" aria-hidden="true">
      <div className="animate-marquee flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
            {t.marquee.map((w) => (
              <span key={w} className="flex items-center gap-10 font-display text-3xl font-bold uppercase tracking-[.1em] text-cream/75 sm:text-4xl">
                {w}
                <span className="h-2 w-2 rounded-full bg-gold" style={{ boxShadow: '0 0 12px #c6a15b' }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
