import { CATS, FEATURED, cop } from '../data/content';
import { link } from '../router';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { Icon } from '../components/Icons';

const catName = (id) => CATS.find((c) => c.id === id)?.name;

export default function Favoritos() {
  return (
    <section id="favoritos" className="lt-green relative overflow-hidden bg-s1 py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(98,191,0,.18), transparent 65%)' }} />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Favoritos</p>
            <h2 className="h-display mt-5 text-5xl sm:text-7xl lg:text-8xl">Lo que más<br /><span className="text-acc">se pide</span></h2>
          </Reveal>
          <Reveal delay={150}>
            <a {...link('#/menu')} className="btn btn-line">Ver menú completo<Icon name="arrow" className="h-4 w-4" /></a>
          </Reveal>
        </div>

        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {FEATURED.map((f, i) => (
            <Reveal key={f.id} delay={i * 70} v="up" className="w-[68vw] shrink-0 snap-center sm:w-auto">
              <a {...link('#/menu')} className="fav group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-card">
                <Photo k={f.feat} w={640} alt={f.name} className="fav-img absolute inset-0 h-full w-full" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,9,6,.92) 6%, rgba(7,9,6,.2) 55%, transparent)' }} />
                <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] text-white backdrop-blur">{catName(f.cat)}</span>
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-brand text-ink lt:bg-white lt:text-brand-deep transition-transform duration-500 group-hover:rotate-45"><Icon name="arrow" className="h-4 w-4" /></span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl font-extrabold uppercase leading-none">{f.name}</h3>
                  <p className="mt-2 flex items-center justify-between text-sm text-white/65"><span>Desde <span className="font-bold text-brand lt:text-brand-light">{cop(f.price)}</span></span><span className="font-bold text-white">Pedir</span></p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
