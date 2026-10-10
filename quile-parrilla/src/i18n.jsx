import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================
// DATOS DE CONTACTO (de su Instagram)
// ============================================================
export const WHATSAPP = '573187548324';
export const IG = 'quile_parrillariohacha_';
export const ADDRESS = 'Calle 15 # 7-87, Riohacha, La Guajira';
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=Quile+Parrilla+Calle+15+%237-87+Riohacha';
export const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const LANGS = [
  { code: 'es', label: 'Español', locale: 'es-CO' },
  { code: 'en', label: 'English', locale: 'en-US' },
];
const IDX = { es: 0, en: 1 };

export const DICT = {
  es: {
    loader: { heat: 'Encendiendo la parrilla', tag: 'Sabor para compartir', skip: 'Entrar', switching: 'Cambiando idioma a' },
    nav: { home: 'Inicio', share: 'Para compartir', menu: 'La carta', place: 'El lugar', visit: 'Visítanos', order: 'Pedir', lang: 'Idioma', open: 'Abrir menú', close: 'Cerrar menú' },
    hero: {
      eyebrow: 'Riohacha · La Guajira', l1: 'El sabor de la brasa', l2: 'se comparte en familia',
      sub: 'Una buena parrilla, una mesa llena y muchas razones para sonreír. Carnes al carbón, salchipapas gigantes y el mejor sabor de Riohacha.',
      c1: 'Pedir por WhatsApp', c2: 'Ver la carta', chip: '🔥 100 % al carbón', fans: 'seguidores', posts: 'platos publicados', since: 'El mejor sabor',
      waMsg: '¡Hola Quile Parrilla! 🔥 Quiero hacer un pedido.',
    },
    tape: ['Parrilla al carbón', 'Salchipapas', 'Espada Quile', 'Hamburguesas', 'Mazorcadas', 'Picadas'],
    share: {
      eyebrow: 'Para compartir', title: '3 platos para compartir en familia', lead: 'Los mejores momentos se comparten. Elige el tuyo y pon la mesa.',
      people: 'personas', ask: 'Pedir este plato',
      sizer: {
        title: '¿Cuántos son en la mesa?', lead: 'Mueve el selector y te decimos qué salchipapa pedir. Desde la personal hasta la legendaria tipo ballena.',
        for: 'Ideal para', order: 'Pedir esta salchipapa',
      },
    },
    place: {
      eyebrow: 'El lugar', title: 'Una mesa llena y muchas razones para sonreír',
      lead: 'En Quile Parrilla nos encanta ser parte de esos momentos que se quedan en el corazón: cumpleaños, el almuerzo del domingo o la noche con los amigos.',
      quote: 'Sabor para compartir.',
      points: ['Carnes al carbón hechas al momento', 'Porciones generosas para toda la familia', 'Ambiente familiar en el centro de Riohacha'],
    },
    menu: {
      eyebrow: 'La carta', title: 'Todo sale de la brasa', lead: 'Carnes, salchipapas, hamburguesas y más. Mira la carta completa con foto de cada plato.',
      full: 'Ver la carta completa', back: 'Volver al inicio', fav: 'Favorito', share: 'Para compartir', hot: 'Picante', people: 'pers.',
      note: 'Precios de referencia en pesos colombianos. Confirma disponibilidad por WhatsApp.',
      cats: { parrilla: 'Parrilla', compartir: 'Para compartir', salchipapas: 'Salchipapas', hamburguesas: 'Hamburguesas', mazorcadas: 'Mazorcadas', entradas: 'Entradas', bebidas: 'Bebidas' },
      order: 'Pedir', orderMsg: (n) => `¡Hola Quile Parrilla! 🔥 Quiero pedir: ${n}`,
    },
    insta: { title: 'Síguenos en Instagram', lead: 'Lo que pasa en la parrilla, todos los días.', cta: 'Ver Instagram' },
    visit: {
      title: 'Ven a Quile Parrilla', lead: 'Te esperamos en el centro de Riohacha. Reserva tu mesa o pide a domicilio por WhatsApp.',
      addr: 'Dirección', map: 'Cómo llegar', wa: 'WhatsApp', hours: 'Horario', hoursV: 'Escríbenos por WhatsApp para conocer el horario del día',
      formT: 'Reserva tu mesa', name: 'Nombre', namePh: 'Tu nombre', date: 'Fecha', time: 'Hora', people: 'Personas', note: 'Comentario', notePh: 'Cumpleaños, mesa afuera, etc. (opcional)',
      send: 'Reservar por WhatsApp', one: 'persona', many: 'personas',
      msg: (n, d, h, p, c) => `¡Hola Quile Parrilla! 🔥 Quiero reservar una mesa.\nNombre: ${n}\nFecha: ${d}\nHora: ${h}\nPersonas: ${p}${c ? `\nComentario: ${c}` : ''}`,
    },
    foot: { rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    loader: { heat: 'Firing up the grill', tag: 'Flavor to share', skip: 'Enter', switching: 'Switching language to' },
    nav: { home: 'Home', share: 'To share', menu: 'Menu', place: 'The place', visit: 'Visit us', order: 'Order', lang: 'Language', open: 'Open menu', close: 'Close menu' },
    hero: {
      eyebrow: 'Riohacha · La Guajira', l1: 'The taste of the grill', l2: 'is better shared',
      sub: 'A great grill, a full table and plenty of reasons to smile. Charcoal-grilled meats, giant loaded fries and the best flavor in Riohacha.',
      c1: 'Order on WhatsApp', c2: 'See the menu', chip: '🔥 100% charcoal grilled', fans: 'followers', posts: 'dishes posted', since: 'The best flavor',
      waMsg: 'Hi Quile Parrilla! 🔥 I would like to place an order.',
    },
    tape: ['Charcoal grill', 'Salchipapas', 'Quile skewer', 'Burgers', 'Mazorcadas', 'Platters'],
    share: {
      eyebrow: 'To share', title: '3 dishes to share with family', lead: 'The best moments are shared. Pick yours and set the table.',
      people: 'people', ask: 'Order this dish',
      sizer: {
        title: 'How many at the table?', lead: 'Move the slider and we will tell you which salchipapa to order. From the personal size to the legendary “whale”.',
        for: 'Perfect for', order: 'Order this salchipapa',
      },
    },
    place: {
      eyebrow: 'The place', title: 'A full table and plenty of reasons to smile',
      lead: 'At Quile Parrilla we love being part of the moments that stay in your heart: birthdays, Sunday lunch or a night out with friends.',
      quote: 'Flavor to share.',
      points: ['Charcoal-grilled meats cooked to order', 'Generous portions for the whole family', 'Family atmosphere in downtown Riohacha'],
    },
    menu: {
      eyebrow: 'The menu', title: 'Everything comes off the grill', lead: 'Meats, salchipapas, burgers and more. See the full menu with a photo of every dish.',
      full: 'See the full menu', back: 'Back to home', fav: 'Favorite', share: 'To share', hot: 'Spicy', people: 'ppl',
      note: 'Reference prices in Colombian pesos. Check availability on WhatsApp.',
      cats: { parrilla: 'Grill', compartir: 'To share', salchipapas: 'Salchipapas', hamburguesas: 'Burgers', mazorcadas: 'Mazorcadas', entradas: 'Starters', bebidas: 'Drinks' },
      order: 'Order', orderMsg: (n) => `Hi Quile Parrilla! 🔥 I would like to order: ${n}`,
    },
    insta: { title: 'Follow us on Instagram', lead: 'What happens at the grill, every day.', cta: 'Open Instagram' },
    visit: {
      title: 'Come to Quile Parrilla', lead: 'We are waiting for you in downtown Riohacha. Book a table or order delivery on WhatsApp.',
      addr: 'Address', map: 'Get directions', wa: 'WhatsApp', hours: 'Hours', hoursV: 'Message us on WhatsApp for today’s hours',
      formT: 'Book your table', name: 'Name', namePh: 'Your name', date: 'Date', time: 'Time', people: 'Guests', note: 'Comment', notePh: 'Birthday, outdoor table, etc. (optional)',
      send: 'Book via WhatsApp', one: 'guest', many: 'guests',
      msg: (n, d, h, p, c) => `Hi Quile Parrilla! 🔥 I would like to book a table.\nName: ${n}\nDate: ${d}\nTime: ${h}\nGuests: ${p}${c ? `\nComment: ${c}` : ''}`,
    },
    foot: { rights: 'All rights reserved.', top: 'Back to top' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('qp_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('qp_lang', lang); } catch { /* sin almacenamiento */ }
  }, [lang]);
  const changeLang = useCallback((code) => {
    if (!DICT[code] || code === lang || switching) return;
    timers.current.forEach(clearTimeout);
    setSwitching(code);
    timers.current = [setTimeout(() => setLang(code), 900), setTimeout(() => setSwitching(null), 2000)];
  }, [lang, switching]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const pick = useCallback((v) => (Array.isArray(v) ? v[IDX[lang]] ?? v[0] : v), [lang]);
  const value = useMemo(() => ({ lang, setLang: changeLang, switching, t: DICT[lang], pick, locale: LANGS[IDX[lang]].locale }), [lang, pick, changeLang, switching]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
