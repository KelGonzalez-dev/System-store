import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Zones from './components/Zones';
import Team from './components/Team';
import Shop from './components/Shop';
import Services from './components/Services';
import Bar from './components/Bar';
import Booking from './components/Booking';
import Covers from './components/Covers';
import { FloatBook, Footer, Sedes } from './components/Sedes';
import { requestFrame, scrollToTarget, useReveal } from './lib/scroll';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState(null);
  const bar = useRef(null);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); setReady(true); document.body.classList.add('ready'); requestFrame(); }, []);
  const onDone = useCallback(() => setLoading(false), []);
  const book = useCallback((who, id) => { setPreset({ who, id, t: Date.now() }); scrollToTarget('#reservar'); }, []);
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
        <Ticker />
        <Zones />
        <Team />
        <Services onBook={book} />
        <Bar />
        <Shop />
        <Booking preset={preset} />
        <Covers />
        <Sedes />
      </main>
      <Footer />
      <FloatBook />
    </>
  );
}
