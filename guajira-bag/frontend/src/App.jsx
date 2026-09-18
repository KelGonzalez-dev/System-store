import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Plus, Minus, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { WA_NUMBER, fmt } from './data';   // ← sin PRODUCTS ni GALLERY_IMAGES

import Catalog    from './Catalog';
import Gallery    from './Gallery';
import Contact    from './Contact';
import LoginModal from './LoginModal';
import AdminPanel from './AdminPanel';

const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3v10.5a3.5 3.5 0 103.5-3.5V6h3.5A6 6 0 0115 12.5V21a3 3 0 11-3-3V6a3 3 0 00-3-3z" fill="currentColor" />
  </svg>
);

function useIntersect(ref, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function Navbar({ cartCount, onCartOpen, currentPage, onNavigate, scrolled, user, onLoginOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: "Inicio",   page: "home"     },
    { label: "Catálogo", page: "catalogo" },
    { label: "Galería",  page: "galeria"  },
    { label: "Contacto", page: "contacto" },
  ];
  const bg        = scrolled ? "rgba(255,255,255,0.96)" : "rgba(12,10,8,0.26)";
  const textColor = scrolled ? "#1A1A1A" : "#F7E3B7";
  const shadow    = scrolled ? "0 24px 60px rgba(0,0,0,0.10)" : "none";

  return (
    <nav className="site-nav" style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background:bg, boxShadow:shadow, borderBottom:scrolled?"1px solid rgba(184,134,46,0.18)":"none", backdropFilter:"blur(14px)", transition:"all 0.35s ease", padding:"0 clamp(12px,3.5vw,40px)", height:70, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <button onClick={() => onNavigate("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:12, fontFamily:"'Inter', system-ui, sans-serif", fontSize:20, fontWeight:700, color:textColor, letterSpacing:1, padding:0 }}>
        <img src="/images/logo.png" alt="Guajira Bags" style={{ width:42, height:42 }} />
        <span style={{ color:scrolled?"#1A1A1A":"#F7E3B7", fontWeight:400 }}>Guajira Bags</span>
      </button>

      <div className="nav-links" style={{ display:"flex", gap:24, alignItems:"center" }}>
        {links.map(link => (
          <button key={link.page} onClick={() => { setMobileOpen(false); onNavigate(link.page); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, letterSpacing:"0.08em", textTransform:"uppercase", color:currentPage===link.page?"var(--primary)":textColor, transition:"color 0.2s", fontFamily:"'Cormorant Garamond'", fontWeight:500, padding:"6px 8px" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
            onMouseLeave={e => e.currentTarget.style.color = currentPage===link.page ? "var(--primary)" : textColor}>
            {link.label}
          </button>
        ))}
      </div>
      <button className="nav-toggle" onClick={() => setMobileOpen(v => !v)} style={{ display:'none', background:'none', border:'none', color:textColor, cursor:'pointer' }} aria-label="Menu">
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="22" height="2" rx="1" fill="currentColor"/><rect y="7" width="22" height="2" rx="1" fill="currentColor"/><rect y="14" width="22" height="2" rx="1" fill="currentColor"/></svg>
      </button>
      {mobileOpen && (
        <div className="mobile-menu" style={{ position:'absolute', top:70, left:0, right:0, background:bg, display:'flex', flexDirection:'column', gap:8, padding:16, zIndex:1200 }}>
          {links.map(link => (
            <button key={link.page} onClick={() => { setMobileOpen(false); onNavigate(link.page); }} style={{ background:'none', border:'none', textAlign:'left', padding:'12px 8px', fontSize:16, color: currentPage===link.page? 'var(--primary)': textColor }}>{link.label}</button>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <button onClick={onCartOpen} style={{ position:"relative", background:"var(--primary)", border:"none", borderRadius:"50%", width:46, height:46, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.2s", boxShadow:"0 8px 30px rgba(0,0,0,0.12)" }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.08)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
          <ShoppingCart size={18} color="#fff" />
          {cartCount > 0 && (
            <span style={{ position:"absolute", top:-6, right:-6, background:"var(--accent)", color:"var(--text-primary)", borderRadius:"50%", width:20, height:20, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function Hero({ onNavigate }) {
  const { scrollY } = useScroll();
  const yA   = useTransform(scrollY, [0,800], [0,-180]);
  const xA   = useTransform(scrollY, [0,800], [0, 80]);
  const rotA = useTransform(scrollY, [0,800], [0, 12]);
  const yB   = useTransform(scrollY, [0,800], [0, 180]);
  const xB   = useTransform(scrollY, [0,800], [0,-80]);
  const rotB = useTransform(scrollY, [0,800], [0,-12]);

  return (
    <section className="hero-section" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", padding:"90px 20px 40px", background:`linear-gradient(180deg,rgba(14,10,6,0.66),rgba(18,13,9,0.48) 24%,rgba(255,255,255,0.04) 100%),url('/images/hero-wood.png') center/cover no-repeat`, backgroundBlendMode:"multiply" }}>
      <div className="hero-dots hero-dots__top" />
      <div className="hero-dots hero-dots__bottom" />
      <div style={{ textAlign:"center", maxWidth:860, zIndex:2, padding:"0 20px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:18, marginBottom:30, justifyContent:"center" }}>
          <img src="/images/logo.png" alt="Guajira Bags" className="hero-brandmark" />
          <div className="hero-badge"><span>Artesanía Wayuu de lujo</span></div>
        </div>
        <h1 style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:"clamp(38px,7.5vw,84px)", fontWeight:800, lineHeight:0.98, marginBottom:18, background:"linear-gradient(90deg, var(--primary), var(--secondary))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", wordBreak:"break-word", hyphens:"auto" }}>
          Guajira Bags
        </h1>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(16px,2vw,22px)", fontWeight:300, color:"rgba(255,255,255,0.92)", lineHeight:1.8, maxWidth:720, margin:"0 auto 40px" }}>
          Mochilas Wayuu y Kankuamas tejidas a mano con elegancia y tradición. Cada pieza es única: una mezcla de texturas, color y alma artesanal.
        </p>
        <div style={{ display:"flex", gap:18, justifyContent:"center", flexWrap:"wrap", marginBottom:56 }}>
          <button onClick={() => onNavigate("catalogo")} className="hero-cta hero-cta--filled">Ver Catálogo</button>
          <button onClick={() => onNavigate("contacto")} className="hero-cta hero-cta--outline">Contactar</button>
        </div>
        <div className="hero-stats">
          {[{ label:"Mochilas", value:"15+" },{ label:"Artesanas", value:"50+" },{ label:"Colombia", value:"La Guajira" }].map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:34, color:"var(--primary)", lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:"var(--text-secondary)", letterSpacing:"0.18em", textTransform:"uppercase", marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <motion.img src="/images/mochila1.png" alt="" drag={false} initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1 }} transition={{ duration:1.1, ease:"easeOut" }}
        className="hero-float-bag hero-float-bag--a"
        style={{ pointerEvents:"none", x:xA, y:yA, rotate:rotA }} />
      <motion.img src="/images/mochila2.png" alt="" drag={false} initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1 }} transition={{ duration:1.2, ease:"easeOut" }}
        className="hero-float-bag hero-float-bag--b"
        style={{ pointerEvents:"none", x:xB, y:yB, rotate:rotB }} />
    </section>
  );
}

// ─── STORY ─────────────────────────────────────────────────────────────────
function Story() {
  const ref = useRef(null);
  const visible = useIntersect(ref);
  return (
    <section ref={ref} className="section-rich" style={{ padding:"100px clamp(16px,4vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:60, alignItems:"center" }}>
        <div style={{ opacity:visible?1:0, transform:visible?"none":"translateX(-30px)", transition:"all 0.8s ease" }}>
          <p style={{ fontSize:12, letterSpacing:"0.2em", color:"var(--primary)", textTransform:"uppercase", marginBottom:12 }}>Nuestra historia</p>
          <h2 style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:"clamp(22px,3.6vw,36px)", fontWeight:700, color:"var(--text-primary)", marginBottom:24, lineHeight:1.1 }}>
            Tradición Wayuu<br /><span style={{ color:"var(--primary)", fontWeight:400 }}>en manos modernas</span>
          </h2>
          <p style={{ fontFamily:"'Cormorant Garamond'", fontSize:16, fontWeight:300, color:"var(--text-secondary)", lineHeight:1.8, marginBottom:20 }}>
            Guajira Bags nace del amor por la artesanía Wayuu y Kankuama. Cada mochila es tejida a mano por artesanas de La Guajira, combinando técnicas ancestrales con diseño contemporáneo.
          </p>
          <p style={{ fontFamily:"'Cormorant Garamond'", fontSize:16, fontWeight:300, color:"#666", lineHeight:1.8, marginBottom:24 }}>
            Nuestro compromiso es preservar la cultura indígena, apoyar a comunidades locales y crear piezas que inspiren elegancia, autenticidad y sostenibilidad.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {[{ label:"Colecciones", value:"5" },{ label:"Artesanas", value:"50+" },{ label:"Piezas", value:"100+" },{ label:"Años", value:"Tradición" }].map(s => (
              <div key={s.label} style={{ padding:"16px", background:"var(--bg-secondary)", borderRadius:4, textAlign:"center" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, color:"var(--primary)" }}>{s.value}</div>
                <div style={{ fontSize:12, color:"var(--text-secondary)", letterSpacing:"0.1em", marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ opacity:visible?1:0, transform:visible?"none":"translateX(30px)", transition:"all 0.8s ease 0.2s" }}>
          <div style={{ background:"linear-gradient(135deg,rgba(230,201,138,0.95) 0%,rgba(184,134,46,0.85) 100%)", borderRadius:24, paddingBottom:"100%", position:"relative", overflow:"hidden" }}>
            <img src="./images/galeria/galeria4.jpg" alt="Artesanas" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CART MODAL ────────────────────────────────────────────────────────────
function CartModal({ cart, setCart, isOpen, onClose }) {
  const [name, setName]         = useState("");
  const [city, setCity]         = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const updateQty = (id, delta) =>
    setCart(c => c.map(i => i.id===id ? { ...i, qty:Math.max(0,i.qty+delta) } : i).filter(i => i.qty>0));

  const sendOrder = () => {
    if (!name.trim()) { alert("Por favor ingresa tu nombre"); return; }
    if (!city.trim()) { alert("Por favor ingresa tu ciudad"); return; }
    let msg = `*PEDIDO — Guajira Bags*\n\n*Cliente:* ${name}\n*Ciudad:* ${city}\n\n*Productos:*\n`;
    cart.forEach(i => {
      const codePart = i.codigo ? ` (codigo: ${i.codigo})` : '';
      msg += `• ${i.name}${codePart} — ID:${i.id} x${i.qty} = ${fmt(i.price*i.qty)}\n`;
    });
    msg += `\n*TOTAL: ${fmt(total)}*\n\nQuiero hacer este pedido. Por favor confirmen disponibilidad y el precio final. Gracias.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ position:"fixed", right:0, top:0, bottom:0, width:"min(480px,100vw)", background:"#FFF", display:"flex", flexDirection:"column", animation:"slideIn 0.3s ease", borderLeft:"1px solid #ECECEC" }}>
        <div style={{ padding:"24px", borderBottom:"1px solid #ECECEC", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:18, color:"var(--text-primary)", margin:0 }}>Tu Carrito</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#666" }}><X size={20} /></button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {cart.length===0
            ? <p style={{ color:"#666", fontFamily:"'Cormorant Garamond'", fontSize:15, fontStyle:"italic", textAlign:"center", marginTop:40 }}>Tu carrito está vacío</p>
            : cart.map(item => (
              <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #ECECEC" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
                  <button onClick={() => setSelectedProduct(item)} style={{ border:"none", padding:0, background:"none", cursor:"pointer", width:56, height:56, borderRadius:8, overflow:"hidden" }}>
                    <img src={item.image} alt={item.name} loading="lazy" decoding="async" style={{ width:56, height:56, objectFit:"cover", display:"block" }} />
                  </button>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:14, color:"var(--text-primary)", marginBottom:2 }}>{item.name}</div>
                    <div style={{ fontSize:12, color:"var(--primary)" }}>{fmt(item.price)} c/u</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <button onClick={() => updateQty(item.id,-1)} style={{ background:"#F5F5F5", border:"1px solid #E0E0E0", borderRadius:"50%", width:24, height:24, cursor:"pointer", color:"#666", padding:0, display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={12} /></button>
                  <span style={{ fontSize:14, color:"#1A1A1A", minWidth:20, textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ background:"#FAFAFA", border:"1px solid #ECECEC", borderRadius:"50%", width:24, height:24, cursor:"pointer", color:"#666", padding:0, display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={12} /></button>
                </div>
              </div>
            ))
          }
        </div>
        {cart.length>0 && (
          <>
            <div style={{ padding:"24px", borderTop:"1px solid #ECECEC", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:16, color:"var(--text-primary)" }}>Total:</span>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:"var(--primary)" }}>{fmt(total)}</span>
            </div>
            {!showForm
              ? <button onClick={() => setShowForm(true)} style={{ width:"calc(100% - 48px)", margin:"12px 24px 24px", background:"var(--primary)", color:"#FFF", border:"none", padding:"14px", borderRadius:8, fontFamily:"'Cormorant Garamond'", fontSize:15, fontWeight:600, cursor:"pointer" }}>Realizar Pedido</button>
              : <div style={{ padding:"24px", borderTop:"1px solid #ECECEC" }}>
                  <input type="text" placeholder="Tu nombre completo" value={name} onChange={e=>setName(e.target.value)} style={{ width:"100%", padding:"10px 12px", border:"1px solid #E0E0E0", borderRadius:8, marginBottom:12, fontSize:14, fontFamily:"'Cormorant Garamond'", boxSizing:"border-box" }} />
                  <input type="text" placeholder="Tu ciudad" value={city} onChange={e=>setCity(e.target.value)} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ECECEC", borderRadius:8, marginBottom:12, fontSize:14, fontFamily:"'Cormorant Garamond'", boxSizing:"border-box" }} />
                  <button onClick={sendOrder} style={{ width:"100%", padding:"14px", background:"var(--primary)", color:"#FFF", border:"none", borderRadius:8, fontFamily:"'Cormorant Garamond'", fontSize:15, fontWeight:600, cursor:"pointer", marginBottom:8 }}>Enviar por WhatsApp</button>
                  <button onClick={() => setShowForm(false)} style={{ width:"100%", padding:"14px", background:"#F5F5F5", color:"#1A1A1A", border:"1px solid #E0E0E0", borderRadius:8, fontFamily:"'Cormorant Garamond'", fontSize:15, cursor:"pointer" }}>Cancelar</button>
                </div>
            }
          </>
        )}
      </div>
      {selectedProduct && (
        <CartProductView product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={(p) => {
          setCart(c => {
            const ex = c.find(i => i.id===p.id);
            if (ex) return c.map(i => i.id===p.id ? { ...i, qty: i.qty+1 } : i);
            return [...c, { ...p, qty: 1 }];
          });
          setSelectedProduct(null);
        }} />
      )}
    </div>
  );
}

// ─── Cart quick-view modal used by CartModal ───────────────────────────────
function CartProductView({ product, onClose, onAdd }) {
  if (!product) return null;
  const images = product.images?.length ? product.images : [product.image];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:4000, background:'rgba(6,4,2,0.9)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ width:'min(92vw,960px)', borderRadius:18, overflow:'hidden', background:'#fff', display:'flex', gap:0 }} onClick={e=>e.stopPropagation()}>
        <div style={{ flex:'1 1 60%', background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src={images[0]} alt={product.name} style={{ maxWidth:'100%', maxHeight:'80vh', objectFit:'contain' }} />
        </div>
        <div style={{ width:360, padding:24, display:'flex', flexDirection:'column', gap:12 }}>
          <h3 style={{ margin:0, fontFamily:"'Inter', system-ui, sans-serif", fontSize:18, fontWeight:700 }}>{product.name}</h3>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:'var(--primary)' }}>{fmt(product.price)}</div>
          <p style={{ color:'#444', lineHeight:1.6 }}>{product.details || product.desc || ''}</p>
          <div style={{ marginTop:'auto', display:'flex', gap:8 }}>
            <button onClick={() => { onAdd(product); onClose(); }} style={{ flex:1, padding:12, borderRadius:10, border:'none', background:'linear-gradient(135deg,#B8862E,#D4A84B)', color:'#0D0A06', fontWeight:700 }}>Agregar al carrito</button>
            <button onClick={onClose} style={{ padding:12, borderRadius:10, border:'1px solid #ddd', background:'#fff' }}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FLOATING CART ─────────────────────────────────────────────────────────
function FloatingCartButton({ cartCount, onCartOpen }) {
  if (cartCount===0) return null;
  return (
    <button onClick={onCartOpen} style={{ position:"fixed", bottom:30, right:30, zIndex:999, background:"#C9A55C", color:"#FFF", border:"none", borderRadius:"50%", width:56, height:56, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 4px 20px rgba(201,169,92,0.3)", transition:"transform 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
      <ShoppingCart size={24} />
      <span style={{ position:"absolute", top:-4, right:-4, background:"#F5D7DA", color:"#1A1A1A", borderRadius:"50%", width:20, height:20, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>
    </button>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer({ user, onNavigate, onLoginOpen }) {
  return (
    <footer style={{ background:"var(--text-primary)", color:"#FFF", padding:"60px 20px 20px", textAlign:"center", borderTop:"1px solid var(--border)" }}>
      <p style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:16, marginBottom:8 }}>Guajira Bags</p>
      <p style={{ fontFamily:"'Cormorant Garamond'", fontSize:14, color:"rgba(255,255,255,0.7)", fontStyle:"italic", marginBottom:30 }}>Tradición, elegancia y cultura tejida a mano.</p>
      <div style={{ display:"flex", justifyContent:"center", gap:18, marginBottom:28 }}>
        <a href="https://www.instagram.com/guajira_bags/" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color:"#FFF", display:"inline-flex" }}><Instagram size={20} /></a>
        <a href="https://www.tiktok.com/@.guajira.bags?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" aria-label="TikTok" style={{ color:"#FFF", display:"inline-flex" }}><TikTokIcon size={20} /></a>
      </div>
      <button onClick={() => user ? onNavigate('admin') : onLoginOpen()} style={{ background:"none", border:0, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:11, marginBottom:28, padding:4 }}>Acceso administrativo</button>
      <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", letterSpacing:"0.1em" }}>© 2026 Guajira Bags. Todos los derechos reservados. Riohacha, La Guajira, Colombia.</p>
    </footer>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cart, setCart] = useState(() => {
    try { const s = localStorage.getItem("guajira_cart"); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [cartOpen,  setCartOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user,      setUser]      = useState(() => {
    try { const u = localStorage.getItem("gb_user"); return u ? JSON.parse(u) : null; }
    catch { return null; }
  });

  useEffect(() => { localStorage.setItem("guajira_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id===product.id);
      if (ex) return c.map(i => i.id===product.id ? { ...i, qty:i.qty+1 } : i);
      return [...c, { ...product, qty:1 }];
    });
  };

  const handleLogin  = (data) => setUser({ username:data.username, rol:data.rol });
  const handleLogout = () => {
    localStorage.removeItem('gb_token');
    localStorage.removeItem('gb_user');
    setUser(null);
    setCurrentPage('home');
  };

  const cartCount = cart.reduce((s, i) => s+i.qty, 0);

  if (currentPage==='admin') {
    if (!user) { setCurrentPage('home'); return null; }
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="site-root" style={{ color:"#1A1A1A" }}>
      <div className="page-bg" aria-hidden="true" />
      <style>{`
        /* Mobile improvements for navbar and hero text contrast */
        .site-nav button { color: var(--text-primary); }
        @media (max-width:640px){
          .site-nav { padding: 0 12px !important; }
          .hero-section h1 { font-size: clamp(34px, 10vw, 68px) !important; }
          .hero-section p  { font-size: clamp(14px, 3.6vw, 18px) !important; color: rgba(255,255,255,0.95) !important; }
        }
        /* Mobile nav toggle */
        .nav-toggle { display: none; }
        .mobile-menu { display: none; }
        @media (max-width:860px) {
          .nav-links { display: none !important; }
          .nav-toggle { display: inline-flex !important; align-items: center; justify-content: center; padding:8px; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
      <style>{`
        @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
      `}</style>

      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} currentPage={currentPage} onNavigate={setCurrentPage} scrolled={scrolled} user={user} onLoginOpen={() => setLoginOpen(true)} />

      {currentPage==="home"     && <Hero onNavigate={setCurrentPage} />}
      {currentPage==="home"     && <Gallery />}
      {currentPage==="catalogo" && <Catalog cart={cart} onAdd={addToCart} />}
      {currentPage==="galeria"  && <Gallery />}
      {currentPage==="home"     && <Story />}
      {currentPage==="contacto" && <Contact />}

      <Footer user={user} onNavigate={setCurrentPage} onLoginOpen={() => setLoginOpen(true)} />
      <CartModal cart={cart} setCart={setCart} isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <FloatingCartButton cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
    </div>
  );
}