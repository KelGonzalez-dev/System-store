import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icons';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" onClick={toggle} aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'} aria-pressed={dark} className={`relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-fg/20 text-fg lt:border-white/60 transition-[transform,border-color,color] duration-300 hover:border-brand hover:text-acc active:scale-90 ${className}`}>
      <span className={`absolute transition-[transform,opacity] duration-500 ${dark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-6 -rotate-90 opacity-0'}`}><Icon name="sun" className="h-5 w-5" /></span>
      <span className={`absolute transition-[transform,opacity] duration-500 ${dark ? 'translate-y-6 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'}`}><Icon name="moon" className="h-5 w-5" /></span>
    </button>
  );
}
