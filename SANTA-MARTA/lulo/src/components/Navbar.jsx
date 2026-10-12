import { useEffect, useState } from 'react';
import { NAV_IDS } from '../data/content';
import { useLang } from '../i18n/LangContext';
import { subscribeScroll } from '../hooks/scrollBus';
import { Icon } from './Icons';
import LangToggle from './LangToggle';

const LABEL = { inicio: 'home', concepto: 'concept', carta: 'menu', casas: 'locations', galeria: 'gallery', ciudad: 'city', reservas: 'contact' };

export default function Navbar() {
  const { t } = useLang();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');

  useEffect(() => subscribeScroll((y) => setSolid((s) => (s === y > 50 ? s : y > 50))), []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    NAV_IDS.forEach((id) => {
      const el = document.getElementById(id);
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

  const bar = solid || open;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-500 ${bar ? 'border-b border-neon/10 bg-night/90 py-2.5' : 'border-b border-transparent bg-transparent py-5'}`}>
      <div className="container-x flex items-center justify-between gap-4">
        <a href="#inicio" onClick={() => setOpen(false)} className="flex items-center gap-3" aria-label="Lulo Café Bar">
          <img src="/logo.webp" alt="" className={`rounded-full transition-all duration-500 ${bar ? 'h-9 w-9' : 'h-11 w-11'}`} draggable="false" />
          <span className="font-display text-2xl font-extralight tracking-[.18em] text-neon">lulo</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV_IDS.filter((id) => id !== 'inicio').map((id) => (
            <a key={id} href={`#${id}`} className={`relative px-3.5 py-2 font-display text-[12px] font-medium uppercase tracking-[.22em] transition-colors ${active === id ? 'text-neon' : 'text-neon/60 hover:text-neon'}`}>
              {t.nav[LABEL[id]]}
              <span className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-ember-light transition-transform duration-500 ${active === id ? 'scale-x-100' : 'scale-x-0'}`} style={{ boxShadow: '0 0 8px #ff7a2f' }} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle className="hidden sm:inline-flex" />
          <a href="#reservas" className="btn btn-neon hidden py-2.5 sm:inline-flex">{t.nav.reserve}</a>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t.nav.close : t.nav.menuLabel} className="grid h-11 w-11 place-items-center rounded-full border border-neon/25 text-neon lg:hidden">
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className={`fixed inset-x-0 bottom-0 top-[60px] overflow-y-auto bg-night transition-[opacity,transform] duration-500 lg:hidden ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'}`}>
        <nav className="container-x flex flex-col py-6" aria-label="Móvil">
          {NAV_IDS.map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
              className={`border-b border-neon/10 py-4 font-display text-3xl font-extralight tracking-tight transition-[opacity,transform] duration-500 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'} ${active === id ? 'neon-text' : 'text-neon/80'}`}
            >
              {t.nav[LABEL[id]]}
            </a>
          ))}
          <div className="mt-8 flex items-center justify-between gap-4">
            <LangToggle />
            <a href="#reservas" onClick={() => setOpen(false)} className="btn btn-solid">{t.nav.reserve}</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
