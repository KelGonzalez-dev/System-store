import { useRef } from 'react';
import { SLOGANS, waLink, pic } from '../data/content';
import { useParallax } from '../hooks/useParallax';
import SmartImage from '../components/SmartImage';
import { Icon, WhatsAppIcon } from '../components/Icons';

const TRIAD = [
  { word: 'Café', color: '#c90e1e' },
  { word: 'Cacao', color: '#df8b10' },
  { word: 'Caña', color: '#75a32a' },
];

const Item = ({ d, className = '', children }) => (
  <div className={`hero-item ${className}`} style={{ '--d': `${d}ms` }}>
    {children}
  </div>
);

export default function Hero() {
  const bg = useRef(null);
  useParallax(bg, 0.2, 1.22);

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-forest text-white">
      {/* Fondo: montaña con parallax (solo escritorio) */}
      <div className="absolute inset-0 -z-10">
        <div ref={bg} className="absolute inset-0">
          <SmartImage src={pic('hero', 1800)} alt="Montañas de la Sierra Nevada" eager className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/55 to-forest/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-forest/35" />
      </div>

      <div className="container-x grid min-h-[100svh] items-center gap-8 pb-28 pt-32 md:grid-cols-12 md:pb-32">
        <div className="md:col-span-7">
          <Item d={150}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-gold-light">
              <Icon name="mountain" className="h-4 w-4" /> Del territorio, para el mundo
            </p>
          </Item>
          <Item d={300}>
            <h1 className="h-display text-[3.6rem] sm:text-7xl lg:text-[6.5rem]">Tres Raíces</h1>
          </Item>
          <Item d={450}>
            <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-2xl font-semibold sm:text-3xl">
              {TRIAD.map((t) => (
                <li key={t.word} className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full ring-2 ring-white/70" style={{ background: t.color }} />
                  {t.word}
                </li>
              ))}
            </ul>
          </Item>
          <Item d={600}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
              Somos una cooperativa agroecológica que nace de la fuerza de nuestra gente, la riqueza de nuestra tierra y el compromiso de un futuro sostenible.
            </p>
          </Item>
          <Item d={750} className="mt-8 flex flex-wrap gap-3">
            <a href="#quienes-somos" className="btn bg-leaf text-white shadow-lg shadow-black/30 hover:bg-fern">
              Conoce más <Icon name="arrow" className="h-5 w-5" />
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn border border-white/40 text-white hover:bg-white hover:text-forest">
              <WhatsAppIcon className="h-5 w-5" /> Escríbenos
            </a>
          </Item>
          <Item d={900}>
            <p className="mt-8 max-w-[16rem] border-l-4 border-gold-light pl-4 font-script text-3xl leading-tight text-gold-light md:hidden">{SLOGANS.hero}</p>
          </Item>
        </div>

        <div className="relative hidden md:col-span-5 md:block">
          <div className="hero-emblem mx-auto w-56 sm:w-72 md:w-full md:max-w-[26rem]">
            <div className="emblem-scroll">
            <div className="animate-floaty relative">
              <div className="absolute -inset-4 rounded-full bg-gold-light/20 blur-2xl" />
              <div className="relative rounded-full bg-cream p-6 shadow-2xl shadow-black/40 ring-8 ring-white/10 sm:p-8">
                <img src="/logo.webp" alt="Logo Tres Raíces: montaña, café y cacao" className="w-full" draggable="false" fetchpriority="high" />
              </div>
            </div>
            </div>
          </div>
          <Item d={1100}>
            <p className="mx-auto mt-6 max-w-xs text-center font-script text-3xl leading-tight text-gold-light md:text-right">{SLOGANS.hero}</p>
          </Item>
        </div>
      </div>

      {/* Cinta con movimiento continuo */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/15 bg-forest/90 py-3.5" aria-hidden="true">
        <div className="animate-marquee flex w-max will-change-transform">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-8 pr-8 font-display text-lg font-semibold text-white/90">
              {['Café', 'Cacao', 'Caña', 'Panela', 'Sierra Nevada', 'Agroecología', 'Comercio justo', 'Trazabilidad'].map((w, i) => (
                <span key={w} className="flex items-center gap-8">
                  {w}
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: ['#c90e1e', '#df8b10', '#75a32a'][i % 3] }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
