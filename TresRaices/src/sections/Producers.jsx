import { PRODUCERS, waLink, pic } from '../data/content';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

const MOSAIC = [
  { key: 'cafe', alt: 'Café', cls: 'aspect-[3/4]', d: 0 },
  { key: 'cacao', alt: 'Cacao', cls: 'aspect-square', d: 120 },
  { key: 'cana', alt: 'Caña', cls: 'aspect-square', d: 240 },
  { key: 'fields', alt: 'Cultivos de la Sierra', cls: 'aspect-[3/4]', d: 360 },
];

export default function Producers() {
  return (
    <section id="productores" className="overflow-hidden bg-cream py-20 sm:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <h2 className="h-display text-4xl text-forest sm:text-5xl">{PRODUCERS.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{PRODUCERS.text}</p>
          </Reveal>
          <div className="mt-8 space-y-4">
            {PRODUCERS.items.map((it, i) => (
              <Reveal key={it.title} v="left" delay={i * 110}>
                <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/10 transition-transform duration-300 hover:-translate-y-1">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-white">
                    <Icon name={it.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">{it.title}</h3>
                    <p className="text-[15px] text-ink/75">{it.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <a
              href={waLink('Hola Tres Raíces, soy productor y quiero ser parte de la cooperativa.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-8 bg-leaf text-white shadow-lg shadow-leaf/30 hover:bg-forest"
            >
              Quiero ser parte <Icon name="arrow" className="h-5 w-5" />
            </a>
          </Reveal>
        </div>

        {/* Mosaico escalonado */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-6">
          <div className="space-y-4">
            {[MOSAIC[0], MOSAIC[1]].map((m) => (
              <Reveal key={m.key} v="zoom" delay={m.d}>
                <div className={`s3d group overflow-hidden rounded-3xl shadow-lg shadow-forest/20 ${m.cls}`}>
                  <SmartImage src={pic(m.key, 700)} alt={m.alt} className="h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 space-y-4">
            {[MOSAIC[2], MOSAIC[3]].map((m) => (
              <Reveal key={m.key} v="zoom" delay={m.d}>
                <div className={`s3d group overflow-hidden rounded-3xl shadow-lg shadow-forest/20 ${m.cls}`}>
                  <SmartImage src={pic(m.key, 700)} alt={m.alt} className="h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
