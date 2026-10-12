import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductCard } from './Product';
import { CATS, FAMILIES, FOR, PRODUCTS } from '../data';
import { useWish } from '../wish';
import { lockScroll, useInView } from '../lib/scroll';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const MAXP = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 10000) * 10000;
const SORTS = [['fav', 'Destacados'], ['low', 'Menor precio'], ['high', 'Mayor precio'], ['az', 'Nombre (A–Z)']];

/**
 * Catálogo completo: barra lateral de filtros (categoría, para quién, familia olfativa, precio máximo, solo favoritos),
 * buscador y orden. En celular los filtros abren en un panel desde abajo.
 */
export default function Catalog({ onOpen, cat, setCat }) {
  const [who, setWho] = useState('all');
  const [fam, setFam] = useState('');
  const [max, setMax] = useState(MAXP);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('fav');
  const [onlyWish, setOnlyWish] = useState(false);
  const [sheet, setSheet] = useState(false);
  const wish = useWish();
  const ref = useRef(null);
  const seen = useInView(ref);
  useEffect(() => { if (!sheet) return undefined; lockScroll(true); return () => lockScroll(false); }, [sheet]);
  const base = useMemo(() => PRODUCTS.filter((p) =>
    (who === 'all' || p.for === who || p.for === 'all') &&
    (!fam || p.family === fam) && p.price <= max &&
    (!onlyWish || wish.includes(p.id)) &&
    (!q || norm(`${p.name} ${p.line} ${p.desc} ${p.notes || ''} ${p.size}`).includes(norm(q)))), [who, fam, max, q, onlyWish, wish]);
  const count = (c) => (c === 'todos' ? base.length : base.filter((p) => p.cat === c).length);
  const list = useMemo(() => {
    const l = base.filter((p) => cat === 'todos' || p.cat === cat);
    const by = { fav: (a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0), low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, az: (a, b) => a.name.localeCompare(b.name) }[sort];
    return [...l].sort(by);
  }, [base, cat, sort]);
  const reset = () => { setWho('all'); setFam(''); setMax(MAXP); setQ(''); setOnlyWish(false); setCat('todos'); };
  const active = (who !== 'all') + !!fam + (max < MAXP) + onlyWish + (cat !== 'todos');
  const Filters = (
    <div className="side-in">
      <div className="fgroup">
        <b>Categorías</b>
        {CATS.map((c) => (
          <button key={c.id} type="button" className={`fcat ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
            <span>{c.icon} {c.n}</span><em>{count(c.id)}</em>
          </button>
        ))}
      </div>
      <div className="fgroup">
        <b>Para quién</b>
        <div className="seg">{FOR.map((f) => <button key={f.id} type="button" className={who === f.id ? 'on' : ''} onClick={() => setWho(f.id)}>{f.n.replace('Para ', '')}</button>)}</div>
      </div>
      <div className="fgroup">
        <b>Familia olfativa</b>
        <div className="chips">
          <button type="button" className={!fam ? 'on' : ''} onClick={() => setFam('')}>Todas</button>
          {Object.entries(FAMILIES).map(([k, v]) => <button key={k} type="button" className={fam === k ? 'on' : ''} onClick={() => setFam(fam === k ? '' : k)}>{v}</button>)}
        </div>
      </div>
      <div className="fgroup">
        <b>Precio máximo <em className="fmax">${(max / 1000).toFixed(0)} mil</em></b>
        <input type="range" min="20000" max={MAXP} step="10000" value={max} onChange={(e) => setMax(+e.target.value)} style={{ '--p': `${((max - 20000) / (MAXP - 20000)) * 100}%` }} aria-label="Precio máximo" />
      </div>
      <label className="fwish"><input type="checkbox" checked={onlyWish} onChange={(e) => setOnlyWish(e.target.checked)} /> Solo mis favoritos ♥ ({wish.length})</label>
      {active > 0 && <button type="button" className="freset" onClick={reset}>Limpiar filtros</button>}
    </div>
  );
  return (
    <section id="catalogo" className="cat-sec">
      <div className="wrap py-[clamp(80px,10vw,120px)]">
        <div className="cat-head">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h2 className="rv mask-up sec-title"><span>Todo para <em>consentirte</em></span></h2>
          </div>
          <p className="rv max-w-[44ch] text-[16px] text-bosque/70">Filtra, compara y agrega a tu bolsa. Al final me envías el pedido por WhatsApp y te lo llevo.</p>
        </div>
        <div className="cat-layout">
          <aside className="side" aria-label="Filtros">{Filters}</aside>
          <div>
            <div className="toolbar">
              <label className="search">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar: Kaiak, crema de manos, jabón…" aria-label="Buscar productos" />
              </label>
              <button type="button" className="filter-btn" onClick={() => setSheet(true)}>Filtros{active > 0 && <em>{active}</em>}</button>
              <label className="sort"><span>Ordenar</span><select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            </div>
            <p className="results">{list.length} {list.length === 1 ? 'producto' : 'productos'}{cat !== 'todos' && ` en ${CATS.find((c) => c.id === cat).n}`}</p>
            <div ref={ref} key={`${cat}${who}${fam}${max}${q}${sort}${onlyWish}`} className={`grid-products ${seen ? 'in' : ''}`}>
              {list.map((p, i) => <ProductCard key={p.id} p={p} i={i} onOpen={onOpen} />)}
              {!list.length && <div className="empty"><p>No encontré productos con esos filtros.</p><button type="button" className="btn btn-line" onClick={reset}>Limpiar filtros</button></div>}
            </div>
          </div>
        </div>
      </div>
      <div className={`fsheet ${sheet ? 'on' : ''}`} onClick={() => setSheet(false)} aria-hidden={!sheet}>
        <div className="fsheet-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filtros">
          <div className="fsheet-head"><b>Filtros</b><button type="button" onClick={() => setSheet(false)} aria-label="Cerrar">✕</button></div>
          {Filters}
          <button type="button" className="btn btn-terra mt-4 w-full" onClick={() => setSheet(false)}>Ver {list.length} productos</button>
        </div>
      </div>
    </section>
  );
}
