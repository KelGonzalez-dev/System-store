import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { getGaleria } from './api';

const API_BASE = 'http://localhost:5000';

function toUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

export default function Gallery() {
  const [images, setImages]   = useState([]);   // siempre array
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [hovered, setHovered] = useState(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

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

  return (
    <section
      ref={sectionRef}
      id="galeria"
      style={{ position: "relative", padding: "100px clamp(16px,4vw,60px) 120px", overflow: "hidden" }}
    >
      <motion.div style={{ y: bgY }} className="gallery-bg-layer" />

      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
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
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(38px,5.5vw,72px)", fontWeight: 700, color: "#1A1A1A", lineHeight: 0.95, marginBottom: 24 }}>
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
                      minHeight: i === 0 ? 480 : 220,
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
                    style={{ flexShrink: 0, width: 180, height: 140, borderRadius: 14, overflow: "hidden", border: "none", padding: 0, cursor: "pointer", position: "relative", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  >
                    <img src={img.url} alt={img.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
            style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(6,4,2,0.94)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setCurrent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ position: "relative", maxWidth: "88vw", maxHeight: "88vh", borderRadius: 24, overflow: "hidden", boxShadow: "0 80px 160px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,134,46,0.15)" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={images[current].url}
                  alt={images[current].caption}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "block", maxWidth: "88vw", maxHeight: "82vh", width: "auto", height: "auto", objectFit: "contain" }}
                />
              </AnimatePresence>

              {/* Caption */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 28px 22px", background: "linear-gradient(180deg, transparent, rgba(8,5,2,0.85))", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond'", fontSize: 16, color: "#F7E3B7", margin: 0, letterSpacing: "0.06em" }}>
                    {images[current].caption}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond'", fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "4px 0 0", letterSpacing: "0.12em" }}>
                    {current + 1} / {images.length}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? "var(--primary)" : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Flechas */}
            {[
              { dir: -1, icon: <ChevronLeft size={24} />, side: "left" },
              { dir:  1, icon: <ChevronRight size={24} />, side: "right" }
            ].map(({ dir, icon, side }) => (
              <motion.button
                key={side}
                whileHover={{ scale: 1.1, background: "rgba(184,134,46,0.25)" }}
                whileTap={{ scale: 0.95 }}
                onClick={e => { e.stopPropagation(); setCurrent(i => (i + dir + images.length) % images.length); }}
                style={{ position: "absolute", [side]: 24, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                {icon}
              </motion.button>
            ))}

            {/* Cerrar */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCurrent(null)}
              style={{ position: "absolute", top: 24, right: 24, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <X size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-bg-layer {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(184,134,46,0.07) 0%, transparent 70%),
                      linear-gradient(180deg, #F6F0E7 0%, #FAF5EE 100%);
        }
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
}