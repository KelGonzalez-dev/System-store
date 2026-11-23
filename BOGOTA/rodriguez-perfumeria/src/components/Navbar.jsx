import { useEffect, useRef, useState } from 'react';
import { LOGO, NAV, waLink } from '../data/content';
import { subscribeScroll } from '../hooks/scrollBus';
import { link } from '../router';
import { Icon, WhatsAppIcon } from './Icons';

export default function Navbar({ route }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const bar = useRef(null);

  useEffect(
    () =>
      subscribeScroll((y) => {
        setSolid((s) => (s === y > 50 ? s : y > 50));
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
      }),
    []
  );

  useEffect(() => {
    if (route !== 'home') { setActive(''); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [route]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  const barOn = solid || open || route !== 'home';
  const close = () => setOpen(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-500 ${barOn ? 'hairline border-b bg-ink/90 py-2.5 backdrop-blur-md' : 'border-b border-transparent py-5'}`}>
      <div className="container-x flex items-center justify-between gap-4">
        <a {...link('#inicio', close)} className="flex items-center gap-3" aria-label="Rodriguez Perfumería">
          <img src={LOGO} alt="" className={`rounded-full border border-gold/50 bg-ink object-cover transition-all duration-500 ${barOn ? 'h-10 w-10' : 'h-12 w-12'}`} draggable="false" />
          <span className="leading-none">
            <span className="block font-display text-[1.7rem] tracking-[.08em] text-ivory">Rodriguez</span>
            <span className="mt-1 block font-cond text-[11px] font-semibold uppercase tracking-[.5em] text-gold">Perfumería</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Principal">
          {NAV.map(([id, label]) => (
            <a key={id} {...link(`#${id}`)} className={`relative px-4 py-2 font-cond text-[17px] font-semibold uppercase tracking-[.16em] transition-colors ${active === id ? 'text-gold-light' : 'text-ivory/75 hover:text-ivory'}`}>
              {label}
              <span className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ${active === id ? 'scale-x-100' : 'scale-x-0'}`} style={{ boxShadow: '0 0 8px #d4af6a' }} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a {...link('#/catalogo', close)} className="btn btn-line hidden py-2.5 lg:inline-flex">Catálogo</a>
          <a href={waLink('Hola Rodriguez Perfumería, quiero información.')} target="_blank" rel="noopener noreferrer" className="btn btn-gold hidden py-2.5 sm:inline-flex"><WhatsAppIcon className="h-4 w-4" />Pedir</a>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} className="hairline grid h-11 w-11 place-items-center rounded-full border text-ivory xl:hidden">
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      <span ref={bar} className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-gold-deep via-gold-light to-gold" style={{ transform: 'scaleX(0)', boxShadow: '0 0 10px rgba(212,175,106,.8)' }} />

      <div className={`fixed inset-x-0 bottom-0 top-[64px] overflow-y-auto bg-ink transition-[opacity,transform] duration-500 xl:hidden ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'}`}>
        <nav className="container-x flex flex-col py-6" aria-label="Móvil">
          {[['inicio', 'Inicio'], ...NAV].map(([id, label], i) => (
            <a key={id} {...link(`#${id}`, close)} style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }} className={`hairline border-b py-3 font-display text-5xl uppercase transition-[opacity,transform] duration-500 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'} ${active === id ? 'glow-gold' : 'text-ivory/85'}`}>
              {label}
            </a>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <a {...link('#/catalogo', close)} className="btn btn-line">Ver catálogo</a>
            <a href={waLink('Hola Rodriguez Perfumería, quiero información.')} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WhatsAppIcon className="h-4 w-4" />WhatsApp</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
