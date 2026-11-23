import { useEffect, useMemo, useRef, useState } from 'react';
import { FILTERS, PRODUCTS, cop, waLink } from '../data/content';
import { useTilt } from '../hooks/useTilt';
import { link } from '../router';
import ProductArt from '../components/ProductArt';
import ProductModal from '../components/ProductModal';
import { Icon, WhatsAppIcon } from '../components/Icons';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function Card({ p, n, offset, onOpen }) {
  const ref = useRef(null);
  useTilt(ref, 8);
  return (
    <div className={`card-in ${offset ? 'lg:mt-12' : ''}`} style={{ '--i': n }}>
      <div ref={ref} className="tilt">
        <button type="button" onClick={() => onOpen(p)} className="hairline group relative block aspect-[3/4.3] w-full sm:aspect-[3/4] overflow-hidden rounded-[1.5rem] border bg-noir text-left transition-colors duration-500 hover:border-gold/60">
          <div className="absolute inset-0 transition-opacity duration-700" style={{ background: `radial-gradient(circle at 50% 46%, ${p.glow}30, transparent 66%)` }} />
          <span className="absolute left-4 top-4 hidden font-body text-[10px] tracking-[.3em] text-ivory/35 sm:block">Nº {String(n + 1).padStart(2, '0')}</span>
          {p.tag && <span className="hairline absolute right-4 top-4 rounded-full border bg-ink/60 px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[.22em] text-gold">{p.tag}</span>}
          <div className="tilt-pop absolute inset-x-[16%] bottom-[40%] top-[11%] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-105">
            <ProductArt p={p} className="h-full w-full drop-shadow-[0_18px_22px_rgba(0,0,0,.55)]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-4 pt-12 sm:p-5 sm:pt-14">
            <h3 className="font-display text-2xl font-light leading-none sm:text-3xl">{p.name}</h3>
            <p className="mt-1 font-display text-sm text-gold sm:text-base">{p.family}</p>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="font-body text-sm tabular-nums text-ivory/80">{cop(p.price)}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-ink"><Icon name="arrow" className="h-4 w-4" /></span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function Catalog() {
  const [f, setF] = useState(() => {
    try {
      const v = sessionStorage.getItem('rp:f');
      return v && FILTERS.some(([k]) => k === v) ? v : 'todos';
    } catch (e) {
      return 'todos';
    }
  });
  useEffect(() => {
    try { sessionStorage.removeItem('rp:f'); } catch (e) {}
  }, []);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('feat');
  const [sel, setSel] = useState(null);

  const list = useMemo(() => {
    const term = norm(q.trim());
    let l = PRODUCTS.filter(
      (p) =>
        (f === 'todos' || (f === 'arabe' ? p.arabe : p.gender === f)) &&
        (!term || norm([p.name, p.family, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ')).includes(term))
    );
    if (sort === 'asc') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'desc') l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [f, q, sort]);

  return (
    <main className="min-h-screen bg-ink pb-24 pt-28">
      <div className="container-x">
        <a {...link('#coleccion')} className="inline-flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[.26em] text-ivory/55 transition-colors hover:text-gold">
          <Icon name="arrowLeft" className="h-4 w-4" />Volver
        </a>
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h1 className="h-display mt-5 text-6xl sm:text-8xl">
              Colección <span className="glow-gold">completa</span>
            </h1>
          </div>
          <p className="font-display text-2xl text-ivory/50">{list.length} {list.length === 1 ? 'fragancia' : 'fragancias'}</p>
        </div>

        <div className="hairline sticky top-[58px] z-30 -mx-5 mt-10 flex flex-col gap-3 border-y bg-ink/95 px-5 py-3 sm:-mx-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Filtrar">
            {FILTERS.map(([k, label]) => (
              <button key={k} type="button" onClick={() => setF(k)} aria-pressed={f === k} className={`shrink-0 rounded-full border px-4 py-2 font-body text-[11px] font-medium uppercase tracking-[.2em] transition-colors ${f === k ? 'border-gold bg-gold text-ink' : 'hairline text-ivory/70 hover:border-gold'}`}>{label}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="hairline flex flex-1 items-center gap-2 rounded-full border px-4 md:w-60 md:flex-none">
              <Icon name="search" className="h-4 w-4 text-gold" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aroma o nota" aria-label="Buscar" className="w-full bg-transparent py-2 text-[16px] text-ivory placeholder:text-ivory/30 focus:outline-none md:text-sm" />
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar" className="hairline rounded-full border bg-ink px-4 py-2 text-[16px] text-ivory/80 focus:outline-none md:text-sm [color-scheme:dark]">
              <option value="feat">Destacados</option>
              <option value="asc">Precio: menor</option>
              <option value="desc">Precio: mayor</option>
            </select>
          </div>
        </div>

        {list.length ? (
          <div className="mt-10 grid grid-cols-2 gap-3 pb-12 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p, n) => <Card key={p.id} p={p} n={n} offset={n % 2 === 1} onOpen={setSel} />)}
          </div>
        ) : (
          <p className="py-24 text-center font-display text-3xl text-ivory/50">No encontramos ese aroma… escríbenos y lo conseguimos.</p>
        )}

        <div className="hairline mt-6 flex flex-col items-center gap-5 rounded-[2rem] border bg-noir px-6 py-12 text-center">
          <h2 className="h-display text-4xl sm:text-5xl">¿No ves <span className="gold-text">tu aroma?</span></h2>
          <p className="max-w-md text-ivory/55">Tenemos más referencias de las que caben aquí. Dinos cuál buscas.</p>
          <a href={waLink('Hola Rodriguez Perfumería, busco un perfume que no vi en el catálogo.')} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WhatsAppIcon className="h-4 w-4" />Escribir por WhatsApp</a>
        </div>
      </div>
      {sel && <ProductModal p={sel} onClose={() => setSel(null)} />}
    </main>
  );
}
