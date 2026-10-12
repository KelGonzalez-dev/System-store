import { CONTACT, pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

export default function Location() {
  const { t } = useLang();
  return (
    <section id="ubicacion" className="bg-night py-20 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal v="left" className="lg:col-span-6">
          <div className="s3d-l relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-cream/10 sm:aspect-[5/4]">
            <SmartImage src={pic('city', 1100)} alt="Bucaramanga" className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
          </div>
        </Reveal>

        <Reveal v="right" delay={120} className="lg:col-span-6">
          <p className="eyebrow">{t.location.eyebrow}</p>
          <h2 className="h-display mt-5 text-5xl text-cream sm:text-7xl">
            {t.location.title1}
            <span className="script gold-shimmer block text-[1.1em] font-normal">{t.location.title2}</span>
          </h2>
          <ul className="mt-9 space-y-5 text-[16px] text-cream/85">
            <li className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/20 text-gold"><Icon name="pin" /></span>{CONTACT.address}</li>
            <li className="flex items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/20 text-gold"><Icon name="clock" /></span>{t.location.hours}</li>
            <li className="flex items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/20 text-gold"><Icon name="phone" /></span>{CONTACT.phoneDisplay}</li>
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="btn btn-wine">{t.location.how}<Icon name="arrow" className="h-4 w-4" /></a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{t.location.call}</a>
          </div>
          <p className="mt-6 text-sm text-cream/45">{t.location.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
