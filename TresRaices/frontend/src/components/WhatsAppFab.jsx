import { waLink } from '../data/content';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppFab() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-leaf text-white shadow-lg shadow-forest/40 transition-transform duration-300 hover:scale-110 active:scale-95"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <span className="animate-ping2 absolute inset-0 rounded-full bg-lime/60" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}
