import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle, Plus, Search, ShoppingBag, X, ZoomIn } from 'lucide-react';
import Seo from '../components/Seo';
import Img from '../components/Img';
import Stars from '../components/Stars';
import Reviews from '../components/Reviews';
import Benefits from '../components/Benefits';
import { getProducto, getProductos, getResumenResenas } from '../api';
import { thumb, toMediaUrl } from '../config';
import { WA_NUMBER, fmt } from '../data';
import { useSnapTrack } from '../hooks/useSnapTrack';
import { adaptProduct } from '../lib/product';

export { adaptProduct };

const PAGE = 21;
const ORDERS = [['recientes', 'lo más nuevo'], ['precio_asc', 'menor precio'], ['precio_desc', 'mayor precio']];
const RANGES = [['', 'cualquier precio', null, null], ['a', 'hasta $150.000', null, 150000], ['b', '$150.000 a $250.000', 150000, 250000], ['c', 'más de $250.000', 250000, null]];

// ── Caché en memoria: volver al catálogo o repetir una búsqueda es instantáneo ──
const cache = new Map();
let legacyAll = null; // por si la API del servidor aún es la versión anterior (sin búsqueda en servidor)

async function fetchPage(page, f, signal) {
  const key = JSON.stringify([page, f]);
  if (cache.has(key)) return cache.get(key);
  const data = await getProductos(page, PAGE, true, { ...f, signal });
  let out;
  const filtra = f.q || f.min || f.max || (f.orden && f.orden !== 'recientes');
  if (data.porPagina === undefined && filtra) {
    if (!legacyAll) {
      const first = await getProductos(1, 100, true, { signal });
      let all = first.items;
      for (let p = 2; p <= first.totalPaginas; p++) all = all.concat((await getProductos(p, 100, true, { signal })).items);
      legacyAll = all;
    }
    const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let list = legacyAll.filter((p) => (!f.q || norm(`${p.nombre} ${p.descripcion} ${p.codigo || ''}`).includes(norm(f.q)))
      && (f.min == null || p.precio >= f.min) && (f.max == null || p.precio <= f.max));
    if (f.orden === 'precio_asc') list = [...list].sort((a, b) => a.precio - b.precio);
    if (f.orden === 'precio_desc') list = [...list].sort((a, b) => b.precio - a.precio);
    out = { items: list.slice((page - 1) * PAGE, page * PAGE), total: list.length, totalPaginas: Math.max(1, Math.ceil(list.length / PAGE)) };
  } else {
    out = { items: data.items, total: data.total, totalPaginas: data.totalPaginas };
  }
  out = { ...out, items: out.items.map(adaptProduct) };
  cache.set(key, out);
  return out;
}

function useDebounced(v, ms) {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

/** Palabra desplegable dentro de la frase de filtros: "Mostrar mochilas de [cualquier precio]…" */
function Pick({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const off = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', off);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc); };
  }, [open]);
  const cur = options.find((o) => o[0] === value) || options[0];
  return (
    <span ref={ref} className={`pick${open ? ' open' : ''}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={label}>
        {cur[1]}<ChevronDown size={16} />
      </button>
      {open && (
        <span className="pick__menu" role="listbox">
          {options.map((o) => (
            <button key={o[0] || 'x'} type="button" role="option" aria-selected={o[0] === value} className={o[0] === value ? 'on' : ''} onClick={() => { onChange(o[0]); setOpen(false); }}>{o[1]}</button>
          ))}
        </span>
      )}
    </span>
  );
}

/** Tarjeta "arco": la foto vive en un arco, con etiqueta colgante de precio y segunda foto al pasar el mouse. */
const Card = memo(function Card({ item, i, rating, onOpen, onAdd }) {
  const [added, setAdded] = useState(false);
  const second = item.photos[1];
  const prefetch = () => { if (item.photos[0]) { const im = new Image(); im.src = thumb(item.photos[0], 960); } };
  return (
    <article className={`vcard${second ? ' has2' : ''}`} style={{ '--i': i % 10 }} onMouseEnter={prefetch}>
      <div className="vcard__top">
        <button type="button" className="vcard__frame" onClick={() => onOpen(item)} onFocus={prefetch} aria-label={`Ver ${item.name}`}>
          <Img src={item.photos[0]} alt={item.name} w={480} widths={[320, 480, 640]} sizes="(max-width: 700px) 48vw, (max-width: 1100px) 31vw, 22vw" eager={i < 4} className="vcard__a" />
          {second && <Img src={second} alt="" w={480} widths={[320, 480, 640]} sizes="(max-width: 700px) 48vw, 22vw" className="vcard__b" />}
          <span className="vcard__see">Ver detalle</span>
        </button>
        <span className="vcard__tag" aria-hidden="true"><i />{fmt(item.price)}</span>
        <button
          type="button"
          className={`vcard__add${added ? ' ok' : ''}`}
          onClick={() => { onAdd(item); setAdded(true); setTimeout(() => setAdded(false), 1400); }}
          aria-label={`Agregar ${item.name} al carrito`}
        >
          {added ? '✓' : <Plus size={18} />}
        </button>
      </div>
      <div className="vcard__info">
        <h3>{item.name}</h3>
        {rating?.total > 0 && <span className="vcard__rate"><Stars value={rating.promedio} size={12} /><small>({rating.total})</small></span>}
        <p>{item.desc}</p>
      </div>
    </article>
  );
});

/** Zoom a pantalla completa: la foto se ve completa; al tocarla se acerca y sigue el puntero. */
function Zoom({ photos, start, name, onClose }) {
  const [idx, setIdx] = useState(start);
  const [z, setZ] = useState(null);
  const { ref, goTo, onScroll } = useSnapTrack(idx, setIdx, photos.length);
  useEffect(() => { goTo(start, false); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'ArrowRight') { setZ(null); goTo(idx + 1); }
      if (e.key === 'ArrowLeft') { setZ(null); goTo(idx - 1); }
    };
    window.addEventListener('keydown', k, true);
    return () => window.removeEventListener('keydown', k, true);
  }, [idx, goTo, onClose]);
  const at = (e) => { const r = e.currentTarget.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }; };
  return (
    <div className="zoom" role="dialog" aria-modal="true" aria-label={`Fotos de ${name}`}>
      <div ref={ref} className="zoom__track" onScroll={onScroll} style={z ? { overflow: 'hidden' } : undefined}>
        {photos.map((ph, k) => (
          <div
            key={ph}
            className={`zoom__slide${z && k === idx ? ' on' : ''}`}
            style={z && k === idx ? { '--zx': `${z.x}%`, '--zy': `${z.y}%` } : undefined}
            onClick={(e) => setZ((v) => (v ? null : at(e)))}
            onPointerMove={(e) => { if (z && e.pointerType === 'mouse') setZ(at(e)); }}
          >
            {Math.abs(k - idx) <= 1 && <Img src={ph} alt={k === 0 ? name : ''} w={1280} widths={[960, 1280]} sizes="100vw" eager={k === idx} className="contain" />}
          </div>
        ))}
      </div>
      <p className="zoom__hint">{z ? 'Toca para alejar' : 'Toca la foto para acercar'} · {idx + 1} / {photos.length}</p>
      <button type="button" className="zoom__btn close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
      {photos.length > 1 && (
        <>
          <button type="button" className="zoom__btn l" onClick={() => { setZ(null); goTo(idx - 1); }} aria-label="Foto anterior"><ChevronLeft size={24} /></button>
          <button type="button" className="zoom__btn r" onClick={() => { setZ(null); goTo(idx + 1); }} aria-label="Foto siguiente"><ChevronRight size={24} /></button>
        </>
      )}
    </div>
  );
}

/** Ficha: panel lateral en computador, hoja inferior en celular. La foto se ve completa. */
function Sheet({ product, onClose, onAdd }) {
  const [idx, setIdx] = useState(0);
  const [zoomAt, setZoomAt] = useState(null);
  const [added, setAdded] = useState(false);
  const photos = product.photos.length ? product.photos : [null];
  const { ref, goTo, onScroll } = useSnapTrack(idx, setIdx, photos.length);

  useEffect(() => {
    const onKey = (e) => {
      if (zoomAt !== null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(idx + 1);
      if (e.key === 'ArrowLeft') goTo(idx - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [idx, goTo, onClose, zoomAt]);
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);

  const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`¡Hola! Me interesa la *${product.name}*${product.codigo ? ` (código ${product.codigo})` : ''} — ${fmt(product.price)}. ¿Está disponible?`)}`;

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={product.name}>
      <button type="button" className="sheet__veil" onClick={onClose} aria-label="Cerrar" tabIndex={-1} />
      <div className="sheet__panel">
        <button type="button" className="sheet__close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        <div className="sheet__media">
          <div ref={ref} className="sheet__track" onScroll={onScroll}>
            {photos.map((ph, k) => (
              <button key={ph || k} type="button" className="sheet__slide" onClick={() => ph && setZoomAt(k)} aria-label="Ver foto en grande">
                <Img src={ph} alt={k === 0 ? product.name : ''} w={960} widths={[640, 960, 1280]} sizes="(max-width: 900px) 100vw, 50vw" eager={k === 0} className="contain" />
              </button>
            ))}
          </div>
          <span className="sheet__zoomhint"><ZoomIn size={14} /> Toca para ampliar</span>
          {photos.length > 1 && (
            <>
              <button type="button" className="sheet__nav l" onClick={() => goTo(idx - 1)} aria-label="Foto anterior"><ChevronLeft size={20} /></button>
              <button type="button" className="sheet__nav r" onClick={() => goTo(idx + 1)} aria-label="Foto siguiente"><ChevronRight size={20} /></button>
              <div className="sheet__dots">{photos.map((_, k) => <button key={k} type="button" className={k === idx ? 'on' : ''} onClick={() => goTo(k)} aria-label={`Foto ${k + 1}`} />)}</div>
            </>
          )}
        </div>
        <div className="sheet__info">
          <span className="sheet__kicker">Artesanía Wayuu · Pieza única</span>
          <h2>{product.name}</h2>
          {product.codigo && <p className="sheet__code">Código {product.codigo}</p>}
          <p className="sheet__price">{fmt(product.price)}</p>
          {photos.length > 1 && (
            <div className="sheet__thumbs">
              {photos.map((ph, k) => (
                <button key={ph || k} type="button" className={k === idx ? 'on' : ''} onClick={() => goTo(k)} aria-label={`Ver foto ${k + 1}`}>
                  <img src={thumb(ph, 160)} alt="" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = toMediaUrl(ph); }} />
                </button>
              ))}
            </div>
          )}
          <p className="sheet__desc">{product.details}</p>
          <ul className="sheet__promise">
            <li>Tejida a mano en La Guajira</li>
            <li>Envíos a toda Colombia</li>
            <li>Pedido y pago por WhatsApp</li>
          </ul>
          <div className="sheet__actions">
            <button type="button" className={`btn btn--gold${added ? ' added' : ''}`} onClick={() => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1800); }}>
              <ShoppingBag size={16} />{added ? '¡Agregada al carrito!' : 'Agregar al carrito'}
            </button>
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn--wa"><MessageCircle size={16} />Preguntar por WhatsApp</a>
          </div>
          <Reviews productId={product.id} productName={product.name} />
        </div>
      </div>
      {zoomAt !== null && <Zoom photos={photos.filter(Boolean)} start={zoomAt} name={product.name} onClose={() => setZoomAt(null)} />}
    </div>
  );
}

function Pager({ page, pages, onGo }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <nav className="pager2" aria-label="Páginas del catálogo">
      <button type="button" className="pager2__arrow" disabled={page === 1} onClick={() => onGo(page - 1)}><ChevronLeft size={18} />Anterior</button>
      <span className="pager2__nums">
        {nums.map((n, k) => (n === '…'
          ? <span key={`d${k}`} className="pager2__dots">…</span>
          : <button key={n} type="button" aria-current={n === page ? 'page' : undefined} onClick={() => onGo(n)}>{n}</button>))}
      </span>
      <button type="button" className="pager2__arrow" disabled={page === pages} onClick={() => onGo(page + 1)}>Siguiente<ChevronRight size={18} /></button>
    </nav>
  );
}

export default function CatalogPage({ onAdd }) {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [orden, setOrden] = useState(params.get('orden') || 'recientes');
  const [rango, setRango] = useState(params.get('precio') || '');
  const [page, setPage] = useState(Math.max(1, parseInt(params.get('pag') || '1', 10) || 1));
  const [retry, setRetry] = useState(0);
  const dq = useDebounced(q.trim(), 350);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPaginas: 1 });
  const [status, setStatus] = useState('loading');
  const [ratings, setRatings] = useState({});
  const [selected, setSelected] = useState(null);
  const [showFloat, setShowFloat] = useState(false);
  const topRef = useRef(null);
  const searchRef = useRef(null);
  const first = useRef(true);

  const filtros = useMemo(() => {
    const r = RANGES.find((x) => x[0] === rango) || RANGES[0];
    return { q: dq || undefined, orden, min: r[2] ?? undefined, max: r[3] ?? undefined };
  }, [dq, orden, rango]);

  // Volver a la página 1 cuando cambian los filtros
  const fkey = JSON.stringify(filtros);
  const prevKey = useRef(fkey);
  useEffect(() => { if (prevKey.current !== fkey) { prevKey.current = fkey; setPage(1); } }, [fkey]);

  // Filtros y página en la URL (se pueden compartir y sobreviven al recargar)
  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    if (dq) next.set('q', dq); else next.delete('q');
    if (orden !== 'recientes') next.set('orden', orden); else next.delete('orden');
    if (rango) next.set('precio', rango); else next.delete('precio');
    if (page > 1) next.set('pag', String(page)); else next.delete('pag');
    if (next.toString() !== window.location.search.replace(/^\?/, '')) setParams(next, { replace: true });
  }, [dq, orden, rango, page, setParams]);

  useEffect(() => {
    const ctrl = new AbortController();
    if (!first.current && topRef.current) {
      const top = topRef.current.getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
    first.current = false;
    setStatus('loading');
    fetchPage(page, filtros, ctrl.signal)
      .then((d) => {
        if (d.totalPaginas && page > d.totalPaginas) { setPage(d.totalPaginas); return; }
        setItems(d.items); setMeta(d); setStatus('ok');
        const ids = d.items.map((x) => x.id).filter((id) => !(id in ratings));
        if (ids.length) getResumenResenas(ids).then((r) => setRatings((prev) => ({ ...prev, ...r }))).catch(() => {});
      })
      .catch((e) => { if (e?.code !== 'ERR_CANCELED') setStatus('error'); });
    return () => ctrl.abort();
  }, [filtros, page, retry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Botón flotante de búsqueda al bajar
  useEffect(() => {
    const f = () => setShowFloat(window.scrollY > 700);
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  // Ficha en la URL (?p=ID): enlace para compartir y el botón "atrás" la cierra
  const pid = params.get('p');
  useEffect(() => {
    if (!pid) { setSelected(null); return; }
    const found = items.find((x) => String(x.id) === pid);
    if (found) setSelected(found);
    else getProducto(pid).then((p) => setSelected(adaptProduct(p))).catch(() => {});
  }, [pid]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = useCallback((item) => {
    setSelected(item);
    const next = new URLSearchParams(window.location.search);
    next.set('p', item.id);
    setParams(next);
  }, [setParams]);
  const close = useCallback(() => {
    const next = new URLSearchParams(window.location.search);
    next.delete('p');
    setParams(next, { replace: true });
  }, [setParams]);

  const featured = page === 1 && !dq && !rango && orden === 'recientes' ? items[0] : null;
  const grid = featured ? items.slice(1) : items;
  const clear = () => { setQ(''); setRango(''); setOrden('recientes'); };
  const goSearch = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 450); };

  return (
    <div className="vitrina">
      <Seo
        path="/catalogo"
        title="Catálogo de Mochilas Wayuu"
        description="Explora nuestro catálogo completo de mochilas Wayuu y Kankuamas: colores, tamaños y precios. Piezas únicas tejidas a mano, envíos a toda Colombia."
        keywords="catálogo mochilas wayuu, comprar mochila wayuu, mochilas wayuu precios, mochilas guajira bags"
      />
      <div className="wrap">
        <header className="cat-hero">
          <div className="cat-hero__title">
            <span className="eyebrow">Nuestras mochilas</span>
            <h1 className="h-display">Catálogo</h1>
            <p>{status === 'error' ? 'Piezas únicas tejidas a mano' : status === 'loading' && !items.length ? 'Cargando piezas…' : `${meta.total} ${meta.total === 1 ? 'pieza única' : 'piezas únicas'} tejidas a mano`}</p>
          </div>
          <div className="cat-hero__find">
            <label className="seek">
              <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="¿Qué mochila buscas?" aria-label="Buscar mochila por nombre, color o código" />
              {q ? <button type="button" onClick={() => setQ('')} aria-label="Borrar búsqueda"><X size={18} /></button> : <span aria-hidden="true"><Search size={18} /></span>}
              <i aria-hidden="true" />
            </label>
            <p className="phrase">
              Mostrar mochilas de <Pick value={rango} options={RANGES} onChange={setRango} label="Rango de precio" /> ordenadas por <Pick value={orden} options={ORDERS} onChange={setOrden} label="Orden" />
            </p>
          </div>
        </header>
        <Benefits />

        <div ref={topRef} className="cat-anchor" />
        {status === 'loading' && !items.length ? (
          <div className="vgrid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="vcard vcard--skel"><div className="vcard__top"><span className="vcard__frame"><span className="skel" /></span></div><span className="skel-line" /><span className="skel-line short" /></div>)}</div>
        ) : status === 'error' ? (
          <div className="vstate"><p>No pudimos cargar el catálogo.</p><small>Revisa tu conexión e inténtalo de nuevo en unos segundos.</small><button type="button" className="btn btn--line" onClick={() => setRetry((n) => n + 1)}>Intentar de nuevo</button></div>
        ) : items.length === 0 ? (
          <div className="vstate"><p>No encontramos mochilas con esa búsqueda.</p><button type="button" className="btn btn--gold" onClick={clear}>Ver todo el catálogo</button></div>
        ) : (
          <div className={status === 'loading' ? 'is-busy' : undefined}>
            {featured && (
              <section className="vfeat" aria-label="Pieza destacada">
                <button type="button" className="vfeat__media" onClick={() => open(featured)} aria-label={`Ver ${featured.name}`}>
                  <Img src={featured.photos[0]} alt={featured.name} w={960} widths={[640, 960, 1280]} sizes="(max-width: 900px) 100vw, 46vw" eager />
                  {featured.photos[1] && <Img src={featured.photos[1]} alt="" w={320} widths={[320, 480]} sizes="160px" className="vfeat__mini" />}
                </button>
                <div className="vfeat__info">
                  <span className="vfeat__badge">Recién llegada</span>
                  <h2>{featured.name}</h2>
                  {ratings[featured.id]?.total > 0 && <span className="vcard__rate"><Stars value={ratings[featured.id].promedio} size={14} /><small>({ratings[featured.id].total})</small></span>}
                  <p>{featured.desc}</p>
                  <p className="vfeat__price">{fmt(featured.price)}</p>
                  <div className="vfeat__cta">
                    <button type="button" className="btn btn--gold btn--xl" onClick={() => open(featured)}>La quiero ver</button>
                    <button type="button" className="btn btn--line btn--xl" onClick={() => onAdd(featured)}><ShoppingBag size={16} />Al carrito</button>
                  </div>
                </div>
              </section>
            )}
            <div className="vgrid">
              {grid.map((item, i) => <Card key={item.id} item={item} i={i} rating={ratings[item.id]} onOpen={open} onAdd={onAdd} />)}
            </div>
            <Pager page={page} pages={meta.totalPaginas} onGo={setPage} />
          </div>
        )}
      </div>
      <button type="button" className={`seek-fab${showFloat ? ' on' : ''}`} onClick={goSearch} aria-label="Buscar"><Search size={20} /></button>
      {selected && <Sheet key={selected.id} product={selected} onClose={close} onAdd={onAdd} />}
    </div>
  );
}
