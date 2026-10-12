import { useCallback, useEffect, useRef } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import CookieBanner from './components/CookieBanner';
import { subscribeScroll } from './hooks/scrollBus';
import Hero from './sections/Hero';
import Pillars from './sections/Pillars';
import Products from './sections/Products';
import About from './sections/About';
import Plant from './sections/Plant';
import Producers from './sections/Producers';
import Sustainability from './sections/Sustainability';
import Contact from './sections/Contact';

/* Barra fina de avance de lectura (solo transform) */
function ScrollBar() {
  const ref = useRef(null);
  useEffect(
    () =>
      subscribeScroll((y) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
      }),
    []
  );
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-gradient-to-r from-lime via-gold-light to-berry" />
    </div>
  );
}

export default function App() {
  const onDone = useCallback(() => document.documentElement.classList.add('ready'), []);

  return (
    <>
      <Loader onDone={onDone} />
      <ScrollBar />
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <Products />
        <About />
        <Plant />
        <Producers />
        <Sustainability />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <CookieBanner />
    </>
  );
}
