import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGaleria } from './api';
import { toMediaUrl } from './config';

function toUrl(url) {
  return toMediaUrl(url) || '';
}

export default function Gallery() {
  const [images, setImages]   = useState([]);   // siempre array
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef(null);

  // ── Cargar galería desde la API ───────────────────────────
  useEffect(() => {
    getGaleria(true)
      .then(data => {
        const mapped = Array.isArray(data)
          ? data.map(item => ({ url: toUrl(item.url), caption: item.caption || '' }))
          : [];
        setImages(mapped);
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  // Teclado en lightbox
  useEffect(() => {
    if (current === null || images.length === 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape')      setCurrent(null);
      if (e.key === 'ArrowRight')  setCurrent(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft')   setCurrent(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, images.length]);

  useEffect(() => {
    setZoomLevel(0);
    setZoomOrigin('50% 50%');
    setIsPlaying(false);
  }, [current]);

  useEffect(() => {
    if (current === null || !isPlaying || images.length < 2) return undefined;
    const timer = window.setInterval(() => setCurrent(index => (index + 1) % images.length), 2000);
    return () => window.clearInterval(timer);
  }, [current, images.length, isPlaying]);

  useEffect(() => {
    if (current === null) return undefined;
    window.history.pushState({ galleryViewer: true }, '', window.location.href);
    const onBack = () => setCurrent(null);
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, [current === null]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = current !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [current]);

  const layouts = [
    { gridColumn: "1 / 2", gridRow: "1 / 3", aspect: "auto"  },
    { gridColumn: "2 / 3", gridRow: "1 / 2", aspect: "4/3"   },
    { gridColumn: "3 / 4", gridRow: "1 / 2", aspect: "4/3"   },
    { gridColumn: "2 / 3", gridRow: "2 / 3", aspect: "4/3"   },
    { gridColumn: "3 / 4", gridRow: "2 / 3", aspect: "4/3"   },
    { gridColumn: "1 / 3", gridRow: "3 / 4", aspect: "16/7"  },
    { gridColumn: "3 / 4", gridRow: "3 / 4", aspect: "4/3"   },
  ];

  const mainImages  = images.slice(0, 7);
  const extraImages = images.slice(7);

  const handleImageZoom = (event) => {
    setIsPlaying(false);
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`);
    setZoomLevel(level => (level + 1) % 4);
  };

  return (
    <section
      ref={sectionRef}
      id="galeria"
      style={{ position: "relative", padding: "100px clamp(16px,4vw,60px) 120px", overflow: "hidden" }}
    >
      <div className="gallery-bg-layer" />

      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "none",
        pointerEvents: "none"
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <p style={{ fontSize: 11, letterSpacing: "0.35em", color: "var(--primary)", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Cormorant Garamond'" }}>
            — Galería —
          </p>
          <h2 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "clamp(28px,4.5vw,60px)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 0.95, marginBottom: 24 }}>
            Nuestras<br />
            <span style={{ background: "linear-gradient(90deg,#B8862E 0%,#D8B16A 50%,#B8862E 100%)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s infinite linear" }}>
              Creaciones
            </span>
          </h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#7A6E65", fontFamily: "'Cormorant Garamond'", fontSize: 17, lineHeight: 1.85, fontWeight: 300 }}>
            Cada pieza nace del silencio del desierto y la sabiduría de manos que tejen historia desde hace siglos.
          </p>
        </motion.div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9A8E84", fontFamily: "'Cormorant Garamond'", fontSize: 16 }}>
            Cargando galería...
          </div>
        )}

        {/* ── Sin imágenes ── */}
        {!loading && images.length === 0 && (
          <p style={{ textAlign: "center", color: "#9A8E84", fontFamily: "'Cormorant Garamond'", fontSize: 16, padding: "60px 0" }}>
            Aún no hay imágenes en la galería.
          </p>
        )}

        {/* ── Bento Grid ── */}
        {!loading && images.length > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, auto)", gap: 16 }}>
              {mainImages.map((img, i) => {
                const layout = layouts[i] || { gridColumn: "auto", gridRow: "auto", aspect: "4/3" };
                return (
                  <motion.button
                    key={i}
                    type="button"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    onHoverStart={() => setHovered(i)}
                    onHoverEnd={() => setHovered(null)}
                    onClick={() => setCurrent(i)}
                    style={{
                      gridColumn: layout.gridColumn,
                      gridRow: layout.gridRow,
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 20,
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      aspectRatio: layout.aspect,
                      minHeight: i === 0 ? "min(480px, 38vh)" : "min(220px, 26vh)",
                      background: "#F0E8D8",
                      boxShadow: hovered === i
                        ? "0 32px 80px rgba(184,134,46,0.22), 0 0 0 2px rgba(184,134,46,0.3)"
                        : "0 8px 32px rgba(0,0,0,0.08)",
                      transition: "box-shadow 0.4s ease",
                    }}
                  >
                    <motion.img
                      src={img.url}
                      alt={img.caption}
                      loading={i < 2 ? "eager" : "lazy"}
                      fetchPriority={i < 2 ? "high" : "low"}
                      decoding="async"
                      animate={{ scale: hovered === i ? 1.08 : 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: hovered === i
                        ? "linear-gradient(180deg, rgba(0,0,0,0.04) 40%, rgba(18,12,6,0.72) 100%)"
                        : "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.45) 100%)",
                      transition: "background 0.4s ease"
                    }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 18px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                      <motion.span
                        animate={{ opacity: hovered === i ? 1 : 0.7, y: hovered === i ? 0 : 6 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontFamily: "'Cormorant Garamond'", fontSize: i === 0 ? 15 : 13, color: "#FFF", letterSpacing: "0.05em", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                      >
                        {img.caption}
                      </motion.span>
                      <motion.div
                        animate={{ opacity: hovered === i ? 1 : 0, scale: hovered === i ? 1 : 0.7 }}
                        transition={{ duration: 0.25 }}
                        style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                      >
                        <ZoomIn size={16} />
                      </motion.div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* ── Strip de imágenes extra ── */}
            {extraImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: "flex", gap: 12, marginTop: 16, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}
              >
                {extraImages.map((img, i) => (
                  <motion.button
                    key={i + 7}
                    type="button"
                    whileHover={{ scale: 1.04, boxShadow: "0 16px 40px rgba(184,134,46,0.2)" }}
                    onClick={() => setCurrent(i + 7)}
                    style={{ flexShrink: 0, width: 'min(180px, 36vw)', height: 'min(140px, 28vw)', borderRadius: 14, overflow: "hidden", border: "none", padding: 0, cursor: "pointer", position: "relative", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  >
                    <img src={img.url} alt={img.caption} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
                    <span style={{ position: "absolute", bottom: 10, left: 12, fontFamily: "'Cormorant Garamond'", fontSize: 12, color: "#FFF", letterSpacing: "0.04em" }}>
                      {img.caption}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {current !== null && images[current] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "fixed", inset: 0, zIndex: 2147483000, background: "rgba(255,255,255,0.98)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={() => setCurrent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className="gallery-lightbox-frame"
              style={{ position: "relative", width: "min(92vw, 980px)", maxHeight: "calc(100vh - 40px)", borderRadius: 16, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 18px 60px rgba(45,31,17,0.16)", border: "1px solid rgba(184,134,46,0.25)", display: "flex", flexDirection: "column" }}
            >
              {/* Foto + controles anclados a la foto */}
              <div className="gallery-lightbox-imgwrap" style={{ position: "relative", flex: "1 1 auto", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
                <AnimatePresence mode="wait">
                  <img
                    key={current}
                    src={images[current].url}
                    alt={images[current].caption}
                    onClick={handleImageZoom}
                    className="gallery-lightbox-image"
                    style={{ display: "block", maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", background: "#FFFFFF", cursor: "zoom-in", transform: `scale(${zoomLevel === 0 ? 1 : zoomLevel === 1 ? 1.5 : zoomLevel === 2 ? 2 : 2.7})`, transformOrigin: zoomOrigin, transition: "transform 0.25s ease" }}
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <button onClick={() => setIsPlaying(value => !value)} aria-label={isPlaying ? "Pausar presentación" : "Reproducir presentación"}
                    style={{ position: "absolute", top: 14, left: 14, zIndex: 4, padding: "10px 14px", borderRadius: 999, border: "1px solid rgba(184,134,46,0.55)", background: isPlaying ? "#B8862E" : "rgba(255,255,255,0.96)", color: isPlaying ? "#FFF" : "#6B4B1F", cursor: "pointer", font: "600 12px Inter, sans-serif", boxShadow: "0 5px 16px rgba(45,31,17,0.16)" }}>
                    {isPlaying ? "Pausar" : "Reproducir"}
                  </button>
                )}

                {images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                      onClick={e => { e.stopPropagation(); setCurrent(i => (i - 1 + images.length) % images.length); }}
                      className="gallery-lightbox-arrow left" aria-label="Foto anterior">
                      <ChevronLeft size={24} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                      onClick={e => { e.stopPropagation(); setCurrent(i => (i + 1) % images.length); }}
                      className="gallery-lightbox-arrow right" aria-label="Foto siguiente">
                      <ChevronRight size={24} />
                    </motion.button>
                  </>
                )}

                <button
                  onClick={() => setCurrent(null)}
                  aria-label="Cerrar galería"
                  className="gallery-lightbox-close">
                  <X size={18} />
                </button>
              </div>

              {/* Caption: siempre visible completo, sin scroll */}
              <div style={{ flex: "0 0 auto", position: "relative", padding: "14px 20px 16px", background: "#FFFFFF", borderTop: "1px solid rgba(184,134,46,0.16)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: "1 1 70%", minWidth: 0 }}>
                  <p style={{ maxWidth: "100%", overflowWrap: "anywhere", fontFamily: "'Cormorant Garamond'", fontSize: 17, color: "#3F3024", margin: 0, letterSpacing: "0.04em", lineHeight: 1.35 }}>
                    {images[current].caption}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond'", fontSize: 13, color: "#8A7768", margin: "4px 0 0", letterSpacing: "0.12em" }}>
                    {current + 1} / {images.length}
                  </p>
                </div>
                {images.length > 1 && (
                  <div style={{ display: "flex", gap: 6 }}>
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setCurrent(i)}
                        style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? "var(--primary)" : "rgba(94,67,35,0.25)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-lightbox-imgwrap { min-height: 220px; }
        .gallery-lightbox-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(184,134,46,0.55);
          color: #6B4B1F; display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 3; box-shadow: 0 8px 24px rgba(45,31,17,0.18);
          transition: background 0.2s ease;
        }
        .gallery-lightbox-arrow:hover { background: rgba(184,134,46,0.35); }
        .gallery-lightbox-arrow.left { left: 14px; }
        .gallery-lightbox-arrow.right { right: 14px; }
        .gallery-lightbox-close {
          position: absolute; top: 14px; right: 14px; z-index: 3;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(184,134,46,0.55);
          color: #6B4B1F; display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 8px 24px rgba(45,31,17,0.18);
        }
        @media (max-width: 640px) {
          .gallery-lightbox-frame { width: 100% !important; max-height: calc(100vh - 24px) !important; }
          .gallery-lightbox-imgwrap { min-height: 180px; }
          .gallery-lightbox-arrow { width: 46px !important; height: 46px !important; }
          .gallery-lightbox-close { width: 40px !important; height: 40px !important; top: 10px !important; right: 10px !important; }
        }
        .gallery-bg-layer {
          position: absolute; inset: 0; z-index: 0;
          background: #FFFFFF;
        }
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
}