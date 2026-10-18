import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductCard, ProductRow } from './Product';
import { CATS, PRODUCTS } from '../data';
import { lockScroll } from '../lib/scroll';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/["'.º]/g, '');
const PAGE = 12;
const SORTS = [['top', 'Más vendidos'], ['low', 'Menor precio'], ['high', 'Mayor precio'], ['save', 'Mayor ahorro por mayor'], ['az', 'Nombre A–Z']];

/**
 * Catálogo: filtros por categoría (con conteo), marca y precio; búsqueda; orden;
 * vista de tarjetas o de LISTA DE PRECIOS (tabla con detal y por mayor). Paginado con "Ver más".
 */
export default function Catalog({ cat, setCat, query, setQuery, onOpen }) {
  const [brands, setBrands] = useState([]);
  const [max, setMax] = useState(0);
  const [sort, setSort] = useState('top');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [sheet, setSheet] = useState(false);
  const top = useRef(null);
  useEffect(() => { setPage(1); }, [cat, query, brands, max, sort]);
  useEffect(() => { if (!sheet) return undefined; lockScroll(true); return () => lockScroll(false); }, [sheet]);
  const base = useMemo(() => PRODUCTS.filter((p) => !query || norm(`${p.n} ${p.brand} ${p.cat}`).includes(norm(query))), [query]);
  const inCat = useMemo(() => base.filter((p) => cat === 'todos' || p.cat === cat), [base, cat]);
  const allBrands = useMemo(() => [...new Set(inCat.map((p) => p.brand))].sort(), [inCat]);
  const maxPrice = Math.max(...inCat.map((p) => p.detal), 1);
  const list = useMemo(() => {
    const l = inCat.filter((p) => (!brands.length || brands.includes(p.brand)) && (!max || p.detal <= max));
    const by = { top: (a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0), low: (a, b) => a.detal - b.detal, high: (a, b) => b.detal - a.detal, save: (a, b) => (b.detal - b.mayor) / b.detal - (a.detal - a.mayor) / a.detal, az: (a, b) => a.n.localeCompare(b.n) }[sort];
    return [...l].sort(by);
  }, [inCat, brands, max, sort]);
  const shown = list.slice(0, page * PAGE);
  const count = (id) => (id === 'todos' ? base.length : base.filter((p) => p.cat === id).length);
  const reset = () => { setCat('todos'); setQuery(''); setBrands([]); setMax(0); };
  const C = CATS.find((c) => c.id === cat);
  const Filters = (
    <div className="filters-in">
      <div className="fg"><b>Categorías</b>
        <button type="button" className={`fcat ${cat === 'todos' ? 'on' : ''}`} onClick={() => setCat('todos')}><span>Todos los productos</span><em>{count('todos')}</em></button>
        {CATS.map((c) => <button key={c.id} type="button" className={`fcat ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}><span>{c.n}</span><em>{count(c.id)}</em></button>)}
      </div>
      {allBrands.length > 1 && (
        <div className="fg"><b>Marca</b>
          {allBrands.map((b) => <label key={b} className="fcheck"><input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]))} />{b}</label>)}
        </div>
      )}
      <div className="fg"><b>Precio máximo (detal)</b>
        <input type="range" min="0" max={maxPrice} step="1000" value={max || maxPrice} onChange={(e) => setMax(+e.target.value >= maxPrice ? 0 : +e.target.value)} aria-label="Precio máximo" />
        <p className="fmax">Hasta {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(max || maxPrice)}</p>
      </div>
      {(cat !== 'todos' || query || brands.length || max) ? <button type="button" className="freset" onClick={reset}>Limpiar filtros</button> : null}
    </div>
  );
  return (
    <section id="catalogo" className="sec cat-sec" ref={top}>
      <div className="wrap">
        <div className="sec-head">
          <div><p className="kicker">Catálogo y lista de precios</p><h2 className="sec-title">{C ? C.n : 'Todos los productos'}</h2></div>
          <div className="howto"><b>¿Cómo funciona el precio por mayor?</b><span>Cada producto tiene una cantidad mínima. Al alcanzarla, el precio baja automáticamente en tu cotización.</span></div>
        </div>
        <div className="cat-layout">
          <aside className="side" aria-label="Filtros">{Filters}</aside>
          <div className="cat-main">
            <div className="toolbar">
              {query && <span className="q-chip">"{query}" <button type="button" onClick={() => setQuery('')} aria-label="Quitar búsqueda">✕</button></span>}
              <span className="results">{list.length} {list.length === 1 ? 'producto' : 'productos'}</span>
              <button type="button" className="filter-btn" onClick={() => setSheet(true)}>Filtros</button>
              <label className="sort"><span>Ordenar:</span><select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
              <div className="views" role="group" aria-label="Vista">
                <button type="button" className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="Tarjetas">▦</button>
                <button type="button" className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-label="Lista de precios">☰</button>
              </div>
            </div>
            {list.length === 0 ? (
              <div className="empty"><p>No encontramos productos con esos filtros.</p><button type="button" className="btn btn-red" onClick={reset}>Ver todo el catálogo</button></div>
            ) : view === 'grid' ? (
              <div key={`${cat}${query}${sort}`} className="grid-products">{shown.map((p, i) => <ProductCard key={p.id} p={p} i={i % PAGE} onOpen={onOpen} />)}</div>
            ) : (
              <div className="table-wrap">
                <table className="price-table">
                  <thead><tr><th /><th>Producto</th><th>Unidad</th><th>Detal</th><th>Por mayor</th><th /></tr></thead>
                  <tbody>{shown.map((p) => <ProductRow key={p.id} p={p} onOpen={onOpen} />)}</tbody>
                </table>
              </div>
            )}
            {shown.length < list.length && <div className="more"><button type="button" className="btn btn-outline" onClick={() => setPage(page + 1)}>Ver más productos ({list.length - shown.length})</button></div>}
            <p className="demo-note">⚠️ Productos y precios de ejemplo para mostrar el funcionamiento. Se reemplazan por los reales en <code>src/data.js</code>.</p>
          </div>
        </div>
      </div>
      <div className={`fsheet ${sheet ? 'on' : ''}`} onClick={() => setSheet(false)} aria-hidden={!sheet}>
        <div className="fsheet-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filtros">
          <div className="fsheet-head"><b>Filtros</b><button type="button" onClick={() => setSheet(false)} aria-label="Cerrar">✕</button></div>
          {Filters}
          <button type="button" className="btn btn-red mt-4 w-full" onClick={() => setSheet(false)}>Ver {list.length} productos</button>
        </div>
      </div>
    </section>
  );
}
