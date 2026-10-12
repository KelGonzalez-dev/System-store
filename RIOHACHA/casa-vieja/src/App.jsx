import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Tape from './components/Tape';
import House from './components/House';
import Moments from './components/Moments';
import Menu from './components/Menu';
import Night from './components/Night';
import Gallery from './components/Gallery';
import LangSwitch from './components/LangSwitch';
import { FloatWA, Footer, Visit } from './components/Visit';
import { useI18n } from './i18n';
import { isNightNow } from './lib/hours';
import { requestFrame, useReveal } from './lib/scroll';

export default function App() {
  const { lang } = useI18n();
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [night, setNight] = useState(isNightNow); // de día o de noche según la hora de Riohacha
  const bar = useRef(null);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); setReady(true); document.body.classList.add('ready'); requestFrame(); }, []);
  const onDone = useCallback(() => setLoading(false), []);
  useReveal(`${lang}${ready}`);
  useEffect(() => { document.body.classList.toggle('mode-night', night); }, [night]);
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
        <Hero night={night} setNight={setNight} />
        <Tape />
        <House />
        <Moments />
        <Menu />
        <Night />
        <Gallery />
        <Visit />
      </main>
      <Footer />
      <FloatWA />
      <LangSwitch />
    </>
  );
}
