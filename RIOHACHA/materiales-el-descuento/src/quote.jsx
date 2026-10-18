import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CONFIG, PRODUCTS, fmt, unitPrice } from './data';

// Cotización: el cliente arma su lista; el precio cambia solo a "por mayor" cuando la cantidad llega al mínimo
const Ctx = createContext(null);
export const useQuote = () => useContext(Ctx);

export function QuoteProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('md_quote') || '{}'); } catch { return {}; } });
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  useEffect(() => { try { localStorage.setItem('md_quote', JSON.stringify(items)); } catch { /* sin almacenamiento */ } }, [items]);
  const add = useCallback((id, q = 1) => { setItems((s) => ({ ...s, [id]: (s[id] || 0) + q })); setBump((b) => b + 1); }, []);
  const setQty = useCallback((id, q) => setItems((s) => { const n = { ...s }; if (q <= 0) delete n[id]; else n[id] = q; return n; }), []);
  const clear = useCallback(() => setItems({}), []);
  const list = useMemo(() => Object.entries(items).map(([id, q]) => ({ p: PRODUCTS.find((x) => x.id === +id), q })).filter((x) => x.p), [items]);
  const total = list.reduce((n, x) => n + unitPrice(x.p, x.q) * x.q, 0);
  const saved = list.reduce((n, x) => n + (x.p.detal - unitPrice(x.p, x.q)) * x.q, 0);
  const count = list.length;
  const message = () => {
    const lines = list.map((x) => `• ${x.q} ${x.p.unit}${x.q > 1 && !x.p.unit.includes('m') ? 's' : ''} — ${x.p.n} (${x.p.brand}) · ${fmt.format(unitPrice(x.p, x.q))} c/u${x.q >= x.p.min ? ' [por mayor]' : ''} = ${fmt.format(unitPrice(x.p, x.q) * x.q)}`);
    return `¡Hola ${CONFIG.name}! 🏗️ Quiero cotizar estos materiales:\n\n${lines.join('\n')}\n\nTotal aproximado: ${fmt.format(total)}${saved > 0 ? `\nAhorro por compra al por mayor: ${fmt.format(saved)}` : ''}\n\n¿Me confirman disponibilidad y precio final?`;
  };
  const value = useMemo(() => ({ items, list, total, saved, count, add, setQty, clear, open, setOpen, bump, message }), [items, list, total, saved, count, add, setQty, clear, open, bump]); // eslint-disable-line react-hooks/exhaustive-deps
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
