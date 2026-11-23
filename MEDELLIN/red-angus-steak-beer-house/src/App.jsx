import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Encabezado from './components/Encabezado';
import Portada from './components/Portada';
import Pilares from './components/Pilares';
import Casa from './components/Casa';
import Cortes from './components/Cortes';
import Carta from './components/Carta';
import Bar from './components/Bar';
import Galeria from './components/Galeria';
import Eventos from './components/Eventos';
import Reservas from './components/Reservas';
import Pie from './components/Pie';
import { useReveal } from './lib/scroll';

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [listo, setListo] = useState(false);
  const onReveal = useCallback(() => { setListo(true); document.body.classList.add('listo'); }, []);
  const onDone = useCallback(() => setCargando(false), []);
  useReveal(`${listo}`);
  useEffect(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }, []);
  return (
    <>
      {cargando && <Loader onReveal={onReveal} onDone={onDone} />}
      <Encabezado />
      <main>
        <Portada />
        <Pilares />
        <Casa />
        <Cortes />
        <Carta />
        <Bar />
        <Galeria />
        <Eventos />
        <Reservas />
      </main>
      <Pie />
    </>
  );
}
