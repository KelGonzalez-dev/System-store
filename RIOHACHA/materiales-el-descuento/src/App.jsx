import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Categories from './components/Categories';
import Promos from './components/Promos';
import Catalog from './components/Catalog';
import Calculator from './components/Calculator';
import News from './components/News';
import Gallery from './components/Gallery';
import About from './components/About';
import { Contact, Footer } from './components/Contact';
import { FloatQuote, QuoteDrawer } from './components/QuoteDrawer';
import { ProductModal } from './components/Product';
import { scrollToTarget } from './lib/scroll';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('todos');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); document.body.classList.add('ready'); }, []);
  const onDone = useCallback(() => setLoading(false), []);
  const close = useCallback(() => setOpen(null), []);
  const search = useCallback((q) => { setQuery(q.trim()); setCat('todos'); setTimeout(() => scrollToTarget('#catalogo'), 30); }, []);
  const pickCat = useCallback((c) => { setCat(c); setQuery(''); setTimeout(() => scrollToTarget('#catalogo'), 30); }, []);
  useEffect(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; }, []);
  return (
    <>
      {loading && <Loader onReveal={onReveal} onDone={onDone} />}
      <Header onSearch={search} />
      <main>
        <Hero onSearch={search} onCat={pickCat} />
        <Brands />
        <Categories onCat={pickCat} />
        <Promos />
        <Catalog cat={cat} setCat={setCat} query={query} setQuery={setQuery} onOpen={setOpen} />
        <Calculator />
        <News />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer onCat={pickCat} />
      <FloatQuote />
      <QuoteDrawer />
      {open && <ProductModal p={open} onClose={close} onOpen={setOpen} />}
    </>
  );
}
