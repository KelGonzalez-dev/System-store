import React, { useRef, useEffect, useState } from 'react';
import { Instagram, MessageCircle, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { WA_NUMBER } from './data';

// ─── 3D CANVAS BACKGROUND ─────────────────────────────────────────────────

function FloatingOrbs() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let lastFrame = 0;

    // En móvil se reduce drásticamente el trabajo: menos orbes, menor
    // resolución de canvas y menos fps. Este bucle de rAF redibujando
    // gradientes radiales sin límite era la causa principal de que la
    // página se sintiera "trabada" al hacer scroll en teléfonos.
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const orbCount = isMobile ? 6 : 18;
    const targetFps = isMobile ? 24 : 60;
    const frameInterval = 1000 / targetFps;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    // Orbs config
    const orbs = Array.from({ length: orbCount }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      r: 40 + Math.random() * 120,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: 0.04 + Math.random() * 0.09,
      hue: Math.random() > 0.5 ? 40 : 35, // gold range
    }));

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return; // no gastar batería/CPU en pestañas ocultas
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;

      ctx.clearRect(0, 0, w(), h());
      orbs.forEach(o => {
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `hsla(${o.hue}, 72%, 48%, ${o.opacity})`);
        grad.addColorStop(1, `hsla(${o.hue}, 72%, 48%, 0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        o.x += o.dx;
        o.y += o.dy;
        if (o.x < -o.r) o.x = w() + o.r;
        if (o.x > w() + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h() + o.r;
        if (o.y > h() + o.r) o.y = -o.r;
      });
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0
    }} />
  );
}

// ─── ANIMATED GRID LINES ──────────────────────────────────────────────────

function GridLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.035, pointerEvents: "none" }}>
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#B8862E" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// ─── CONTACT CARD ──────────────────────────────────────────────────────────

function ContactCard({ icon, title, content, link, delay, accent }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{ position: "relative" }}
    >
      {/* Glow behind card */}
      <motion.div
        animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.8 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: -20, zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(184,134,46,0.18) 0%, transparent 70%)",
          borderRadius: 40, pointerEvents: "none"
        }}
      />

      <motion.div
        animate={{ y: hov ? -6 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative", zIndex: 1,
          background: hov
            ? "linear-gradient(145deg, rgba(255,252,247,0.98), rgba(248,240,229,0.95))"
            : "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(250,245,238,0.88))",
          border: `1px solid ${hov ? "rgba(184,134,46,0.35)" : "rgba(184,134,46,0.14)"}`,
          borderRadius: 28,
          padding: "40px 32px 36px",
          textAlign: "center",
          backdropFilter: "blur(16px)",
          boxShadow: hov
            ? "0 40px 80px rgba(184,134,46,0.16), 0 2px 0 rgba(184,134,46,0.3) inset"
            : "0 20px 50px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.8) inset",
          transition: "background 0.3s, border 0.3s, box-shadow 0.3s"
        }}
      >
        {/* Icon ring */}
        <motion.div
          animate={{ rotate: hov ? 10 : 0, scale: hov ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: 64, height: 64, borderRadius: "50%",
            background: hov
              ? "linear-gradient(135deg, #B8862E 0%, #E6C98A 100%)"
              : "linear-gradient(135deg, rgba(184,134,46,0.12) 0%, rgba(230,201,138,0.12) 100%)",
            border: `1.5px solid ${hov ? "transparent" : "rgba(184,134,46,0.22)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: hov ? "0 12px 32px rgba(184,134,46,0.35)" : "none",
            transition: "all 0.4s"
          }}
        >
          {React.cloneElement(icon, { color: hov ? "#FFF" : "#B8862E", size: 26 })}
        </motion.div>

        <h3 style={{
          fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 600,
          color: "#1A1A1A", marginBottom: 10, letterSpacing: "0.01em"
        }}>
          {title}
        </h3>

        {link ? (
          <a href={link} target="_blank" rel="noreferrer" style={{
            color: "var(--primary)", textDecoration: "none",
            fontFamily: "'Cormorant Garamond'", fontSize: 16, letterSpacing: "0.03em",
            borderBottom: "1px solid transparent",
            transition: "border-color 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.borderBottomColor = "var(--primary)"}
            onMouseLeave={e => e.currentTarget.style.borderBottomColor = "transparent"}
          >
            {content}
          </a>
        ) : (
          <p style={{
            color: "#6B6259", fontFamily: "'Cormorant Garamond'",
            fontSize: 16, margin: 0, letterSpacing: "0.02em"
          }}>
            {content}
          </p>
        )}

        {/* Bottom accent line */}
        <motion.div
          animate={{ scaleX: hov ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            height: 2, background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
            borderRadius: 2, marginTop: 24, transformOrigin: "center"
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN CONTACT ──────────────────────────────────────────────────────────

export default function Contact() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const cards = [
    {
      icon: <MapPin />,
      title: "Ubicación",
      content: "Riohacha, La Guajira, Colombia",
      delay: 0.1
    },
    {
      icon: <Phone />,
      title: "WhatsApp",
      content: "+57 301 6507487",
      link: `https://wa.me/573016507487`,
      delay: 0.2
    },
    {
      icon: <MessageCircle />,
      title: "Email",
      content: "info@guairabags.com",
      delay: 0.3
    },
  ];

  const socials = [
    { name: "Instagram", icon: <Instagram size={20} />, url: "https://instagram.com", label: "Síguenos" },
    { name: "WhatsApp", icon: <MessageCircle size={20} />, url: `https://wa.me/${WA_NUMBER}`, label: "Escríbenos" },
  ];

  return (
    <section
      id="contacto"
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "120px clamp(16px,4vw,60px) 100px",
        overflow: "hidden",
        background: "linear-gradient(180deg, #F6F0E7 0%, #FBF7F0 40%, #F2EAD8 100%)"
      }}
    >
      <FloatingOrbs />
      <GridLines />

      {/* Large decorative text */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontFamily: "'Playfair Display'",
        fontSize: "clamp(100px, 18vw, 260px)",
        fontWeight: 900, color: "rgba(184,134,46,0.04)",
        whiteSpace: "nowrap", userSelect: "none", zIndex: 0,
        letterSpacing: "-0.05em", lineHeight: 1
      }}>
        Contacto
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "8px 20px", borderRadius: 100,
                background: "rgba(184,134,46,0.08)",
                border: "1px solid rgba(184,134,46,0.2)",
                marginBottom: 24
              }}
            >
              <Sparkles size={14} color="var(--primary)" />
              <span style={{
                fontSize: 11, letterSpacing: "0.25em", color: "var(--primary)",
                textTransform: "uppercase", fontFamily: "'Cormorant Garamond'"
              }}>
                Estamos para ti
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: "'Playfair Display'",
                fontSize: "clamp(44px, 6vw, 80px)",
                fontWeight: 700, color: "#1A1A1A", lineHeight: 0.92, marginBottom: 24
              }}
            >
              ¿Hablamos?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontFamily: "'Cormorant Garamond'", fontSize: 17, color: "#7A6E65",
                maxWidth: 520, margin: "0 auto", lineHeight: 1.85, fontWeight: 300
              }}
            >
              Cada mochila es una historia. Cuéntanos la tuya y encontraremos la pieza perfecta para ti.
            </motion.p>
          </div>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
          marginBottom: 80
        }}>
          {cards.map(c => (
            <ContactCard key={c.title} {...c} />
          ))}
        </div>

        {/* CTA & Socials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ textAlign: "center" }}
        >
          {/* Primary CTA */}
          <motion.a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola! Quisiera obtener más información sobre sus mochilas Wayuu.")}`}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, boxShadow: "0 24px 60px rgba(184,134,46,0.4)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "18px 44px",
              background: "linear-gradient(135deg, #B8862E 0%, #D4A84B 50%, #B8862E 100%)",
              backgroundSize: "200%",
              color: "#FFF", borderRadius: 100,
              fontFamily: "'Cormorant Garamond'", fontSize: 18, fontWeight: 600,
              textDecoration: "none", letterSpacing: "0.04em",
              boxShadow: "0 16px 48px rgba(184,134,46,0.3)",
              marginBottom: 48,
              animation: "shimmerBtn 3s infinite linear",
              transition: "box-shadow 0.3s"
            }}
          >
            <MessageCircle size={20} />
            Escríbenos por WhatsApp
            <Send size={16} />
          </motion.a>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36, maxWidth: 320, margin: "0 auto 36px" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(184,134,46,0.3))" }} />
            <span style={{ fontSize: 12, color: "#B0A499", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Cormorant Garamond'" }}>
              Redes
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(184,134,46,0.3), transparent)" }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {socials.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(184,134,46,0.3)" }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 28px",
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(184,134,46,0.2)",
                  borderRadius: 100,
                  color: "#1A1A1A", textDecoration: "none",
                  fontFamily: "'Cormorant Garamond'", fontSize: 15,
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.3s"
                }}
              >
                <span style={{ color: "var(--primary)" }}>{s.icon}</span>
                {s.label} en {s.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmerBtn {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
}