import { useCallback, useEffect, useState } from 'react';

const read = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

export function useTheme() {
  const [theme, setTheme] = useState(read);

  const apply = useCallback((t) => {
    const d = document.documentElement;
    d.classList.add('theme-anim');
    d.dataset.theme = t;
    try { localStorage.setItem('jb:theme', t); } catch (e) {}
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'dark' ? '#070906' : '#62bf00');
    setTheme(t);
    setTimeout(() => d.classList.remove('theme-anim'), 600);
  }, []);

  useEffect(() => {
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', theme === 'dark' ? '#070906' : '#62bf00');
  }, []);

  const toggle = useCallback(() => apply(read() === 'dark' ? 'light' : 'dark'), [apply]);
  return { theme, toggle };
}
