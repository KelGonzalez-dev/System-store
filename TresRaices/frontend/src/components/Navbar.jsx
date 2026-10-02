import { useEffect, useState } from 'react';
import { NAV, BRAND, waLink } from '../data/content';
import { subscribeScroll } from '../hooks/scrollBus';
import { Icon, WhatsAppIcon } from './Icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');

  useEffect(() => subscribeScroll((y) => setScrolled((s) => (s === y > 40 ? s : y > 40))), []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ${
        solid ? 'bg-cream/95 py-2 shadow-[0_6px_24px_-12px_rgba(2,55,20,.35)]' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4">
        <a href="#inicio" onClick={() => setOpen(false)} className="flex items-center gap-3" aria-label="Tres Raíces, inicio">
          <img src="/logo.webp" alt="" className={`transition-all duration-500 ${solid ? 'h-10' : 'h-12'} w-auto`} draggable="false" />
          <span className="leading-tight">
            <span className={`block font-display text-xl font-bold transition-colors duration-500 ${solid ? 'text-forest' : 'text-white'}`}>{BRAND.name}</span>
            <span className={`block text-[11px] font-semibold transition-colors duration-500 ${solid ? 'text-leaf' : 'text-white/80'}`}>{BRAND.type}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`group relative px-3 py-2 text-[14px] font-semibold transition-colors ${
                solid ? 'text-ink hover:text-leaf' : 'text-white/90 hover:text-white'
              }`}
            >
              {n.label}
              <span
                className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-500 ${
                  solid ? 'bg-leaf' : 'bg-gold-light'
                } ${active === n.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn hidden bg-leaf py-2.5 text-white hover:bg-forest sm:inline-flex">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden ${solid ? 'text-forest' : 'text-white'}`}
          >
            <Icon name={open ? 'close' : 'menu'} className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[60px] overflow-y-auto bg-cream transition-[opacity,transform] duration-500 lg:hidden ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <nav className="container-x flex flex-col py-6" aria-label="Móvil">
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 45}ms` : '0ms' }}
              className={`border-b border-ink/10 py-4 font-display text-2xl font-bold transition-[opacity,transform] duration-500 ${
                open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              } ${active === n.id ? 'text-leaf' : 'text-forest'}`}
            >
              {n.label}
            </a>
          ))}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-leaf text-white">
            <WhatsAppIcon /> Escríbenos por WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
