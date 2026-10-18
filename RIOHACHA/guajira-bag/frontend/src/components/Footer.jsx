import { Instagram } from 'lucide-react';
import { TikTokIcon } from './Icons';

export default function Footer({ user, onAdmin }) {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <img src="/images/logo.webp" alt="Guajira Bags" className="footer__logo" loading="lazy" />
        <p className="footer__brand">Guajira Bags</p>
        <p className="footer__tag">Tradición, elegancia y cultura tejida a mano.</p>
        <div className="footer__social">
          <a href="https://www.instagram.com/guajira_bags/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="https://www.tiktok.com/@.guajira.bags" target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokIcon size={18} /></a>
        </div>
        <button type="button" className="footer__admin" onClick={onAdmin}>
          {user ? 'Panel administrativo' : 'Acceso administrativo'}
        </button>
        <p className="footer__legal">© {new Date().getFullYear()} Guajira Bags. Todos los derechos reservados. Riohacha, La Guajira, Colombia.</p>
      </div>
    </footer>
  );
}
