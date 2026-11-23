import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ADICIONES, CONFIG, fmt, waLink } from './data';

// El pedido del cliente: se guarda en el navegador y se envía armado por WhatsApp.
const Ctx = createContext(null);
export const usePedido = () => useContext(Ctx);

const precioLinea = (l) => (l.plato.precio + l.adiciones.reduce((n, a) => n + a.precio, 0)) * l.cantidad;

export function PedidoProvider({ children }) {
  const [lineas, setLineas] = useState(() => { try { return JSON.parse(localStorage.getItem('b88_pedido') || '[]'); } catch { return []; } });
  const [abierto, setAbierto] = useState(false);
  const [pulso, setPulso] = useState(0);
  useEffect(() => { try { localStorage.setItem('b88_pedido', JSON.stringify(lineas)); } catch { /* sin almacenamiento */ } }, [lineas]);

  const agregar = useCallback((plato, { cantidad = 1, adiciones = [], nota = '' } = {}) => {
    const key = `${plato.id}|${adiciones.map((a) => a.id).sort().join(',')}|${nota}`;
    setLineas((ls) => {
      const i = ls.findIndex((l) => l.key === key);
      if (i >= 0) return ls.map((l, k) => (k === i ? { ...l, cantidad: l.cantidad + cantidad } : l));
      return [...ls, { key, plato: { id: plato.id, nombre: plato.nombre, precio: plato.precio, foto: plato.foto, arte: plato.arte }, cantidad, adiciones, nota }];
    });
    setPulso((p) => p + 1);
  }, []);
  const cambiar = useCallback((key, cantidad) => setLineas((ls) => (cantidad <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, cantidad } : l)))), []);
  const vaciar = useCallback(() => setLineas([]), []);

  const total = lineas.reduce((n, l) => n + precioLinea(l), 0);
  const unidades = lineas.reduce((n, l) => n + l.cantidad, 0);

  const mensaje = (datos) => {
    const filas = lineas.map((l) => `• ${l.cantidad} × ${l.plato.nombre}${l.adiciones.length ? ` (+ ${l.adiciones.map((a) => a.nombre).join(', ')})` : ''}${l.nota ? ` — ${l.nota}` : ''} = ${fmt(precioLinea(l))}`);
    return [
      `¡Hola ${CONFIG.nombre}! 🍔 Quiero hacer este pedido:`,
      '',
      ...filas,
      '',
      `💰 Total: ${fmt(total)} (más domicilio)`,
      '',
      `👤 ${datos.nombre}`,
      `📍 ${datos.direccion}${datos.barrio ? `, barrio ${datos.barrio}` : ''}`,
      `💳 Pago: ${datos.pago}${datos.pago === 'Efectivo' && datos.cambio ? ` (pago con ${datos.cambio})` : ''}`,
      datos.notas ? `📝 ${datos.notas}` : '',
    ].filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n').trim();
  };
  const enviar = (datos) => window.open(waLink(mensaje(datos)), '_blank', 'noopener');

  const value = useMemo(() => ({ lineas, total, unidades, agregar, cambiar, vaciar, abierto, setAbierto, pulso, enviar, precioLinea }), [lineas, total, unidades, agregar, cambiar, vaciar, abierto, pulso]); // eslint-disable-line react-hooks/exhaustive-deps
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { ADICIONES };
