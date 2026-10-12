import { pic } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';

const TILES = [
  { key: 'patio', cls: 'col-span-2 row-span-2 aspect-square lg:aspect-auto', anim: 's3d-l' },
  { key: 'barra', cls: 'aspect-[3/4] lg:aspect-auto', anim: 's3d' },
  { key: 'arepas', cls: 'aspect-[3/4] lg:aspect-auto', anim: 's3d' },
  { key: 'detalle', cls: 'aspect-[3/4] lg:aspect-auto', anim: 's3d' },
  { key: 'noche', cls: 'col-span-2 aspect-[16/9] lg:aspect-auto lg:col-span-1', anim: 's3d-r' },
];

export default function Gallery() {
  const { t } = useLang();
  return (
    <section id="galeria" className="overflow-hidden bg-coal py-20 sm:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <h2 className="h-thin mt-5 text-5xl sm:text-7xl">
            {t.gallery.title1}
            <span className="neon-soft block font-serif font-light italic text-ember-light">{t.gallery.title2}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:h-[46rem] lg:grid-cols-4 lg:grid-rows-2">
          {TILES.map((tile, i) => (
            <Reveal key={tile.key} v="zoom" delay={i * 90} className={tile.cls.includes('col-span-2') && tile.cls.includes('row-span-2') ? 'col-span-2 row-span-2' : tile.cls.includes('col-span-2') ? 'col-span-2 lg:col-span-1' : ''}>
              <figure className={`${tile.anim} group relative h-full w-full overflow-hidden rounded-[1.5rem] border border-neon/10 ${tile.key === 'patio' ? 'aspect-square lg:aspect-auto' : tile.key === 'noche' ? 'aspect-[16/9] lg:aspect-auto' : 'aspect-[3/4] lg:aspect-auto'}`}>
                <SmartImage src={pic(tile.key, 900)} alt={t.gallery.captions[i]} className="absolute inset-0" imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-5 font-display text-sm font-light uppercase tracking-[.28em]">{t.gallery.captions[i]}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
