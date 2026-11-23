import { useEffect, useRef, useState } from 'react';
import { NAV } from '../data/content';
import { subscribeScroll } from '../hooks/scrollBus';
import { useCart } from '../hooks/useCart';
import { link } from '../router';
import Logo from './Logo';
import { Icon } from './Icons';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ page }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const bar = useRef(null);
  const cart = useCart();

  useEffect(
    () =>
      subscribeScroll((y) => {
        setSolid((s) => (s === y > 40 ? s : y > 40));
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
      }),
    []
  );

  useEffect(() => {
    if (page !== 'home') { setActive(''); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [page]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  const barOn = solid || open || page !== 'home';
  const close = () => setOpen(false);

  return (
    <header className={`lt-green fixed inset-x-0 top-0 z-50 transition-[background-color,padding,box-shadow] duration-500 ${barOn ? 'bg-s1/90 py-2.5 shadow-[0_1px_0_rgb(var(--fg)/.08)] backdrop-blur-md' : 'py-5'}`}>
      <div className="container-x flex items-center justify-between gap-4">
        <a {...link('#inicio', close)} aria-label="Jugos Bar, inicio" className="block">
          <Logo className={`w-auto text-fg transition-all duration-500 ${barOn ? 'h-10' : 'h-12'}`} />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map(([id, label]) => (
            <a key={id} {...link(`#${id}`)} className={`relative px-4 py-2 font-body text-[14px] font-bold uppercase tracking-[.08em] transition-colors ${active === id ? 'text-acc' : 'text-fg/75 hover:text-fg'}`}>
              {label}
              <span className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded bg-acc transition-transform duration-500 ${active === id ? 'scale-x-100' : 'scale-x-0'}`} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {cart.count > 0 && (
            <button type="button" onClick={() => cart.setOpen(true)} aria-label={`Abrir carrito, ${cart.count} productos`} className="relative grid h-11 w-11 place-items-center rounded-full bg-fg text-inv transition-transform hover:scale-105 active:scale-95">
              <Icon name="bag" className="h-5 w-5" />
              <span key={cart.pulse} className="bump absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-ink lt:bg-ink lt:text-white">{cart.count}</span>
            </button>
          )}
          <a {...link('#/menu', close)} className="btn btn-green hidden py-2.5 sm:inline-flex">Ver menú</a>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} className="grid h-11 w-11 place-items-center rounded-full border border-fg/20 text-fg lt:border-white/60 lg:hidden">
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      <span ref={bar} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-acc" style={{ transform: 'scaleX(0)' }} />

      <div className={`fixed inset-x-0 bottom-0 top-[64px] overflow-y-auto bg-s1 transition-[opacity,transform] duration-500 lg:hidden ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'}`}>
        <nav className="container-x flex flex-col py-6" aria-label="Móvil">
          {[['inicio', 'Inicio'], ...NAV].map(([id, label], i) => (
            <a key={id} {...link(`#${id}`, close)} style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }} className={`border-b border-fg/10 py-3.5 font-display text-5xl font-extrabold uppercase transition-[opacity,transform] duration-500 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'} ${active === id ? 'text-acc' : 'text-fg'}`}>
              {label}
            </a>
          ))}
          <a {...link('#/menu', close)} className="btn btn-green mt-8 self-start">Ver menú por sede</a>
        </nav>
      </div>
    </header>
  );
}
