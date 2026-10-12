import { CONTACT, pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

const IMGS = ['centro', 'paz'];

export default function Locations() {
  const { t } = useLang();
  const maps = [CONTACT.mapsCentro, CONTACT.mapsPaz];
  return (
    <section id="casas" className="bg-night py-20 sm:py-32">
      <div className="container-x">
        <Reveal className="text-center">
          <p className="eyebrow">{t.locations.eyebrow}</p>
          <h2 className="h-thin mt-5 text-5xl sm:text-7xl">
            {t.locations.title1}, <span className="neon-soft font-serif font-light italic text-ember-light">{t.locations.title2}</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {t.locations.cards.map((c, i) => (
            <Reveal key={c.name} v={i === 0 ? 'left' : 'right'} delay={i * 100}>
              <article className={`${i === 0 ? 's3d-l' : 's3d-r'} group overflow-hidden rounded-[2rem] border border-neon/10 bg-coal`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage src={pic(IMGS[i], 1000)} alt="" className="absolute inset-0" imgClassName="opacity-80 transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/30 to-transparent" />
                  <span className="absolute left-6 top-6 rounded-full border border-neon/30 bg-night/60 px-4 py-1.5 font-display text-[11px] uppercase tracking-[.28em]">0{i + 1}</span>
                </div>
                <div className="p-7 sm:p-9">
                  <h3 className="font-display text-4xl font-extralight sm:text-5xl">{c.name}</h3>
                  <p className="mt-3 text-neon/65">{c.note}</p>
                  <ul className="mt-6 space-y-3 text-[15px] text-neon/80">
                    <li className="flex items-start gap-3"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-ember-light" />{c.address}</li>
                    <li className="flex items-center gap-3"><Icon name="clock" className="h-5 w-5 shrink-0 text-ember-light" />{t.locations.openUntil}</li>
                    <li className="flex items-center gap-3"><Icon name="phone" className="h-5 w-5 shrink-0 text-ember-light" />{CONTACT.phoneDisplay}</li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={maps[i]} target="_blank" rel="noopener noreferrer" className="btn btn-solid py-3">{t.locations.how}<Icon name="arrow" className="h-4 w-4" /></a>
                    <a href={`tel:${CONTACT.phoneTel}`} className="btn btn-neon py-3">{t.locations.call}</a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-neon/45">{t.locations.hoursNote}</p>
      </div>
    </section>
  );
}
