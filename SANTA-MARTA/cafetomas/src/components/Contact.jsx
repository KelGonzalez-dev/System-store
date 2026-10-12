import { useEffect, useState } from 'react';
import { Logo, Mark } from './Brand';
import { ADDRESS, IG, LINKTREE, contactLink, useI18n } from '../i18n';
import { scrollToTarget } from '../lib/scroll';

export function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  return (
    <section id="contacto" className="contact-sec">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="contact-card">
          <div className="cc-logo" aria-hidden="true"><Logo /></div>
          <div>
            <h2 className="rv mask-up sec-title"><span>{c.title}</span></h2>
            <p className="rv mt-4 max-w-[46ch] text-[17px] leading-relaxed opacity-85">{c.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer" className="btn btn-purple">📸 @{IG}</a>
              <a href={LINKTREE} target="_blank" rel="noopener noreferrer" className="btn btn-line-dark">🔗 {c.links}</a>
            </div>
            <div className="cc-where">
              <b>{c.where}</b>
              <p>{ADDRESS || c.whereV}</p>
              {!ADDRESS && <a href={contactLink(t.hero.msg)} target="_blank" rel="noopener noreferrer" className="ulink">{t.nav.cta} →</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot">
      <div className="wrap flex flex-col items-center py-14 text-center">
        <div className="w-28"><Logo /></div>
        <p className="foot-word">CAFETOMÁS</p>
        <p className="mt-1 text-[15px] opacity-80">{t.loader.tag}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-5 text-[14px] font-bold">
          <a className="ulink" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a className="ulink" href={LINKTREE} target="_blank" rel="noopener noreferrer">Linktree</a>
        </div>
        <div className="mt-10 flex w-full flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-[12px] opacity-60 md:flex-row">
          <span>© {new Date().getFullYear()} Cafetomás · Café de Especialidad. {t.foot.rights}</span>
          <a href="#inicio" className="ulink" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>{t.foot.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}

export function FloatCTA() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return <a href={contactLink(t.hero.msg)} target="_blank" rel="noopener noreferrer" className={`float-cta ${show ? 'on' : ''}`} aria-label={t.nav.cta}><Mark /><span>{t.nav.cta}</span></a>;
}
