import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Tape from './components/Tape';
import Journey from './components/Journey';
import Lab from './components/Lab';
import Menu from './components/Menu';
import School from './components/School';
import Gallery from './components/Gallery';
import LangSwitch from './components/LangSwitch';
import { Contact, FloatCTA, Footer } from './components/Contact';
import { useI18n } from './i18n';
import { requestFrame, useReveal } from './lib/scroll';

export default function App() {
  const { lang } = useI18n();
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const bar = useRef(null);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); setReady(true); document.body.classList.add('ready'); requestFrame(); }, []);
  const onDone = useCallback(() => setLoading(false), []);
  useReveal(`${lang}${ready}`);
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
        <Tape />
        <Journey />
        <Lab />
        <Menu />
        <School />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <FloatCTA />
      <LangSwitch />
    </>
  );
}
