import { useEffect, useState } from 'react';

// Favoritos del cliente (corazón), guardados en su navegador
const KEY = 'zulima_wish';
const subs = new Set();
let wish = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } })();
export function toggleWish(id) {
  wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
  try { localStorage.setItem(KEY, JSON.stringify(wish)); } catch { /* sin almacenamiento */ }
  subs.forEach((f) => f(wish));
}
export function useWish() {
  const [w, setW] = useState(wish);
  useEffect(() => { subs.add(setW); return () => subs.delete(setW); }, []);
  return w;
}
