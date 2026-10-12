import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CONFIG, PRODUCTS, fmt, waLink } from './data';

const Ctx = createContext(null);
export const useBag = () => useContext(Ctx);

// Bolsa de pedido: se guarda en el navegador y se envía por WhatsApp
export function BagProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zulima_bag') || '{}'); } catch { return {}; }
  });
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  useEffect(() => { try { localStorage.setItem('zulima_bag', JSON.stringify(items)); } catch { /* sin almacenamiento */ } }, [items]);
  const add = useCallback((id) => { setItems((s) => ({ ...s, [id]: (s[id] || 0) + 1 })); setPulse((p) => p + 1); }, []);
  const setQty = useCallback((id, q) => setItems((s) => { const n = { ...s }; if (q <= 0) delete n[id]; else n[id] = q; return n; }), []);
  const clear = useCallback(() => setItems({}), []);
  const list = useMemo(() => Object.entries(items).map(([id, q]) => ({ p: PRODUCTS.find((x) => x.id === +id), q })).filter((x) => x.p), [items]);
  const count = list.reduce((n, x) => n + x.q, 0);
  const total = list.reduce((n, x) => n + x.q * x.p.price, 0);
  const message = useMemo(() => {
    const lines = list.map((x) => `• ${x.q} x ${x.p.name} (${x.p.size}) — ${fmt.format(x.q * x.p.price)}`);
    return `¡Hola ${CONFIG.name}! 🌿 Quiero hacer este pedido de Natura:\n\n${lines.join('\n')}\n\nTotal aproximado: ${fmt.format(total)}\n\n¿Me confirmas disponibilidad y el valor del envío?`;
  }, [list, total]);
  const send = () => window.open(waLink(message), '_blank', 'noopener');
  const value = useMemo(() => ({ items, list, count, total, add, setQty, clear, open, setOpen, send, pulse }), [items, list, count, total, add, setQty, clear, open, pulse]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
