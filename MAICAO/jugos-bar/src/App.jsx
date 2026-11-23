import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from './loader/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import CartDrawer from './components/CartDrawer';
import { Mark } from './components/Logo';
import { CartProvider } from './hooks/useCart';
import Hero from './sections/Hero';
import Ticker from './sections/Ticker';
import Sedes from './sections/Sedes';
import Favoritos from './sections/Favoritos';
import Resenas from './sections/Resenas';
import Steps from './sections/Steps';
import Galeria from './sections/Galeria';
import Menu from './pages/Menu';

const parse = () => {
  const h = window.location.hash;
  if (h.startsWith('#/menu')) return { page: 'menu', sede: h.split('/')[2] || null };
  return { page: 'home', sede: null };
};

export default function App() {
  const [route, setRoute] = useState(parse);
  const [curtain, setCurtain] = useState('idle');
  const pending = useRef(null);
  const onLeave = useCallback(() => document.documentElement.classList.add('ready'), []);

  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onGo = (e) => {
      const target = e.detail;
      const next = target.startsWith('#/menu') ? { page: 'menu', sede: target.split('/')[2] || null } : { page: 'home', sede: null };
      const now = parse();
      if (next.page === 'home' && now.page === 'home') {
        document.getElementById(target.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (next.page === now.page && next.sede === now.sede) return;
      pending.current = next.page === 'home' ? target.slice(1) : null;
      setCurtain('in');
      setTimeout(() => {
        window.location.hash = target;
        setRoute(next);
        window.scrollTo(0, 0);
        setCurtain('out');
        setTimeout(() => setCurtain('idle'), 750);
      }, 600);
    };
    window.addEventListener('jb:go', onGo);
    return () => window.removeEventListener('jb:go', onGo);
  }, []);

  useEffect(() => {
    if (route.page !== 'home' || !pending.current) return;
    const id = pending.current;
    pending.current = null;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'auto' }), 60);
    return () => clearTimeout(t);
  }, [route]);

  return (
    <CartProvider>
      <Loader onLeave={onLeave} />
      <Navbar page={route.page} />
      {route.page === 'home' ? (
        <main>
          <Hero />
          <Ticker />
          <Sedes />
          <Favoritos />
          <Resenas />
          <Steps />
          <Galeria />
        </main>
      ) : (
        <Menu sedeId={route.sede} />
      )}
      <Footer />
      {route.page === 'home' && <WhatsAppFab />}
      <CartDrawer />
      {curtain !== 'idle' && (
        <div className={`curtain ${curtain === 'in' ? 'cv-in' : 'cv-out'}`} aria-hidden="true" style={{ '--knock': '#62bf00' }}>
          <Mark className="animate-floaty h-32 w-auto text-white" />
        </div>
      )}
    </CartProvider>
  );
}
