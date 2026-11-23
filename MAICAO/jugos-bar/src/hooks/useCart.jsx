import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [state, setState] = useState({ sede: null, lines: {} });
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  const add = useCallback((sedeId, item) => {
    setState((s) => {
      const lines = s.sede && s.sede !== sedeId ? {} : { ...s.lines };
      const cur = lines[item.id] || { item, qty: 0 };
      lines[item.id] = { item, qty: cur.qty + 1 };
      return { sede: sedeId, lines };
    });
    setPulse((p) => p + 1);
  }, []);

  const dec = useCallback((id) => {
    setState((s) => {
      const lines = { ...s.lines };
      if (!lines[id]) return s;
      const qty = lines[id].qty - 1;
      if (qty <= 0) delete lines[id];
      else lines[id] = { ...lines[id], qty };
      return { sede: Object.keys(lines).length ? s.sede : null, lines };
    });
  }, []);

  const remove = useCallback((id) => {
    setState((s) => {
      const lines = { ...s.lines };
      delete lines[id];
      return { sede: Object.keys(lines).length ? s.sede : null, lines };
    });
  }, []);

  const clear = useCallback(() => setState({ sede: null, lines: {} }), []);

  const value = useMemo(() => {
    const list = Object.values(state.lines);
    return {
      sede: state.sede,
      list,
      count: list.reduce((a, l) => a + l.qty, 0),
      total: list.reduce((a, l) => a + l.qty * l.item.price, 0),
      qty: (id) => (state.lines[id] ? state.lines[id].qty : 0),
      add, dec, remove, clear, open, setOpen, pulse,
    };
  }, [state, open, pulse, add, dec, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
