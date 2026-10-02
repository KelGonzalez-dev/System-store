import { CONTACT } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import { Icon } from '../components/Icons';

export default function Reviews() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-coal py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/20 blur-[130px]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{t.reviews.eyebrow}</p>
          <h2 className="h-thin mt-5 text-4xl sm:text-6xl">{t.reviews.title}</h2>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-neon mt-9">
            <Icon name="instagram" className="h-4 w-4" />{t.reviews.cta}
          </a>
        </Reveal>

        <Reveal v="zoom" delay={150}>
          <div className="mx-auto grid max-w-md gap-4 sm:grid-cols-2 lg:max-w-none">
            <div className="rounded-3xl border border-neon/10 bg-night p-8 text-center">
              <p className="neon-text font-display text-7xl font-extralight"><CountUp value={4.6} decimals={1} /></p>
              <div className="mt-3 flex justify-center gap-1 text-ember-light">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Icon key={s} name="star" className="h-5 w-5" />
                ))}
              </div>
              <p className="mt-3 font-display text-[12px] uppercase tracking-[.24em] text-neon/60">{t.reviews.rating}</p>
            </div>
            <div className="rounded-3xl border border-neon/10 bg-night p-8 text-center">
              <p className="neon-text font-display text-7xl font-extralight"><CountUp value={13.7} decimals={1} suffix="K" /></p>
              <p className="mt-6 font-display text-[12px] uppercase tracking-[.24em] text-neon/60">{t.reviews.followers}</p>
              <p className="mt-2 text-sm text-ember-light">{CONTACT.instagramHandle}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
