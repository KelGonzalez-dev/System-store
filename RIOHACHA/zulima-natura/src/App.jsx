import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Favorites from './components/Favorites';
import Catalog from './components/Catalog';
import Quiz from './components/Quiz';
import GiftBox from './components/GiftBox';
import Categories from './components/Categories';
import Ritual from './components/Ritual';
import { About, Footer } from './components/About';
import { BagDrawer, FloatBag } from './components/BagDrawer';
import { ProductModal } from './components/Product';
import { requestFrame, useReveal } from './lib/scroll';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(null);
  const [cat, setCat] = useState('todos');
  const bar = useRef(null);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); setReady(true); document.body.classList.add('ready'); requestFrame(); }, []);
  const onDone = useCallback(() => setLoading(false), []);
  const close = useCallback(() => setOpen(null), []);
  useReveal(`${ready}`);
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    let q = false;
    const f = () => { q = false; const h = document.documentElement.scrollHeight - window.innerHeight; if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`; };
    const on = () => { if (!q) { q = true; requestAnimationFrame(f); } };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <div ref={bar} className="progress" aria-hidden="true" />
      {loading && <Loader onReveal={onReveal} onDone={onDone} />}
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Categories setCat={setCat} />
        <Favorites onOpen={setOpen} />
        <Catalog onOpen={setOpen} cat={cat} setCat={setCat} />
        <Ritual />
        <Quiz />
        <GiftBox />
        <About />
      </main>
      <Footer />
      <FloatBag />
      <BagDrawer />
      {open && <ProductModal p={open} onClose={close} onOpen={setOpen} />}
    </>
  );
}
