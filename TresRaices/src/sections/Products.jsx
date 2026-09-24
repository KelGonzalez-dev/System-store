import { PRODUCTS, waLink, pic } from '../data/content';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon } from '../components/Icons';

export default function Products() {
  return (
    <section id="productos" className="bg-cream pb-20 pt-4 sm:pb-28">
      <div className="container-x">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="h-display text-4xl text-forest sm:text-5xl">Tres raíces, un solo territorio</h2>
          <p className="mt-3 text-lg text-ink/75">Café, cacao y caña que nacen en la Sierra Nevada y llegan hasta ti.</p>
        </Reveal>
      </div>

      {/* Móvil: carrusel deslizable · Escritorio: tres columnas */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 md:container-x md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.id} v="clip" delay={i * 130} className="w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto">
            <article className={`${["s3d-l", "s3d", "s3d-r"][i]} group relative aspect-[4/5] overflow-hidden rounded-3xl border-b-[6px] bg-forest text-white shadow-xl shadow-forest/20 ${p.border}`}>
              <SmartImage src={pic(p.id, 900)} alt={p.title} className="absolute inset-0" imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-full ${p.dot} ${p.id === 'cafe' ? 'text-white' : 'text-ink'}`}>
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-3xl font-bold">{p.title}</h3>
                </div>
                <p className="mt-3 max-w-[18rem] text-[15px] leading-snug text-white/90">{p.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
