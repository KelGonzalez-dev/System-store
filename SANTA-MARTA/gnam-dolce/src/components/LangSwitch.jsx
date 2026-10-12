import { useEffect, useState } from 'react';
import { GnamLogo } from './Brand';
import { DICT, LANGS, useI18n } from '../i18n';
import { lockScroll } from '../lib/scroll';

export default function LangSwitch() {
  const { switching } = useI18n();
  const [shown, setShown] = useState(null);
  useEffect(() => { if (switching) { setShown(switching); lockScroll(true); return () => lockScroll(false); } return undefined; }, [switching]);
  if (!shown) return null;
  return (
    <div className={`lang-switch ${switching ? 'on' : ''}`} role="status" aria-live="assertive" onTransitionEnd={(e) => e.target === e.currentTarget && !switching && setShown(null)}>
      <div className="ls-card">
        <div className="mx-auto w-48"><GnamLogo /></div>
        <p className="mt-3 text-[12px] uppercase tracking-[0.3em] text-choco/60">{DICT[shown].loader.switching}</p>
        <p className="mt-1 font-display text-[30px] text-choco">{LANGS.find((l) => l.code === shown)?.label}</p>
      </div>
    </div>
  );
}
