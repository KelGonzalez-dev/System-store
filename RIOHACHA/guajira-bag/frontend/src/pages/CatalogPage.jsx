import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageCircle, Search, ShoppingCart, X, ZoomIn } from 'lucide-react';
import Seo from '../components/Seo';
import Img from '../components/Img';
import Stars from '../components/Stars';
import Reviews from '../components/Reviews';
import Benefits from '../components/Benefits';
import { getProducto, getProductos, getResumenResenas } from '../api';
import { thumb, toMediaUrl } from '../config';
import { WA_NUMBER, fmt } from '../data';
import { useSnapTrack } from '../hooks/useSnapTrack';
import ProductCard from '../components/ProductCard';
import { adaptProduct } from '../lib/product';

export { adaptProduct };

const PAGE_SIZE = 20;

// ── Caché en memoria: volver a una página o repetir una búsqueda es instantáneo ──
const cache = new Map();
let legacyAll = null; // por si la API del servidor aún es la versión anterior (sin búsqueda en servidor)

async function fetchPage(page, q) {
  const key = `${page}|${q}`;
  if (cache.has(key)) return cache.get(key);
  const data = await getProductos(page, PAGE_SIZE, true, q ? { q } : {});
  let out;
  if (q && data.porPagina === undefined) {
    if (!legacyAll) {
      const first = await getProductos(1, 100, true);
      let all = first.items;
      for (let p = 2; p <= first.totalPaginas; p++) all = all.concat((await getProductos(p, 100, true)).items);
      legacyAll = all;
    }
    const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const list = legacyAll.filter((p) => norm(`${p.nombre} ${p.descripcion} ${p.codigo || ''}`).includes(norm(q)));
    out = { items: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: list.length, totalPaginas: Math.max(1, Math.ceil(list.length / PAGE_SIZE)) };
  } else {
    out = { items: data.items, total: data.total, totalPaginas: data.totalPaginas };
  }
  out = { ...out, items: out.items.map(adaptProduct) };
  cache.set(key, out);
  return out;
}

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
            {Math.abs(k - idx) <= 1 && <Img src={ph} alt={k === 0 ? name : ''} full eager={k === idx} className="contain" />}
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

function ProductModal({ product, onClose, onAdd }) {
  const [idx, setIdx] = useState(0);
  const [zoomAt, setZoomAt] = useState(null);
  const [added, setAdded] = useState(false);
  const images = product.photos.length ? product.photos : [null];

  useEffect(() => {
    const onKey = (e) => {
      if (zoomAt !== null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, zoomAt, images.length]);
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);

  const handleAdd = () => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa la *${product.name}*${product.codigo ? ` (código ${product.codigo})` : ''} (${fmt(product.price)}). ¿Está disponible?`)}`;

  return (
    <div className="pmodal-veil" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="pmodal" role="dialog" aria-modal="true" aria-label={product.name}>
        <button type="button" className="pmodal__close" onClick={onClose} aria-label="Cerrar"><X size={16} /></button>
        <div className="pmodal__gallery">
          <div className="pmodal__stage">
            <button type="button" className="pmodal__photo" onClick={() => images[idx] && setZoomAt(idx)} aria-label="Ver foto en grande">
              <Img key={idx} src={images[idx]} alt={product.name} full eager className="contain" />
            </button>
            <span className="pmodal__zoomhint"><ZoomIn size={13} /> Toca para ampliar</span>
            {images.length > 1 && (
              <>
                <button type="button" className="pmodal__nav l" onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + images.length) % images.length); }} aria-label="Anterior"><ChevronLeft size={18} /></button>
                <button type="button" className="pmodal__nav r" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % images.length); }} aria-label="Siguiente"><ChevronRight size={18} /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="pmodal__thumbs">
              {images.map((im, i) => (
                <button key={im + i} type="button" className={i === idx ? 'active' : ''} onClick={() => setIdx(i)}>
                  <img src={thumb(im, 320)} alt="" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = toMediaUrl(im); }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pmodal__info">
          <span className="pmodal__tag">Artesanía Wayuu · Pieza única</span>
          {product.codigo && <p className="pmodal__code">Código: {product.codigo}</p>}
          <h2>{product.name}</h2>
          <div className="pmodal__prices">
            <span className="pmodal__price">{fmt(product.price)}</span>
          </div>
          <p className="pmodal__desc">{product.details}</p>
          <ul className="pmodal__promise">
            <li>Tejida a mano en La Guajira</li>
            <li>Envíos a toda Colombia</li>
            <li>Pedido y pago por WhatsApp</li>
          </ul>
          <div className="pmodal__actions">
            <button type="button" className={`btn btn--gold${added ? ' added' : ''}`} onClick={handleAdd}>
              <ShoppingCart size={16} />{added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
            </button>
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn--wa"><MessageCircle size={16} />Consultar por WhatsApp</a>
          </div>
          <Reviews productId={product.id} productName={product.name} />
        </div>
      </div>
      {zoomAt !== null && <Zoom photos={images.filter(Boolean)} start={zoomAt} name={product.name} onClose={() => setZoomAt(null)} />}
    </div>
  );
}

export default function CatalogPage({ onAdd }) {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [q, setQ] = useState(search.trim());
  const [page, setPage] = useState(Math.max(1, parseInt(params.get('pag') || '1', 10) || 1));
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState(null);
  const topRef = useRef(null);

  // Búsqueda en el servidor (en todo el catálogo, no solo en la página actual)
  useEffect(() => {
    const t = setTimeout(() => { if (search.trim() !== q) { setQ(search.trim()); setPage(1); } }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    if (q) next.set('q', q); else next.delete('q');
    if (page > 1) next.set('pag', String(page)); else next.delete('pag');
    if (next.toString() !== window.location.search.replace(/^\?/, '')) setParams(next, { replace: true });
  }, [q, page, setParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchPage(page, q)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPaginas);
        const ids = data.items.map((x) => x.id).filter((id) => !(id in ratings));
        if (ids.length) getResumenResenas(ids).then((r) => !cancelled && setRatings((prev) => ({ ...prev, ...r }))).catch(() => {});
      })
      .catch(() => !cancelled && setError('No se pudo cargar el catálogo. Intenta de nuevo.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [page, q, retry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ficha abierta desde un enlace (?p=ID), por ejemplo desde "Elegidas para ti" en el inicio
  const pid = params.get('p');
  useEffect(() => {
    if (!pid) { setSelected(null); return; }
    const found = products.find((x) => String(x.id) === pid);
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

  const goTo = (p) => { setPage(p); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <div className="catalog-page">
      <Seo
        path="/catalogo"
        title="Catálogo de Mochilas Wayuu"
        description="Explora nuestro catálogo completo de mochilas Wayuu y Kankuamas: colores, tamaños y precios. Piezas únicas tejidas a mano, envíos a toda Colombia."
        keywords="catálogo mochilas wayuu, comprar mochila wayuu, mochilas wayuu precios, mochilas guajira bags"
      />
      <div className="wrap">
        <div ref={topRef} className="catalog-head">
          <span className="eyebrow">Nuestras mochilas</span>
          <h1 className="h-display">Catálogo</h1>
          <p className="sub">Tejida a mano por artesanas Wayuu de La Guajira</p>
          <div className="catalog-tools">
            <div className="catalog-search">
              <Search size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar mochila…" aria-label="Buscar mochila" />
              {search && <button type="button" className="catalog-search__clear" onClick={() => setSearch('')} aria-label="Borrar búsqueda"><X size={14} /></button>}
            </div>
            {!error && <span className="catalog-count"><b>{total}</b> {total === 1 ? 'producto' : 'productos'}{totalPages > 1 && ` · Pág ${page}/${totalPages}`}</span>}
          </div>
        </div>
        <Benefits />

        {loading && products.length === 0 ? (
          <div className="catalog-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="qcard"><div className="qcard__img"><span className="skel" /></div><div className="qcard__body" style={{ height: 84 }} /></div>
            ))}
          </div>
        ) : error ? (
          <div className="catalog-state err"><p>{error}</p><button type="button" className="btn btn--line" onClick={() => setRetry((n) => n + 1)}>Intentar de nuevo</button></div>
        ) : products.length === 0 ? (
          <p className="catalog-empty">No encontramos mochilas con ese criterio.</p>
        ) : (
          <div className={loading ? 'is-busy' : undefined}>
            <div className="catalog-grid">
              {products.map((item, idx) => <ProductCard key={item.id} item={item} idx={idx} rating={ratings[item.id]} onSelect={open} onAdd={onAdd} />)}
            </div>
            {totalPages > 1 && (
              <div className="pager">
                <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1}>← Anterior</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                  const dot = !show && (p === 2 || p === totalPages - 1);
                  if (dot) return <span key={p} className="dots">…</span>;
                  if (!show) return null;
                  return <button key={p} type="button" aria-current={p === page} onClick={() => goTo(p)}>{p}</button>;
                })}
                <button type="button" onClick={() => goTo(page + 1)} disabled={page === totalPages}>Siguiente →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && <ProductModal key={selected.id} product={selected} onClose={close} onAdd={onAdd} />}
    </div>
  );
}
