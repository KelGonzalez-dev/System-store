import React from 'react';

export default function MenuPage() {
  return <div>Deprecated - Use Catalog in App instead</div>;
}

function useIntersect(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function AnimatedBubbles() {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 8 + Math.random() * 8,
    delay: Math.random() * 5,
    size: 20 + Math.random() * 80,
    opacity: 0.03 + Math.random() * 0.08
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          style={{
            position: "absolute",
            left: `${bubble.left}%`,
            bottom: "-100px",
            width: bubble.size,
            height: bubble.size,
            borderRadius: "50%",
            border: `2px solid rgba(201,168,76,${bubble.opacity})`,
            animation: `floatBubble ${bubble.duration}s ease-in infinite`,
            animationDelay: `${bubble.delay}s`,
            willChange: "transform"
          }}
        />
      ))}
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: `
        radial-gradient(circle at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(201,168,76,0.03) 0%, transparent 50%)
      `,
      animation: "backgroundShift 20s ease-in-out infinite",
      pointerEvents: "none"
    }} />
  );
}

export default function MenuPage({ cart, onAdd, onBack, onCartOpen }) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(MENU)[0]);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const visible = useIntersect(ref);
  const categories = Object.keys(MENU);
  const items = useMemo(() => {
    const query = search.trim().toLowerCase();
    const source = MENU[activeCategory].items;
    if (!query) return source;
    return source.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
    );
  }, [activeCategory, search]);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalEstimate = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <main style={{ minHeight: '100vh', background: '#0d0b08', color: '#f5efe6', paddingTop: 90, position: 'relative', overflow: 'hidden' }}>
      <AnimatedBubbles />
      <AnimatedBackground />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,4vw,60px)', position: 'relative', zIndex: 1 }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(201,168,76,0.4)', background: 'transparent', color: '#c9a84c', padding: '10px 16px', borderRadius: 2, cursor: 'pointer', marginBottom: 24 }}>
          <ArrowLeft size={18} /> Volver al inicio
        </button>

        <div ref={ref} style={{ opacity: 1, transform: 'none', transition: 'all 0.8s ease' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 18, marginBottom: 22 }}>
            <div style={{ flex: '1 1 420px', minWidth: 300 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: 12 }}>Menú completo</p>
              <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 'clamp(34px,5vw,56px)', fontWeight: 700, lineHeight: 1.05, marginBottom: 14 }}>Selecciona tu bebida</h1>
              <p style={{ fontFamily: "'Cormorant Garamond'", fontSize: 17, lineHeight: 1.65, color: 'rgba(245,239,230,0.75)' }}>
                Seleccione lo que desea y luego presione en el botón para hacer el pedido con el asesor.
                Aquí están las clasificaciones y los productos de cada categoría, para que su experiencia sea más fácil y clara.
              </p>
            </div>
            <div style={{ flex: '0 0 260px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4, padding: 18 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: '#c9a84c', marginBottom: 10 }}>Pedido rápido</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#f5efe6' }}>Artículos</span>
                <strong style={{ color: '#c9a84c' }}>{cartCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#f5efe6' }}>Total estimado</span>
                <strong style={{ color: '#c9a84c' }}>{fmt(totalEstimate)}</strong>
              </div>
              <button onClick={onCartOpen} style={{ width: '100%', marginTop: 16, padding: '12px 0', border: 'none', borderRadius: 2, background: '#c9a84c', color: '#0d0b08', cursor: 'pointer', fontFamily: "'Cormorant Garamond'", fontWeight: 600, letterSpacing: '0.08em' }}>
                <ShoppingCart size={18} /> Ver pedido
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={17} color="#c9a84c99" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 3,
                color: '#f5efe6',
                padding: '10px 12px 10px 36px',
                outline: 'none',
                fontFamily: "'Cormorant Garamond'",
                fontSize: 16
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            {categories.map(category => (
              <button key={category} onClick={() => setActiveCategory(category)} style={{ padding: '12px 18px', borderRadius: 2, border: activeCategory === category ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,0.18)', background: activeCategory === category ? '#c9a84c' : 'rgba(255,255,255,0.03)', color: activeCategory === category ? '#0d0b08' : '#c9a84c', cursor: 'pointer', fontFamily: "'Cormorant Garamond'", fontSize: 14, whiteSpace: 'nowrap' }}>
                {MENU[category].icon} {category}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
              {items.length === 0 && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.16)', borderRadius: 4, padding: 20 }}>
                  <p style={{ margin: 0, color: 'rgba(245,239,230,0.7)', fontFamily: "'Cormorant Garamond'", fontSize: 18 }}>
                    No encontramos productos con ese criterio en esta categoría.
                  </p>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
                {items.map((item) => {
                  const priceEntries = Object.entries(item.prices);
                  const firstPrice = priceEntries[0][1];
                  const inCart = cart.find(c => c.id === item.id);

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(201,168,76,0.16)',
                        borderRadius: 4,
                        padding: 15,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.22s ease, border-color 0.22s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.38)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.16)';
                      }}
                    >
                      <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,168,76,0.08)' }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 10 }}>
                          <div>
                            <h4 style={{ margin: 0, fontFamily: "'Playfair Display'", fontSize: 18, color: '#f5efe6' }}>{item.name}</h4>
                            <p style={{ margin: '6px 0 0', color: 'rgba(245,239,230,0.65)', fontFamily: "'Cormorant Garamond'", lineHeight: 1.45, fontSize: 16 }}>{item.desc}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {priceEntries.map(([size, price]) => (
                              <div key={size} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
                                {priceEntries.length > 1 && <span style={{ fontSize: 11, color: '#c9a84c66', textTransform: 'uppercase' }}>{size}</span>}
                                <strong style={{ display: 'block', fontFamily: "'Bebas Neue'", fontSize: 20, color: '#c9a84c' }}>{fmt(price)}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => onAdd(item, firstPrice)}
                          style={{
                            width: '100%',
                            padding: '10px 0',
                            border: '1px solid rgba(201,168,76,0.25)',
                            borderRadius: 3,
                            background: inCart ? 'rgba(201,168,76,0.2)' : '#c9a84c',
                            color: inCart ? '#f5efe6' : '#0d0b08',
                            cursor: 'pointer',
                            fontFamily: "'Cormorant Garamond'",
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {inCart ? `Agregar otro (${inCart.qty})` : 'Agregar al pedido'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'rgba(245,239,230,0.75)', fontFamily: "'Cormorant Garamond'", fontSize: 16 }}>Al final puedes pulsar el botón y coordinar tu pedido con el asesor por WhatsApp.</div>
            <button onClick={onCartOpen} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 4, border: 'none', background: '#25D366', color: '#0d0b08', fontFamily: "'Cormorant Garamond'", fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              <ShoppingCart size={18} /> Abrir pedido
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 40 }}>
            {GALLERY_IMAGES.slice(0, 3).map((img, index) => (
              <div key={index} style={{ overflow: 'hidden', borderRadius: 4, position: 'relative', minHeight: 180 }}>
                <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'transform 0.8s ease', filter: 'brightness(0.85)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(13,11,8,0.8))' }} />
                <span style={{ position: 'absolute', bottom: 16, left: 16, color: '#f5efe6', fontFamily: "'Cormorant Garamond'", fontSize: 14 }}>{img.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes backgroundShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes floatBubble {
          0% {
            bottom: -100px;
            opacity: 0;
            transform: translateX(0) scale(0.5);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: 100vh;
            opacity: 0;
            transform: translateX(100px) scale(1);
          }
        }
      `}</style>
    </main>
  );
}