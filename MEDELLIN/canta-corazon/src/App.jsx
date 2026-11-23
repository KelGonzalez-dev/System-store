import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Saloon from './components/Saloon';
import Noches from './components/Noches';
import Tragos from './components/Tragos';
import Despedidas from './components/Despedidas';
import Galeria from './components/Galeria';
import Reserva from './components/Reserva';
import Pie from './components/Pie';
import { requestFrame, useReveal } from './lib/scroll';

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [listo, setListo] = useState(false);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); setListo(true); document.body.classList.add('listo'); requestFrame(); }, []);
  const onDone = useCallback(() => setCargando(false), []);
  useReveal(`${listo}`);
  useEffect(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }, []);
  return (
    <>
      {cargando && <Loader onReveal={onReveal} onDone={onDone} />}
      <Nav />
      <main>
        <Hero />
        <Saloon />
        <Noches />
        <Tragos />
        <Despedidas />
        <Galeria />
        <Reserva />
      </main>
      <Pie />
    </>
  );
}
