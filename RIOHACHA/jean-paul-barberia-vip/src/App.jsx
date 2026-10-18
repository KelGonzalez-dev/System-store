import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Experiences from './components/Experiences';
import Ritual from './components/Ritual';
import Kids from './components/Kids';
import Prices from './components/Prices';
import Wall from './components/Wall';
import Concierge from './components/Concierge';
import { FloatWA, Footer, Visit } from './components/Visit';
import { requestFrame, scrollToTarget, useReveal } from './lib/scroll';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState(null);
  const bar = useRef(null);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); setReady(true); document.body.classList.add('ready'); requestFrame(); }, []);
  const onDone = useCallback(() => setLoading(false), []);
  const book = useCallback((p) => { setPreset({ ...p, t: Date.now() }); scrollToTarget('#agenda'); }, []);
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
        <Hero onQuick={({ svc, day }) => book({ cat: svc, day })} />
        <Experiences onPick={(cat) => book({ cat })} />
        <Ritual />
        <Kids onPick={(cat) => book({ cat })} />
        <Prices onPick={(cat, service) => book({ cat, service })} />
        <Wall />
        <Concierge preset={preset} />
        <Visit />
      </main>
      <Footer />
      <FloatWA />
    </>
  );
}
