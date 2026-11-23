import { CATS, PRODUCTS } from '../data/content';
import { go } from '../router';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { Icon } from '../components/Icons';

const LAYOUT = [
  'col-span-2 h-72 lg:col-span-5 lg:row-span-2 lg:h-auto',
  'h-52 lg:col-span-4 lg:h-auto',
  'h-52 lg:col-span-3 lg:h-auto',
  'h-52 lg:col-span-3 lg:h-auto',
  'h-52 lg:col-span-4 lg:h-auto',
];

const count = (f) => PRODUCTS.filter((p) => (f === 'todos' ? true : f === 'arabe' ? p.arabe : p.gender === f)).length;

const open = (f) => {
  try { sessionStorage.setItem('rp:f', f); } catch (e) {}
  go('#/catalogo');
};

export default function Categories() {
  return (
    <section id="categorias" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Categorías</p>
            <h2 className="h-display mt-5 text-6xl sm:text-8xl">Elige tu <span className="glow-gold">mundo</span></h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-sm text-ivory/60">Cinco formas de entrar a la perfumería. Toca una y mira todas las fragancias.</p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:[grid-auto-rows:minmax(15rem,1fr)]">
          {CATS.map((c, i) => (
            <Reveal key={c.f} v="zoom" delay={i * 80} className={LAYOUT[i]}>
              <button type="button" onClick={() => open(c.f)} className="tile hairline group relative block h-full w-full overflow-hidden rounded-[1.75rem] border bg-noir text-left transition-colors duration-500 hover:border-gold/70">
                <Photo k={c.k} w={c.f === 'hombre' ? 1000 : 700} pos={c.pos} alt={c.t} className="tile-img absolute inset-0 h-full w-full" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,4,3,.92) 8%, rgba(5,4,3,.35) 55%, rgba(5,4,3,.15))' }} />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: 'radial-gradient(70% 60% at 50% 100%, rgba(212,175,106,.28), transparent 70%)' }} />
                <span className="absolute left-5 top-5 hidden rounded-full border border-ivory/20 bg-ink/60 px-3 py-1 font-cond text-[12px] font-semibold uppercase tracking-[.22em] text-ivory/80 sm:block">{count(c.f)} fragancias</span>
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-ink/60 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink"><Icon name="arrow" className="h-4 w-4" /></span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="h-display text-4xl text-ivory sm:text-5xl lg:text-6xl">{c.t}</h3>
                  <p className="mt-1 font-body text-sm font-medium text-ivory/70">{c.s}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
