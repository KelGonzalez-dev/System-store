import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageCircle, Search, ShoppingCart, X, ZoomIn } from 'lucide-react';
import Seo from '../components/Seo';
import Img from '../components/Img';
import Stars from '../components/Stars';
import Reviews from '../components/Reviews';
import Benefits from '../components/Benefits';
import { getCategorias, getProducto, getProductos, getResumenResenas } from '../api';
import { thumb, toMediaUrl } from '../config';
import { WA_NUMBER, fmt } from '../data';
import { useSnapTrack } from '../hooks/useSnapTrack';
import ProductCard from '../components/ProductCard';
import { adaptProduct } from '../lib/product';
import { breadcrumbLd, categoryPath, frase, graph, idFromRef, itemListLd, productLd, productPath } from '../lib/seo';

export { adaptProduct };

const PAGE_SIZE = 20;

// ── Caché en memoria: volver a una página o repetir un filtro es instantáneo ──
const cache = new Map();

async function fetchPage(page, f, size = PAGE_SIZE) {
  const key = JSON.stringify([page, size, f]);
  if (cache.has(key)) return cache.get(key);
  const data = await getProductos(page, size, true, f);
  const out = { items: (data.items || []).map(adaptProduct), total: data.total || 0, totalPaginas: data.totalPaginas || 1 };
  cache.set(key, out);
  return out;
}

const ORDENES = [['recientes', 'Lo más nuevo'], ['precio_asc', 'Menor precio'], ['precio_desc', 'Mayor precio']];
const redondear = (n, hacia) => (hacia === 'abajo' ? Math.floor(n / 10000) * 10000 : Math.ceil(n / 10000) * 10000);

/** Filtro de precio con dos controles (mínimo y máximo). Aplica el cambio al soltar. */
function PriceRange({ lo, hi, value, onChange }) {
  const [v, setV] = useState(value);
  useEffect(() => { setV(value); }, [value[0], value[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  if (hi <= lo) return null;
  const pct = (x) => ((x - lo) / (hi - lo)) * 100;
  const commit = () => onChange(v);
  return (
    <div className="price">
      <div className="price__top"><span>Precio</span><b>{fmt(v[0])} – {fmt(v[1])}</b></div>
      <div className="price__track">
        <i style={{ left: `${pct(v[0])}%`, right: `${100 - pct(v[1])}%` }} />
        <input type="range" min={lo} max={hi} step={5000} value={v[0]} aria-label="Precio mínimo"
          onChange={(e) => setV([Math.min(Number(e.target.value), v[1] - 5000), v[1]])} onMouseUp={commit} onTouchEnd={commit} onKeyUp={commit} />
        <input type="range" min={lo} max={hi} step={5000} value={v[1]} aria-label="Precio máximo"
          onChange={(e) => setV([v[0], Math.max(Number(e.target.value), v[0] + 5000)])} onMouseUp={commit} onTouchEnd={commit} onKeyUp={commit} />
      </div>
    </div>
  );
}

/** Vista "organizada": una sección por categoría con sus primeras piezas. */
function Secciones({ cats, sinCategoria, ratings, onRatings, onOpen, onAdd, onVer }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const lista = [...cats.filter((c) => c.total > 0).map((c) => c.slug), ...(sinCategoria > 0 ? ['sin'] : [])];
    lista.forEach((slug) => {
      fetchPage(1, { categoria: slug }, 4).then((d) => {
        setData((prev) => ({ ...prev, [slug]: d.items }));
        onRatings(d.items.map((x) => x.id));
      }).catch(() => {});
    });
  }, [cats, sinCategoria]); // eslint-disable-line react-hooks/exhaustive-deps
  const secciones = [...cats.filter((c) => c.total > 0), ...(sinCategoria > 0 ? [{ id: 'sin', slug: 'sin', nombre: 'Otras piezas', total: sinCategoria, tallas: [] }] : [])];
  return (
    <div className="csecs">
      {secciones.map((c) => (
        <section key={c.slug} className="csec">
          <div className="csec__head">
            <div>
              <h2>{c.nombre}</h2>
              <span>{c.total} {c.total === 1 ? 'pieza' : 'piezas'}{c.tallas?.length ? ` · ${c.tallas.filter((t) => c.porTalla?.[t]).join(' · ')}` : ''}</span>
            </div>
            <a href={c.slug === 'sin' ? '/catalogo' : categoryPath(c)} className="csec__all" onClick={(e) => { e.preventDefault(); onVer(c.slug); }}>Ver {c.total > 4 ? `las ${c.total}` : 'todas'} →</a>
          </div>
          <div className="catalog-grid">
            {(data[c.slug] || Array.from({ length: Math.min(4, c.total) }, () => null)).map((item, i) => (item
              ? <ProductCard key={item.id} item={item} idx={i} rating={ratings[item.id]} onSelect={onOpen} onAdd={onAdd} />
              : <div key={i} className="qcard"><div className="qcard__img"><span className="skel" /></div><div className="qcard__body" style={{ height: 84 }} /></div>))}
          </div>
        </section>
      ))}
    </div>
  );
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
          <span className="pmodal__tag">{product.categoria ? `${product.categoria.nombre}${product.talla ? ` · ${product.talla}` : ''}` : 'Artesanía Wayuu'} · Pieza única</span>
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
  const num = (k) => { const n = Number(params.get(k)); return Number.isFinite(n) && n > 0 ? n : null; };
  const [search, setSearch] = useState(params.get('q') || '');
  const [q, setQ] = useState(search.trim());
  const route = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cat = route.cat || '';
  const [talla, setTalla] = useState(params.get('talla') || '');
  const [precio, setPrecio] = useState([num('min'), num('max')]);
  const [orden, setOrden] = useState(params.get('orden') || 'recientes');
  const [page, setPage] = useState(Math.max(1, parseInt(params.get('pag') || '1', 10) || 1));
  const [catsData, setCatsData] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState(null);
  const topRef = useRef(null);

  useEffect(() => { getCategorias().then(setCatsData).catch(() => setCatsData({ categorias: [], sinCategoria: 0 })); }, []);
  const cats = catsData?.categorias || [];
  const catSel = cats.find((c) => c.slug === cat) || null;
  const lo = redondear(catSel?.precioMin ?? catsData?.precioMin ?? 0, 'abajo');
  const hi = redondear(catSel?.precioMax ?? catsData?.precioMax ?? 0, 'arriba');
  const pMin = precio[0] && precio[0] > lo ? precio[0] : null;
  const pMax = precio[1] && precio[1] < hi ? precio[1] : null;

  const pedirRatings = useCallback((ids) => {
    const faltan = ids.filter((id) => !(id in ratings));
    if (faltan.length) getResumenResenas(faltan).then((r) => setRatings((prev) => ({ ...prev, ...r }))).catch(() => {});
  }, [ratings]);

  // Búsqueda en el servidor (en todo el catálogo)
  useEffect(() => {
    const t = setTimeout(() => { if (search.trim() !== q) { setQ(search.trim()); setPage(1); } }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtros = { q: q || undefined, categoria: cat || undefined, talla: talla || undefined, min: pMin ?? undefined, max: pMax ?? undefined, orden: orden !== 'recientes' ? orden : undefined };
  const fkey = JSON.stringify(filtros);
  // Vista organizada por categorías: sin filtros, en la primera página
  const organizada = !q && !cat && !talla && !pMin && !pMax && orden === 'recientes' && page === 1 && cats.length > 0;

  // Enlaces antiguos /catalogo?cat=x → dirección limpia /catalogo/x
  useEffect(() => {
    const old = params.get('cat');
    if (old && !route.cat && !route.ref) {
      const next = new URLSearchParams(window.location.search);
      next.delete('cat');
      navigate(`${categoryPath(old)}${next.toString() ? `?${next}` : ''}`, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtros en la URL (se pueden compartir)
  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    const set = (k, v) => (v ? next.set(k, String(v)) : next.delete(k));
    next.delete('cat');
    set('q', q); set('talla', talla); set('min', pMin); set('max', pMax);
    set('orden', orden !== 'recientes' ? orden : ''); set('pag', page > 1 ? page : '');
    if (next.toString() !== window.location.search.replace(/^\?/, '')) setParams(next, { replace: true });
  }, [fkey, page, setParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (organizada || !catsData) return undefined;
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchPage(page, filtros)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPaginas);
        pedirRatings(data.items.map((x) => x.id));
      })
      .catch(() => !cancelled && setError('No se pudo cargar el catálogo. Intenta de nuevo.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [fkey, page, retry, organizada, catsData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ficha abierta desde un enlace (?p=ID), por ejemplo desde "Elegidas para ti" en el inicio
  const pid = route.ref ? String(idFromRef(route.ref) || '') : params.get('p');
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
    if (route.ref) { navigate('/catalogo'); return; }
    const next = new URLSearchParams(window.location.search);
    next.delete('p');
    setParams(next, { replace: true });
  }, [setParams, route.ref, navigate]);

  // En celular, la categoría elegida se desliza a la vista dentro de la barra de categorías
  const navRef = useRef(null);
  useEffect(() => {
    const nav = navRef.current;
    const on = nav?.querySelector('.on');
    if (nav && on) nav.scrollTo({ left: on.offsetLeft - nav.clientWidth / 2 + on.offsetWidth / 2, behavior: 'smooth' });
  }, [cat, cats.length]);

  const subir = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const goTo = (p) => { setPage(p); subir(); };
  const elegirCat = (slug) => {
    setTalla(''); setPrecio([null, null]); setPage(1);
    const keep = q ? `?q=${encodeURIComponent(q)}` : '';
    if (slug !== cat || location.pathname.startsWith('/mochila')) navigate(`${categoryPath(slug || '')}${keep}`);
    subir();
  };
  const limpiar = () => { setSearch(''); setQ(''); setTalla(''); setPrecio([null, null]); setOrden('recientes'); setPage(1); if (cat) navigate('/catalogo'); };
  const hayFiltros = q || cat || talla || pMin || pMax || orden !== 'recientes';
  const totalTodas = cats.reduce((n, c) => n + c.total, 0) + (catsData?.sinCategoria || 0);

  // ── SEO: cada categoría y cada mochila tiene su propia página para Google ──
  const tallasTxt = catSel?.tallas?.length ? ` Tallas ${catSel.tallas.join(', ').replace(/, ([^,]*)$/, ' y $1')}.` : '';
  const precioTxt = (c) => (c?.precioMin ? ` Desde ${fmt(c.precioMin)}.` : '');
  const listaLd = !organizada && products.length ? itemListLd(products, (x) => x.photos?.[0] && thumb(x.photos[0], 640)) : null;
  const seo = selected ? {
    path: productPath(selected),
    title: `${selected.name}${selected.categoria ? ` · ${selected.categoria.nombre}${selected.talla ? ` ${selected.talla}` : ''}` : ''}`,
    description: `${selected.name}: ${frase((selected.desc || selected.details || 'mochila Wayuu tejida a mano').slice(0, 140))} Pieza única por ${fmt(selected.price)}. Envíos a toda Colombia.`,
    image: selected.photos?.[0] ? thumb(selected.photos[0], 1280) : undefined,
    imageAlt: selected.name,
    type: 'product',
    jsonLd: graph(
      productLd(selected, { rating: ratings[selected.id], mediaUrl: toMediaUrl }),
      breadcrumbLd([['Inicio', '/'], ['Catálogo', '/catalogo'], ...(selected.categoria ? [[selected.categoria.nombre, categoryPath(selected.categoria)]] : []), [selected.name, productPath(selected)]]),
    ),
  } : catSel ? {
    path: categoryPath(catSel),
    title: `${catSel.nombre} tejidas a mano`,
    description: `${catSel.nombre} de Guajira Bags: ${catSel.total} piezas únicas tejidas a mano por artesanas Wayuu de La Guajira.${tallasTxt}${precioTxt(catSel)} Envíos a toda Colombia.`,
    keywords: `${catSel.nombre.toLowerCase()}, ${catSel.nombre.toLowerCase()} wayuu, comprar ${catSel.nombre.toLowerCase()}, mochilas wayuu, guajira bags`,
    noindex: !!q,
    jsonLd: graph(
      { '@type': 'CollectionPage', name: catSel.nombre, url: `https://www.guajirabags.com${categoryPath(catSel)}`, isPartOf: { '@id': 'https://www.guajirabags.com/#web' } },
      breadcrumbLd([['Inicio', '/'], ['Catálogo', '/catalogo'], [catSel.nombre, categoryPath(catSel)]]),
      listaLd,
    ),
  } : {
    path: '/catalogo',
    title: 'Catálogo de mochilas Wayuu por categorías',
    description: `Catálogo de Guajira Bags: ${cats.filter((c) => c.total > 0).map((c) => c.nombre.toLowerCase()).join(', ') || 'mochilas Wayuu'}. Piezas únicas tejidas a mano en La Guajira, con envíos a toda Colombia.`,
    keywords: 'catálogo mochilas wayuu, mochilas recamadas, mochilas doble uso, mochilas primavera, mochilas tradicionales wayuu, mochilones wayuu, sobres wayuu, bolsos exclusivos, guajira bags',
    noindex: !!q,
    jsonLd: graph(
      { '@type': 'CollectionPage', name: 'Catálogo', url: 'https://www.guajirabags.com/catalogo', isPartOf: { '@id': 'https://www.guajirabags.com/#web' } },
      breadcrumbLd([['Inicio', '/'], ['Catálogo', '/catalogo']]),
      listaLd,
    ),
  };

  return (
    <div className="catalog-page">
      <Seo {...seo} />
      <div className="wrap">
        <div ref={topRef} className="catalog-head">
          <span className="eyebrow">Nuestras mochilas</span>
          <h1 className="h-display">{catSel ? catSel.nombre : 'Catálogo'}</h1>
          <p className="sub">Tejida a mano por artesanas Wayuu de La Guajira</p>
          <div className="catalog-tools">
            <div className="catalog-search">
              <Search size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar mochila…" aria-label="Buscar mochila" />
              {search && <button type="button" className="catalog-search__clear" onClick={() => setSearch('')} aria-label="Borrar búsqueda"><X size={14} /></button>}
            </div>
            {!error && !organizada && <span className="catalog-count"><b>{total}</b> {total === 1 ? 'producto' : 'productos'}{totalPages > 1 && ` · Pág ${page}/${totalPages}`}</span>}
          </div>
        </div>

        <Benefits />

        {cats.length > 0 && (
          <nav ref={navRef} className="cats" aria-label="Categorías">
            <a href="/catalogo" className={!cat ? 'on' : ''} onClick={(e) => { e.preventDefault(); elegirCat(''); }}>Todas <small>{totalTodas}</small></a>
            {cats.filter((c) => c.total > 0).map((c) => (
              <a key={c.id} href={categoryPath(c)} className={cat === c.slug ? 'on' : ''} onClick={(e) => { e.preventDefault(); elegirCat(c.slug); }}>{c.nombre} <small>{c.total}</small></a>
            ))}
          </nav>
        )}

        {cats.length > 0 && (
          <div className="cfilters">
            {catSel?.tallas?.length > 0 && (
              <div className="cfilters__group">
                <span className="cfilters__lbl">Talla</span>
                <div className="tallas">
                  <button type="button" className={!talla ? 'on' : ''} onClick={() => { setTalla(''); setPage(1); }}>Todas</button>
                  {catSel.tallas.map((t) => (
                    <button key={t} type="button" className={talla === t ? 'on' : ''} disabled={!catSel.porTalla?.[t]} onClick={() => { setTalla(t); setPage(1); }}>
                      {t} <small>{catSel.porTalla?.[t] || 0}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <PriceRange lo={lo} hi={hi} value={[pMin ?? lo, pMax ?? hi]} onChange={([a, b]) => { setPrecio([a, b]); setPage(1); }} />
            <label className="corden">
              <span>Ordenar por</span>
              <select value={orden} onChange={(e) => { setOrden(e.target.value); setPage(1); }}>
                {ORDENES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            {hayFiltros && <button type="button" className="cfilters__clear" onClick={limpiar}>Quitar filtros</button>}
          </div>
        )}

        {organizada ? (
          <Secciones cats={cats} sinCategoria={catsData?.sinCategoria || 0} ratings={ratings} onRatings={pedirRatings} onOpen={open} onAdd={onAdd} onVer={elegirCat} />
        ) : (loading && products.length === 0) || !catsData ? (
          <div className="catalog-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="qcard"><div className="qcard__img"><span className="skel" /></div><div className="qcard__body" style={{ height: 84 }} /></div>
            ))}
          </div>
        ) : error ? (
          <div className="catalog-state err"><p>{error}</p><button type="button" className="btn btn--line" onClick={() => setRetry((n) => n + 1)}>Intentar de nuevo</button></div>
        ) : products.length === 0 ? (
          <div className="catalog-state"><p className="catalog-empty">No encontramos mochilas con esos filtros.</p><button type="button" className="btn btn--gold" onClick={limpiar}>Ver todo el catálogo</button></div>
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
