import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Search, ShoppingCart, X } from 'lucide-react';
import Seo from '../components/Seo';
import { getProductos } from '../api';
import { toMediaUrl } from '../config';
import { WA_NUMBER, fmt } from '../data';
import { useReveal } from '../hooks/useReveal';

const PAGE_SIZE = 15;

function roundNice(n) {
  const step = n >= 200000 ? 10000 : n >= 50000 ? 5000 : 1000;
  return Math.ceil(n / step) * step;
}

function adaptProduct(p) {
  const price = Number(p.precio);
  const bump = 1.35 + (p.id % 5) * 0.02;
  const oldPrice = roundNice(price * bump);
  return {
    id: p.id,
    codigo: p.codigo ?? null,
    name: p.nombre,
    desc: p.descripcion,
    details: p.descripcionLarga || p.descripcion,
    price,
    oldPrice: oldPrice > price ? oldPrice : null,
    image: toMediaUrl(p.imagenUrl) || '/images/placeholder.webp',
    images: p.imagenes?.length ? p.imagenes.map(toMediaUrl) : [toMediaUrl(p.imagenUrl) || '/images/placeholder.webp'],
  };
}

function ProductCardImg({ src, alt, priority }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <span className="skel" aria-hidden="true" />}
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : 'low'} decoding="async" onLoad={() => setLoaded(true)} style={{ opacity: loaded ? 1 : 0 }} />
    </>
  );
}

function ProductCard({ item, idx, page, onSelect }) {
  const ref = useReveal({ index: idx % 8 });
  const discount = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
  return (
    <article ref={ref} className="rv pcard" data-v="up" onClick={() => onSelect(item)}>
      <div className="pcard__img">
        <ProductCardImg src={item.images[0]} alt={item.name} priority={idx < 4} />
        <span className="pcard__num">Pieza única</span>
        {item.oldPrice && <span className="pcard__badge">-{discount}%</span>}
      </div>
      <div className="pcard__body">
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
        <div className="pcard__row">
          <div>
            {item.oldPrice && <span className="pcard__old">{fmt(item.oldPrice)}</span>}
            <span className="pcard__price">{fmt(item.price)}</span>
          </div>
          <span className="pcard__cta">¡La quiero!</span>
        </div>
      </div>
    </article>
  );
}

function ProductModal({ product, onClose, onAdd }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [added, setAdded] = useState(false);
  const images = product.images?.length ? product.images : [product.image];

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [onClose]);

  const change = (n) => { setIdx(n); setZoom(0); };
  const handleAdd = () => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa la *${product.name}* (${fmt(product.price)}). ¿Está disponible?`)}`;
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div className="pmodal-veil" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="pmodal" role="dialog" aria-modal="true" aria-label={product.name}>
        <button type="button" className="pmodal__close" onClick={onClose} aria-label="Cerrar"><X size={16} /></button>
        <div className="pmodal__gallery">
          <div className="pmodal__stage">
            <img key={idx} src={images[idx]} alt={product.name} className={zoom ? `z${zoom}` : ''} onClick={() => setZoom((z) => (z + 1) % 4)} />
            {images.length > 1 && (
              <>
                <button type="button" className="pmodal__nav l" onClick={(e) => { e.stopPropagation(); change((idx - 1 + images.length) % images.length); }} aria-label="Anterior"><ChevronLeft size={18} /></button>
                <button type="button" className="pmodal__nav r" onClick={(e) => { e.stopPropagation(); change((idx + 1) % images.length); }} aria-label="Siguiente"><ChevronRight size={18} /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="pmodal__thumbs">
              {images.map((im, i) => (
                <button key={im + i} type="button" className={i === idx ? 'active' : ''} onClick={() => change(i)}>
                  <img src={im} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pmodal__info">
          <span className="pmodal__tag">Artesanía Wayuu</span>
          {product.codigo && <p className="pmodal__code">Código: {product.codigo}</p>}
          <h2>{product.name}</h2>
          <div className="pmodal__prices">
            {product.oldPrice && <span className="pmodal__old">{fmt(product.oldPrice)}</span>}
            <span className="pmodal__price">{fmt(product.price)}</span>
            {product.oldPrice && <span className="pmodal__off">-{discount}%</span>}
          </div>
          <p className="pmodal__desc">{product.details}</p>
          <div className="pmodal__actions">
            <button type="button" className={`btn btn--gold${added ? ' added' : ''}`} onClick={handleAdd}>
              <ShoppingCart size={16} />{added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
            </button>
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn--wa"><MessageCircle size={16} />Consultar por WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage({ onAdd }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const topRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getProductos(page, PAGE_SIZE, true)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.items.map(adaptProduct));
        setTotal(data.total);
        setTotalPages(data.totalPaginas);
      })
      .catch(() => !cancelled && setError('No se pudo cargar el catálogo. Intenta de nuevo.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [page]);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));
  const items = search ? filtered : products;
  const displayTotal = search ? filtered.length : total;
  const displayPages = search ? Math.ceil(filtered.length / PAGE_SIZE) || 1 : totalPages;

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
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar mochila…" />
            </div>
            <span className="catalog-count"><b>{displayTotal}</b> {displayTotal === 1 ? 'producto' : 'productos'}{displayPages > 1 && ` · Pág ${page}/${displayPages}`}</span>
          </div>
        </div>

        {loading ? (
          <div className="catalog-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pcard"><div className="pcard__img"><span className="skel" /></div><div className="pcard__body" style={{ height: 90 }} /></div>
            ))}
          </div>
        ) : error ? (
          <p className="catalog-state err">{error}</p>
        ) : items.length === 0 ? (
          <p className="catalog-empty">No encontramos mochilas con ese criterio.</p>
        ) : (
          <>
            <div className="catalog-grid">
              {items.map((item, idx) => <ProductCard key={item.id} item={item} idx={idx} page={page} onSelect={setSelected} />)}
            </div>
            {displayPages > 1 && !search && (
              <div className="pager">
                <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1}>← Anterior</button>
                {Array.from({ length: displayPages }, (_, i) => i + 1).map((p) => {
                  const show = p === 1 || p === displayPages || Math.abs(p - page) <= 1;
                  const dot = !show && (p === 2 || p === displayPages - 1);
                  if (dot) return <span key={p} className="dots">…</span>;
                  if (!show) return null;
                  return <button key={p} type="button" aria-current={p === page} onClick={() => goTo(p)}>{p}</button>;
                })}
                <button type="button" onClick={() => goTo(page + 1)} disabled={page === displayPages}>Siguiente →</button>
              </div>
            )}
          </>
        )}
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={onAdd} />}
    </div>
  );
}
