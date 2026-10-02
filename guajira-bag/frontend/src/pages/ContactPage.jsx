import { Instagram, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import Seo from '../components/Seo';
import { TikTokIcon } from '../components/Icons';
import { WA_NUMBER } from '../data';
import { useReveal } from '../hooks/useReveal';

const CARDS = [
  { icon: <MapPin size={20} />, title: 'Ubicación', content: 'Riohacha, La Guajira, Colombia' },
  { icon: <Phone size={20} />, title: 'WhatsApp', content: `+${WA_NUMBER}`, link: `https://wa.me/${WA_NUMBER}` },
  { icon: <Send size={20} />, title: 'Email', content: 'guajirabags01@gmail.com', link: 'mailto:guajirabags01@gmail.com' },
];

const SOCIALS = [
  { name: 'Instagram', icon: <Instagram size={18} />, url: 'https://www.instagram.com/guajira_bags/' },
  { name: 'TikTok', icon: <TikTokIcon size={18} />, url: 'https://www.tiktok.com/@.guajira.bags?is_from_webapp=1&sender_device=pc' },
  { name: 'WhatsApp', icon: <MessageCircle size={18} />, url: `https://wa.me/${WA_NUMBER}` },
];

export default function ContactPage() {
  const headRef = useReveal({});
  const cardsRef = useReveal({ index: 1 });
  const ctaRef = useReveal({ index: 2 });

  return (
    <div className="contact-page">
      <Seo
        path="/contacto"
        title="Contacto"
        description="Contáctanos por WhatsApp o Instagram para conocer disponibilidad, precios y envíos de nuestras mochilas Wayuu artesanales."
        keywords="contacto guajira bags, comprar mochila wayuu whatsapp"
      />
      <div className="wrap">
        <div ref={headRef} className="rv contact-head" data-v="up">
          <span className="eyebrow eyebrow--light">Hablemos</span>
          <h1 className="h-display">Escríbenos, con gusto te atendemos</h1>
          <p>Disponibilidad, precios y envíos a toda Colombia — respuesta rápida por WhatsApp.</p>
        </div>

        <div ref={cardsRef} className="rv contact-cards" data-v="up">
          {CARDS.map((c) => (
            <div className="ccard" key={c.title}>
              <div className="ccard__icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.content}</p>
              {c.link && <a className="link" href={c.link} target="_blank" rel="noreferrer">Abrir</a>}
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="rv contact-cta" data-v="zoom">
          <a className="btn btn--gold" href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola! Quisiera obtener más información sobre sus mochilas Wayuu.')}`} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />Escribir por WhatsApp
          </a>
        </div>

        <div className="contact-social">
          {SOCIALS.map((s) => (
            <a key={s.name} className="social-pill" href={s.url} target="_blank" rel="noreferrer">{s.icon}{s.name}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
