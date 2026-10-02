import { MessageCircle } from 'lucide-react';
import { WA_NUMBER } from '../data';

export default function WhatsAppFab() {
  return (
    <a
      className="wa-fab"
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <MessageCircle size={26} fill="currentColor" />
    </a>
  );
}
