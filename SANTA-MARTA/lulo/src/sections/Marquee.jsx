import { useLang } from '../i18n/LangContext';

export default function Marquee() {
  const { t } = useLang();
  return (
    <div className="overflow-hidden border-y border-neon/10 bg-coal py-5" aria-hidden="true">
      <div className="animate-marquee flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
            {t.marquee.map((w) => (
              <span key={w} className="flex items-center gap-10 font-display text-3xl font-extralight uppercase tracking-[.18em] text-neon/70 sm:text-4xl">
                {w}
                <span className="h-2 w-2 rounded-full bg-ember-light" style={{ boxShadow: '0 0 12px #ff7a2f' }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
