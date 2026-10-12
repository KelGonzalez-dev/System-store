import { useCallback } from 'react';
import HeartLoader from './loader/HeartLoader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import Stats from './sections/Stats';
import Concept from './sections/Concept';
import Menu from './sections/Menu';
import Recommender from './sections/Recommender';
import Gallery from './sections/Gallery';
import Location from './sections/Location';
import Reviews from './sections/Reviews';
import Contact from './sections/Contact';

export default function App() {
  const onLeave = useCallback(() => document.documentElement.classList.add('ready'), []);

  return (
    <>
      <HeartLoader onLeave={onLeave} />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Concept />
        <Menu />
        <Recommender />
        <Gallery />
        <Location />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
