import { useEffect, useState } from 'react';
import { Logo } from './Brand';
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
        <div className="ls-logo mx-auto w-28"><Logo /></div>
        <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.25em] opacity-70">{DICT[shown].loader.switching}</p>
        <p className="mt-1 font-display text-[32px] font-extrabold">{LANGS.find((l) => l.code === shown)?.label}</p>
      </div>
    </div>
  );
}
