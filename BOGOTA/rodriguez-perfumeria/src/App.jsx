import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Loader from './loader/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import Scene from './sections/Scene';
import Categories from './sections/Categories';
import Atelier from './sections/Atelier';
import Stats from './sections/Stats';
import Finder from './sections/Finder';
import Contact from './sections/Contact';
import { LOGO } from './data/content';

const Catalog = lazy(() => import('./pages/Catalog'));

const getRoute = () => (window.location.hash.startsWith('#/catalogo') ? 'catalog' : 'home');

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [curtain, setCurtain] = useState('idle');
  const pending = useRef(null);
  const onLeave = useCallback(() => document.documentElement.classList.add('ready'), []);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onGo = (e) => {
      const target = e.detail;
      const toCatalog = target.startsWith('#/catalogo');
      const now = getRoute();
      if (toCatalog && now === 'catalog') return;
      if (!toCatalog && now === 'home') {
        const el = document.getElementById(target.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      pending.current = toCatalog ? null : target.slice(1);
      setCurtain('in');
      setTimeout(() => {
        window.location.hash = target;
        setRoute(toCatalog ? 'catalog' : 'home');
        window.scrollTo(0, 0);
        setCurtain('out');
        setTimeout(() => setCurtain('idle'), 850);
      }, 650);
    };
    window.addEventListener('rp:go', onGo);
    return () => window.removeEventListener('rp:go', onGo);
  }, []);

  useEffect(() => {
    if (route !== 'home' || !pending.current) return;
    const id = pending.current;
    pending.current = null;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'auto' }), 60);
    return () => clearTimeout(t);
  }, [route]);

  return (
    <>
      <Loader onLeave={onLeave} />
      <Navbar route={route} />
      {route === 'home' ? (
        <main>
          <Hero />
          <Marquee />
          <Categories />
          <Atelier />
          <Scene />
          <Stats />
          <Finder />
          <Contact />
        </main>
      ) : (
        <Suspense fallback={<div className="min-h-screen bg-ink" />}>
          <Catalog />
        </Suspense>
      )}
      <Footer />
      <WhatsAppFab />
      {curtain !== 'idle' && (
        <div className={`curtain ${curtain === 'in' ? 'cv-in' : 'cv-out'}`} aria-hidden="true">
          <img src={LOGO} alt="" className="h-40 w-40 opacity-90" draggable="false" />
        </div>
      )}
    </>
  );
}
