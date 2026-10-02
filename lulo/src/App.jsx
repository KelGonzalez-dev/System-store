import { useCallback } from 'react';
import NeonLoader from './loader/NeonLoader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import Stats from './sections/Stats';
import Concept from './sections/Concept';
import Menu from './sections/Menu';
import Locations from './sections/Locations';
import Gallery from './sections/Gallery';
import City from './sections/City';
import Reviews from './sections/Reviews';
import Contact from './sections/Contact';

export default function App() {
  const onLeave = useCallback(() => document.documentElement.classList.add('ready'), []);

  return (
    <>
      <NeonLoader onLeave={onLeave} />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Concept />
        <Menu />
        <Locations />
        <Gallery />
        <City />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
