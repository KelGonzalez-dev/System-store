import { waLink } from '../data/content';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppFab() {
  return (
    <a
      href={waLink('Hola Casa Riosa, me gustaría más información.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1f9d55] text-white transition-transform duration-300 hover:scale-110 active:scale-95"
      style={{ marginBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 0 30px rgba(31,157,85,.55)' }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
