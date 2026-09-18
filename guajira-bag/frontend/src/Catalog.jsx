import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Search, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WA_NUMBER, fmt } from './data';
import { getProductos } from './api';
import { toMediaUrl } from './config';

// ─── Adaptar producto de la API al formato que usa la UI ─────
function adaptProduct(p) {
  return {
    id:      p.id,
    codigo:  p.codigo ?? null,
    name:    p.nombre,
    desc:    p.descripcion,
    details: p.descripcionLarga || p.descripcion,
    price:   Number(p.precio),
    image:   toMediaUrl(p.imagenUrl) || '/images/bags/placeholder.jpg',
    images:  p.imagenes?.length
               ? p.imagenes.map(toMediaUrl)
               : [toMediaUrl(p.imagenUrl) || '/images/bags/placeholder.jpg'],
  };
}

// ─── CSS GLOBAL ────────────────────────────────────────────────────────────
const CATALOG_STYLES = `
  .catalog-wrap { min-height:100vh; background:#F7F2EC; position:relative; }
  .catalog-section { background:transparent !important; }
  .shimmer-title { color:var(--text-primary); }
  .product-card-glow { position:relative; contain:content; border-radius:12px; background:#FFFDF9; border:1px solid rgba(94,67,35,.16); overflow:hidden; cursor:pointer; transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease; box-shadow:0 8px 24px rgba(45,31,17,.06); }
  .product-card-glow:hover { border-color:rgba(184,134,46,.55); box-shadow:0 14px 30px rgba(45,31,17,.12); transform:translateY(-3px); }
  .search-glow { background:rgba(255,255,255,.72); border:1px solid rgba(94,67,35,.16); border-radius:10px; color:var(--text-primary); font-family:'Inter',system-ui,sans-serif; font-size:15px; outline:none; transition:border-color .18s ease,box-shadow .18s ease; }
  .search-glow::placeholder { color:rgba(26,26,26,0.42); }
  .search-glow:focus { border-color:rgba(184,134,46,0.65); box-shadow:0 0 0 4px rgba(184,134,46,.1); }
  .btn-gold { background: linear-gradient(90deg, var(--primary), var(--secondary)); border:none; color:#071327; font-family:'Inter',system-ui,sans-serif; font-weight:700; cursor:pointer; transition:transform .18s ease,box-shadow .18s ease; border-radius:10px; padding:12px 18px; }
  .btn-gold:hover { box-shadow: 0 18px 40px rgba(184,134,46,0.12); transform:translateY(-2px); }
  .catalog-section { position:relative; z-index:1; }
  .catalog-wrap ::-webkit-scrollbar { width:6px; }
  .catalog-wrap ::-webkit-scrollbar-track { background:transparent; }
  .catalog-wrap ::-webkit-scrollbar-thumb { background:rgba(184,134,46,.35); border-radius:3px; }
  .tag-badge { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:11px; letter-spacing:.12em; text-transform:uppercase; font-family:'Inter',system-ui,sans-serif; font-weight:600; border:1px solid var(--border); color:var(--text-secondary); background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); }
  .img-overlay-shine { position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.02) 0%,transparent 40%); opacity:0; transition:opacity .28s; z-index:2; pointer-events:none; }
  .product-card-glow:hover .img-overlay-shine { opacity:1; }
  .catalog-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:24px; min-height:300px; }
  .catalog-item { content-visibility:auto; contain-intrinsic-size:420px; }
  .catalog-card-copy { color:#3F3024; }
  .catalog-card-description { color:#6B5743; }
  .product-preview-image { cursor:zoom-in; }
  .product-preview-image.is-zoomed { cursor:zoom-out; transform:scale(1.7); }
  .product-modal-info { min-width:0; }
  @media (max-width: 900px) { .catalog-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; } }
  @media (max-width: 640px) {
    .catalog-grid { gap:12px; }
    .catalog-section { padding-top:88px !important; padding-left:12px !important; padding-right:12px !important; }
    .catalog-header { margin-bottom:32px !important; }
    .catalog-card-copy { padding:14px 12px 16px !important; }
    .catalog-card-copy h3 { font-size:14px !important; }
    .catalog-card-description { font-size:12px !important; line-height:1.45 !important; margin-bottom:12px !important; }
    .catalog-card-price { font-size:16px !important; }
    .catalog-card-button { padding:7px 9px !important; font-size:10px !important; }
    .product-modal { grid-template-columns:1fr !important; max-height:94vh !important; border-radius:14px !important; }
    .product-modal-gallery { border-radius:14px 14px 0 0 !important; }
    .product-modal-gallery > div:first-child { min-height:220px !important; }
    .product-modal-info { padding:30px 20px 22px !important; }
    .product-modal-info p { font-size:15px !important; line-height:1.55 !important; }
  }
`;

function ProductCardImage({ product, priority = false }) {
  const images = product.images?.length ? product.images : [product.image];

  return (
    <img src={images[0]} alt={product.name} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "low"} decoding="async"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
    />
  );
}

// ─── PRODUCT MODAL ─────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onAdd }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [added, setAdded] = useState(false);
  const images = product.images?.length ? product.images : [product.image];

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const changeImage = (nextIdx) => {
    setImgIdx(nextIdx);
    setZoomed(false);
  };

  const handleAdd = () => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa la *${product.name}* (${fmt(product.price)}). ¿Está disponible?`)}`;

  return (
    <AnimatePresence>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position:"fixed", inset:0, zIndex:3000, background:"rgba(5,3,0,0.82)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
        <motion.div key="modal"
          initial={{ opacity:0, y:40, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:30, scale:0.95 }}
          transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
          onClick={e => e.stopPropagation()}
          className="product-modal"
          style={{ background:"#FFFDF9", borderRadius:18, width:"100%", maxWidth:900, maxHeight:"92vh", overflowY:"auto", display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", boxShadow:"0 30px 80px rgba(0,0,0,0.45)", border:"1px solid rgba(94,67,35,.25)", position:"relative" }}>

          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#B8862E,#F5D98A,#B8862E,transparent)", borderRadius:"24px 24px 0 0", zIndex:10 }} />

          <motion.button onClick={onClose} whileHover={{ scale:1.1, rotate:90 }} transition={{ duration:0.2 }}
            style={{ position:"absolute", top:16, right:16, zIndex:10, background:"rgba(184,134,46,0.15)", border:"1px solid rgba(184,134,46,0.3)", borderRadius:"50%", width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={16} color="#B8862E" />
          </motion.button>

          {/* Galería izquierda */}
          <div className="product-modal-gallery" style={{ borderRadius:"18px 0 0 18px", overflow:"hidden", background:"#F1E9DD", position:"relative" }}>
            <div style={{ width:"100%", aspectRatio:"1/1", minHeight:280, overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img key={imgIdx}
                src={images[imgIdx]} loading="lazy" decoding="async" alt={product.name}
                className={`product-preview-image${zoomed ? ' is-zoomed' : ''}`}
                onClick={() => setZoomed(value => !value)}
                style={{ width:"100%", height:"100%", objectFit:"contain", transition:"transform .3s ease" }} />
              <div style={{ position:"absolute", bottom:12, left:12, padding:"6px 10px", borderRadius:8, background:"rgba(255,253,249,.9)", color:"#5E4323", fontSize:11, pointerEvents:"none" }}>{zoomed ? "Reducir" : "Ampliar"}</div>
            </div>
            {images.length > 1 && (
              <div style={{ display:"flex", gap:8, padding:"12px 14px", overflowX:"auto", background:"#F1E9DD" }}>
                {images.map((img, i) => (
                    <motion.button key={i} onClick={() => changeImage(i)} whileHover={{ scale:1.05 }}
                    style={{ flexShrink:0, width:54, height:54, borderRadius:10, overflow:"hidden", border: imgIdx===i ? "2px solid #B8862E":"2px solid rgba(184,134,46,0.15)", cursor:"pointer", padding:0, background:"none" }}>
                    <img src={img} loading="lazy" decoding="async" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Info derecha */}
          <div className="product-modal-info" style={{ padding:"48px 36px 36px", display:"flex", flexDirection:"column", justifyContent:"space-between", color:"#3F3024" }}>
            <div>
              <div className="tag-badge" style={{ marginBottom:16 }}>✦ Artesanía Wayuu</div>
              {product.codigo && <div style={{ fontSize:12, color:"rgba(245,232,200,0.5)", marginBottom:10 }}>Código: {product.codigo}</div>}
              <h2 style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:"clamp(18px,2.2vw,26px)", fontWeight:700, color:"#2E2117", lineHeight:1.2, marginBottom:16 }}>{product.name}</h2>
              <div style={{ display:"inline-block", fontFamily:"'Bebas Neue',cursive", fontSize:36, letterSpacing:"0.04em", marginBottom:20, padding:"8px 20px", background:"linear-gradient(135deg,rgba(184,134,46,0.15),rgba(184,134,46,0.05))", borderRadius:12, border:"1px solid rgba(184,134,46,0.3)", color:"#D4A84B" }}>
                {fmt(product.price)}
              </div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:500, color:"#6B5743", lineHeight:1.65, marginBottom:28 }}>{product.details}</p>
              <div style={{ height:1, background:"linear-gradient(90deg,rgba(184,134,46,0.3),transparent)", marginBottom:28 }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <motion.button whileTap={{ scale:0.97 }} whileHover={{ scale:1.02 }} onClick={handleAdd} className="btn-gold"
                style={{ width:"100%", padding:"15px", background: added ? "linear-gradient(135deg,#2E7D32,#4CAF50)":"linear-gradient(135deg,#B8862E 0%,#D4A84B 50%,#B8862E 100%)", backgroundSize:"200% auto", color: added ? "#fff":"#0D0A06", border:"none", borderRadius:12, fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <ShoppingCart size={16} />
                {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
              </motion.button>
              <a href={whatsappUrl} target="_blank" rel="noreferrer"
                style={{ width:"100%", padding:"15px", background:"rgba(37,211,102,0.12)", border:"1px solid rgba(37,211,102,0.3)", color:"#25D366", borderRadius:12, fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8, textDecoration:"none", boxSizing:"border-box" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,211,102,0.2)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(37,211,102,0.12)"}}>
                <MessageCircle size={16} /> Consultar por WhatsApp
              </a>
              <motion.button onClick={onClose} whileHover={{ scale:1.01 }}
                style={{ width:"100%", padding:"13px", background:"transparent", color:"rgba(245,232,200,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, fontFamily:"'Cormorant Garamond',serif", fontSize:15, cursor:"pointer" }}>
                Cerrar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── FLOATING PARTICLES ────────────────────────────────────────────────────
function FloatingParticles() {
  // Este fondo es "position:fixed" con varios elementos animando infinitamente,
  // lo cual el navegador debe recalcular en cada frame de scroll. En celulares
  // se reduce bastante la cantidad de partículas para aliviar la carga.
  const [count, setCount] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 3 : 8
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = () => setCount(mq.matches ? 3 : 8);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
    };
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ position:"absolute", left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, width:Math.random()*4+1, height:Math.random()*4+1, borderRadius:"50%", background:`rgba(184,134,46,${Math.random()*0.35+0.08})`, animation:`float-particle ${Math.random()*8+10}s ease-in-out infinite`, animationDelay:`${Math.random()*6}s`, willChange:"transform,opacity" }} />
      ))}
    </div>
  );
}

// ─── CATALOG ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

export default function Catalog({ cart, onAdd }) {
  const [search, setSearch]                   = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage]                       = useState(1);
  const [products, setProducts]               = useState([]);
  const [total, setTotal]                     = useState(0);
  const [totalPages, setTotalPages]           = useState(1);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const topRef = useRef(null);

  // ── Cargar desde la API ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductos(page, PAGE_SIZE, true);
        if (cancelled) return;
        setProducts(data.items.map(adaptProduct));
        setTotal(data.total);
        setTotalPages(data.totalPaginas);
      } catch {
        if (!cancelled) setError('No se pudo cargar el catálogo. Intenta de nuevo.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page]);

  // Filtro local de búsqueda (sobre la página actual)
  const filtered     = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));
  const items        = search ? filtered : products;
  const displayTotal = search ? filtered.length : total;
  const displayPages = search ? Math.ceil(filtered.length / PAGE_SIZE) : totalPages;

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const goToPage = (p) => { setPage(p); topRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }); };

  return (
    <div className="catalog-wrap">
      <style>{CATALOG_STYLES}</style>
      <section id="catalogo" className="catalog-section" style={{ minHeight:"100vh", padding:"110px clamp(16px,4vw,70px) 100px" }}>
        <div style={{ maxWidth:1440, margin:"0 auto" }}>

          {/* ── HEADER ── */}
          <div ref={topRef} className="catalog-header" style={{ marginBottom:64 }}>
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
              style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(184,134,46,0.08))" }} />
              <span style={{ fontSize:11, letterSpacing:"0.18em", color:"var(--text-secondary)", textTransform:"uppercase", fontFamily:"'Inter', system-ui, sans-serif", fontWeight:600 }}>✦ Nuestras Mochilas ✦</span>
              <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(184,134,46,0.5),transparent)" }} />
            </motion.div>

            <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
              className="shimmer-title"
              style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:"clamp(34px,6.5vw,72px)", fontWeight:800, lineHeight:0.95, marginBottom:8, letterSpacing:"-0.02em" }}>
              Catálogo
            </motion.h2>

            <motion.p initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}
              style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:16, fontWeight:300, color:"var(--text-secondary)", fontStyle:"normal", marginBottom:40 }}>
              Tejida a mano por artesanas Wayuu de La Guajira
            </motion.p>

            {/* Búsqueda */}
            <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.3 }}
              style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              <div style={{ position:"relative", maxWidth:520, flex:1, minWidth:260 }}>
                <Search size={16} color="rgba(184,134,46,0.7)" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                <input value={search} onChange={handleSearch} placeholder="Buscar mochila..." className="search-glow"
                  style={{ width:"100%", padding:"14px 18px 14px 44px", boxSizing:"border-box" }} />
              </div>
                <motion.div key={displayTotal} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:10, fontSize:13, color:"var(--text-secondary)", fontFamily:"'Inter', system-ui, sans-serif", whiteSpace:"nowrap" }}>
                <span style={{ color:"var(--primary)", fontWeight:800, fontSize:16, fontFamily:"'Inter', system-ui, sans-serif" }}>{displayTotal}</span>
                {displayTotal === 1 ? "producto" : "productos"}
                {displayPages > 1 && <span style={{ color:"rgba(184,134,46,0.4)" }}>· Pág {page}/{displayPages}</span>}
              </motion.div>
            </motion.div>
          </div>

          {/* ── CONTENIDO ── */}
          {loading ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:"center", padding:"100px 20px", color:"rgba(245,232,200,0.35)", fontFamily:"'Cormorant Garamond'", fontSize:18 }}>
              <div style={{ fontSize:40, marginBottom:16 }}>✦</div>
              Cargando catálogo...
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:"center", padding:"80px 20px", color:"rgba(220,80,80,0.7)", fontFamily:"'Cormorant Garamond'", fontSize:16 }}>
              {error}
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <div key={`${page}-${search}`} className="catalog-grid">
                  {items.length === 0 ? (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                      style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 20px", color:"rgba(245,232,200,0.4)", fontFamily:"'Cormorant Garamond'", fontSize:18, fontStyle:"italic" }}>
                      No encontramos mochilas con ese criterio.
                    </motion.div>
                  ) : items.map((item, idx) => (
                    <motion.div className="catalog-item" key={item.id} initial={{ opacity:0 }} animate={{ opacity:1 }}
                      transition={{ duration:0.25 }}>
                      <div onClick={() => setSelectedProduct(item)}>
                        <div className="product-card-glow" style={{ height:"100%" }}>
                          <div style={{ position:"relative", width:"100%", paddingBottom:"100%", overflow:"hidden", borderRadius:"20px 20px 0 0" }}>
                            <ProductCardImage product={item} priority={idx < 4} />
                            <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 40%,rgba(13,10,6,0.7) 100%)" }} />
                            <div className="img-overlay-shine" />
                            <div style={{ position:"absolute", top:12, right:12, background:"rgba(184,134,46,0.15)", border:"1px solid rgba(184,134,46,0.3)", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)", color:"#D4A84B", fontSize:10, fontFamily:"'Bebas Neue'" }}>
                              {String(idx + 1 + (page - 1) * PAGE_SIZE).padStart(2, "0")}
                            </div>
                          </div>
                          <div className="catalog-card-copy" style={{ padding:"20px 20px 22px", position:"relative", zIndex:1 }}>
                            <h3 style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:15, fontWeight:700, marginBottom:6, lineHeight:1.3 }}>{item.name}</h3>
                            <p className="catalog-card-description" style={{ fontSize:13, marginBottom:16, lineHeight:1.6, fontFamily:"'Inter', system-ui, sans-serif", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.desc}</p>
                            <div style={{ height:1, background:"linear-gradient(90deg,rgba(184,134,46,0.4),transparent)", marginBottom:14 }} />
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                              <span className="catalog-card-price" style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:20, fontWeight:800, color:"#966719", letterSpacing:"0.02em" }}>{fmt(item.price)}</span>
                              <motion.button className="catalog-card-button" onClick={e=>{e.stopPropagation();setSelectedProduct(item);}} whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                                style={{ padding:"8px 16px", background:"linear-gradient(90deg,var(--primary),var(--secondary))", color:"#071327", border:"none", borderRadius:8, fontFamily:"'Inter', system-ui, sans-serif", fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:"0.04em", textTransform:"uppercase" }}>
                                Ver detalle
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Paginación */}
              {displayPages > 1 && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:80, flexWrap:"wrap" }}>
                  <motion.button onClick={() => goToPage(page-1)} disabled={page===1}
                    whileHover={page!==1?{scale:1.05}:{}} whileTap={page!==1?{scale:0.97}:{}}
                    style={{ padding:"10px 22px", borderRadius:12, border:"1px solid rgba(184,134,46,0.2)", background:page===1?"rgba(184,134,46,0.03)":"rgba(184,134,46,0.08)", color:page===1?"rgba(184,134,46,0.2)":"rgba(245,232,200,0.7)", fontFamily:"'Cormorant Garamond'", fontSize:14, cursor:page===1?"default":"pointer" }}>
                    ← Anterior
                  </motion.button>
                  {Array.from({ length:displayPages }, (_, i) => i+1).map(p => {
                    const show = p===1 || p===displayPages || Math.abs(p-page)<=1;
                    const dot  = !show && (p===2 || p===displayPages-1);
                    if (dot)  return <span key={p} style={{ color:"rgba(184,134,46,0.3)", fontSize:14, padding:"0 4px" }}>…</span>;
                    if (!show) return null;
                    return (
                      <motion.button key={p} onClick={() => goToPage(p)} whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }}
                        style={{ width:42, height:42, borderRadius:12, border:p===page?"1.5px solid #B8862E":"1px solid rgba(184,134,46,0.15)", background:p===page?"linear-gradient(135deg,#B8862E,#D4A84B)":"rgba(184,134,46,0.06)", color:p===page?"#0D0A06":"rgba(245,232,200,0.6)", fontFamily:"'Cormorant Garamond'", fontSize:15, fontWeight:p===page?700:400, cursor:"pointer" }}>
                        {p}
                      </motion.button>
                    );
                  })}
                  <motion.button onClick={() => goToPage(page+1)} disabled={page===displayPages}
                    whileHover={page!==displayPages?{scale:1.05}:{}} whileTap={page!==displayPages?{scale:0.97}:{}}
                    style={{ padding:"10px 22px", borderRadius:12, border:"1px solid rgba(184,134,46,0.2)", background:page===displayPages?"rgba(184,134,46,0.03)":"rgba(184,134,46,0.08)", color:page===displayPages?"rgba(184,134,46,0.2)":"rgba(245,232,200,0.7)", fontFamily:"'Cormorant Garamond'", fontSize:14, cursor:page===displayPages?"default":"pointer" }}>
                    Siguiente →
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={onAdd} />
        )}
      </AnimatePresence>
    </div>
  );
}