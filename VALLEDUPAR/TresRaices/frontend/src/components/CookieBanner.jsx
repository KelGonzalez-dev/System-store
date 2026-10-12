import { useEffect, useState } from 'react';

const KEY = 'tr-cookies';

/* Lee la elección guardada: 'all' | 'necessary' | null.
   Si algún día agregas analítica (Google Analytics, Meta Pixel...), cárgala solo si getConsent() === 'all'. */
export const getConsent = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let t;
    const arm = () => {
      if (getConsent()) return;
      t = setTimeout(() => setShow(true), 1200);
    };
    if (root.classList.contains('ready')) arm();
    else {
      const mo = new MutationObserver(() => {
        if (root.classList.contains('ready')) {
          mo.disconnect();
          arm();
        }
      });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
      var stop = () => mo.disconnect();
    }
    const reopen = () => setShow(true);
    window.addEventListener('open-cookies', reopen);
    return () => {
      clearTimeout(t);
      stop?.();
      window.removeEventListener('open-cookies', reopen);
    };
  }, []);

  const choose = (value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }));
    setShow(false);
    setMore(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-hidden={!show}
      className={`fixed inset-x-3 bottom-3 z-[70] transition-[opacity,transform] duration-500 md:inset-x-auto md:bottom-5 md:left-5 md:w-[26rem] ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="rounded-2xl border border-ink/10 bg-cream p-5 text-ink shadow-2xl shadow-forest/30">
        <p className="font-display text-lg font-bold text-forest">Tu privacidad</p>
        <p className="mt-1.5 text-[14px] leading-snug text-ink/80">
          Este sitio no usa cookies de publicidad ni de seguimiento. Solo guardamos tu elección en tu navegador.
        </p>
        {more && (
          <p className="mt-2 text-[13px] leading-snug text-ink/70">
            Las fuentes (Google Fonts) y las fotos (Unsplash) se cargan desde servidores externos, que pueden recibir tu dirección IP. Si aceptas, podremos usar estadísticas de visitas anónimas en el futuro. Puedes cambiar tu decisión en cualquier momento desde el pie de página.
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => choose('all')} className="btn bg-leaf px-5 py-2.5 text-white hover:bg-forest">
            Aceptar
          </button>
          <button type="button" onClick={() => choose('necessary')} className="btn border border-ink/25 px-5 py-2.5 text-ink hover:bg-ink hover:text-white">
            Solo necesarias
          </button>
          <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} className="px-2 py-2 text-sm font-semibold text-leaf underline underline-offset-4">
            {more ? 'Menos' : 'Más info'}
          </button>
        </div>
      </div>
    </div>
  );
}
