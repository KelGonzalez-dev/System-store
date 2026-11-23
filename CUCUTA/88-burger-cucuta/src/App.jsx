import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Anatomia from './components/Anatomia';
import Menu from './components/Menu';
import Galeria from './components/Galeria';
import Domicilio from './components/Domicilio';
import Pedido from './components/Pedido';
import Pie from './components/Pie';
import { requestFrame, useReveal } from './lib/scroll';

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [listo, setListo] = useState(false);
  const [plato, setPlato] = useState(null);
  const onReveal = useCallback(() => { window.scrollTo(0, 0); setListo(true); document.body.classList.add('listo'); requestFrame(); }, []);
  const onDone = useCallback(() => setCargando(false), []);
  useReveal(`${listo}`);
  useEffect(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }, []);
  const verPlato = useCallback((p) => { setPlato(p); }, []);
  return (
    <>
      {cargando && <Loader onReveal={onReveal} onDone={onDone} />}
      <Nav />
      <main>
        <Hero onPedir={verPlato} />
        <Anatomia />
        <Menu abrirPlato={plato} setAbrirPlato={setPlato} />
        <Galeria />
        <Domicilio />
      </main>
      <Pie />
      <Pedido />
    </>
  );
}
