import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';

export default function Stats() {
  const { t } = useLang();
  return (
    <section className="bg-night py-16 sm:py-20">
      <div className="container-x grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {t.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 100} className="px-2 text-center lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-neon/10">
            <p className="neon-text font-display text-6xl font-extralight sm:text-7xl">
              <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mt-3 font-display text-[12px] uppercase tracking-[.26em] text-neon/60">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
