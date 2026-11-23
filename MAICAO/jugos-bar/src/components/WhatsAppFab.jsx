import { link } from '../router';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppFab() {
  return (
    <a {...link('#/menu')} aria-label="Hacer un pedido" className="fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-brand-deep px-5 font-body text-[14px] font-bold uppercase tracking-[.08em] text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,.5)] transition-transform duration-300 hover:scale-105 active:scale-95" style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
      <span className="wa-ring" aria-hidden="true" />
      <WhatsAppIcon className="h-6 w-6" />Pedir ahora
    </a>
  );
}
