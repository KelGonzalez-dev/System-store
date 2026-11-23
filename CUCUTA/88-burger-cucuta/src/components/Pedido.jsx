import { useEffect, useState } from 'react';
import Foto from './Foto';
import { WaIcon } from './Logo';
import { CONFIG, fmt } from '../data';
import { usePedido } from '../pedido';
import { lockScroll } from '../lib/scroll';
import { abierto } from '../lib/horario';

/** Barra flotante con el pedido + panel lateral para revisarlo y enviarlo por WhatsApp. */
export default function Pedido() {
  const { lineas, total, unidades, cambiar, vaciar, abierto: open, setAbierto, pulso, enviar, precioLinea } = usePedido();
  const [d, setD] = useState({ nombre: '', direccion: '', barrio: '', pago: CONFIG.pagos[0], cambio: '', notas: '' });
  const [enviado, setEnviado] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const k = (e) => e.key === 'Escape' && setAbierto(false);
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [open, setAbierto]);
  const listo = d.nombre.trim().length > 1 && d.direccion.trim().length > 4 && lineas.length > 0;
  const ab = abierto();
  return (
    <>
      <button type="button" className={`barra ${unidades ? 'on' : ''}`} onClick={() => setAbierto(true)} aria-label="Ver mi pedido">
        <span key={pulso} className="barra__n">{unidades}</span>
        <span className="barra__t">Ver mi pedido</span>
        <b>{fmt(total)}</b>
      </button>

      <div className={`cajon ${open ? 'on' : ''}`} aria-hidden={!open} onClick={() => setAbierto(false)}>
        <aside className="cajon__panel" role="dialog" aria-modal="true" aria-label="Mi pedido" onClick={(e) => e.stopPropagation()}>
          <header className="cajon__head">
            <h3>Mi pedido</h3>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar">✕</button>
          </header>
          {lineas.length === 0 ? (
            <div className="cajon__vacio"><p>Tu pedido está vacío.</p><span>Agrega algo rico del menú 🍔</span></div>
          ) : (
            <div className="cajon__cuerpo">
              {!ab.abierto && <p className="cajon__aviso">⏰ {ab.texto}. Puedes dejar tu pedido listo.</p>}
              <ul className="lineas">
                {lineas.map((l) => (
                  <li key={l.key}>
                    <span className="lineas__foto"><Foto id={l.plato.foto} arte={l.plato.arte} alt="" w={200} /></span>
                    <div>
                      <b>{l.plato.nombre}</b>
                      {l.adiciones.length > 0 && <small>+ {l.adiciones.map((a) => a.nombre).join(', ')}</small>}
                      {l.nota && <small>“{l.nota}”</small>}
                      <div className="lineas__pie">
                        <div className="cant cant--sm">
                          <button type="button" onClick={() => cambiar(l.key, l.cantidad - 1)} aria-label="Menos">−</button>
                          <b>{l.cantidad}</b>
                          <button type="button" onClick={() => cambiar(l.key, l.cantidad + 1)} aria-label="Más">+</button>
                        </div>
                        <strong>{fmt(precioLinea(l))}</strong>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="datos">
                <b className="datos__t">¿A dónde te lo llevamos?</b>
                <input placeholder="Tu nombre" value={d.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} autoComplete="name" />
                <input placeholder="Dirección (calle, número, casa/apto)" value={d.direccion} onChange={(e) => setD({ ...d, direccion: e.target.value })} autoComplete="street-address" />
                <input placeholder="Barrio" value={d.barrio} onChange={(e) => setD({ ...d, barrio: e.target.value })} />
                <div className="pagos">{CONFIG.pagos.map((p) => <button key={p} type="button" className={d.pago === p ? 'on' : ''} onClick={() => setD({ ...d, pago: p })}>{p}</button>)}</div>
                {d.pago === 'Efectivo' && <input placeholder="¿Con cuánto pagas? (para llevarte el cambio)" value={d.cambio} onChange={(e) => setD({ ...d, cambio: e.target.value })} inputMode="numeric" />}
                <textarea placeholder="Notas (opcional): punto de referencia, timbre…" value={d.notas} onChange={(e) => setD({ ...d, notas: e.target.value })} rows={2} />
              </div>
            </div>
          )}
          {lineas.length > 0 && (
            <footer className="cajon__pie">
              <div className="cajon__total"><span>Total (sin domicilio)</span><b>{fmt(total)}</b></div>
              <button type="button" className="btn btn--wa cajon__enviar" disabled={!listo} onClick={() => { enviar(d); setEnviado(true); }}>
                <WaIcon /> Enviar pedido por WhatsApp
              </button>
              {!listo && <small className="cajon__falta">Escribe tu nombre y dirección para enviarlo.</small>}
              {enviado && <small className="cajon__ok">¡Listo! Envía el mensaje en WhatsApp y te confirmamos el pedido. <button type="button" onClick={() => { vaciar(); setEnviado(false); setAbierto(false); }}>Vaciar pedido</button></small>}
            </footer>
          )}
        </aside>
      </div>
    </>
  );
}
