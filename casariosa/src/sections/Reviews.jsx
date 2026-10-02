import { CONTACT } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import { Icon } from '../components/Icons';

export default function Reviews() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine/10 blur-[130px]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{t.reviews.eyebrow}</p>
          <h2 className="h-display mt-5 text-4xl text-ink sm:text-6xl">{t.reviews.title}</h2>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-9">
            <Icon name="instagram" className="h-4 w-4" />{t.reviews.cta}
          </a>
        </Reveal>

        <Reveal v="zoom" delay={150}>
          <div className="mx-auto max-w-sm rounded-3xl border border-ink/10 bg-cream p-10 text-center shadow-sm">
            <p className="font-display text-7xl font-bold text-wine"><CountUp value={63.1} decimals={1} suffix="K" /></p>
            <p className="mt-4 font-display text-[12px] font-bold uppercase tracking-[.24em] text-ink/55">{t.reviews.followers}</p>
            <p className="mt-2 font-display text-lg text-gold-dark">{CONTACT.instagramHandle}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
