import { pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';

const TILES = [
  { key: 'sala', cls: 'col-span-2 row-span-2', anim: 's3d-l', ar: 'aspect-square lg:aspect-auto' },
  { key: 'cocina', anim: 's3d', ar: 'aspect-[3/4] lg:aspect-auto' },
  { key: 'detalle', anim: 's3d', ar: 'aspect-[3/4] lg:aspect-auto' },
  { key: 'mesa', anim: 's3d', ar: 'aspect-[3/4] lg:aspect-auto' },
  { key: 'noche', cls: 'col-span-2 lg:col-span-1', anim: 's3d-r', ar: 'aspect-[16/9] lg:aspect-auto' },
];

export default function Gallery() {
  const { t } = useLang();
  return (
    <section id="galeria" className="overflow-hidden bg-paper py-20 sm:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <h2 className="h-display mt-5 text-5xl text-ink sm:text-7xl">
            {t.gallery.title1}
            <span className="script wine-text block text-[1.1em] font-normal">{t.gallery.title2}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:h-[46rem] lg:grid-cols-4 lg:grid-rows-2">
          {TILES.map((tile, i) => (
            <Reveal key={tile.key} v="zoom" delay={i * 90} className={tile.cls || ''}>
              <figure className={`${tile.anim} group relative h-full w-full overflow-hidden rounded-[1.5rem] border border-ink/10 ${tile.ar}`}>
                <SmartImage src={pic(tile.key, 900)} alt={t.gallery.captions[i]} className="absolute inset-0" imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-5 font-display text-sm font-bold uppercase tracking-[.22em] text-cream">{t.gallery.captions[i]}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
