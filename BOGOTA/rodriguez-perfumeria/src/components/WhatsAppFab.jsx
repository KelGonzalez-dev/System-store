import { waLink } from '../data/content';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppFab() {
  return (
    <a
      href={waLink('Hola Rodriguez Perfumería, quiero información.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-ink transition-transform duration-300 hover:scale-110 active:scale-95"
      style={{ marginBottom: 'env(safe-area-inset-bottom)', background: 'linear-gradient(135deg,#f1d9a0,#d4af6a 50%,#a87d36)', boxShadow: '0 0 30px rgba(212,175,106,.5)' }}
    >
      <span className="fab-ring" aria-hidden="true" />
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
