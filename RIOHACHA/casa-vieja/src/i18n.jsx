import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================
// CONTACTO (de su Instagram). Completa la dirección exacta.
// ============================================================
export const WHATSAPP = '573053063152'; // domicilios
export const IG = 'casavieja.rh';
export const ADDRESS = 'Riohacha, La Guajira'; // ← escribe aquí la dirección exacta
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=Casa+Vieja+Caf%C3%A9+%26+Bar+Riohacha';
export const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const LANGS = [
  { code: 'es', label: 'Español', locale: 'es-CO' },
  { code: 'en', label: 'English', locale: 'en-US' },
];
const IDX = { es: 0, en: 1 };

const DAYS = {
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const DICT = {
  es: {
    days: DAYS.es,
    loader: { welcome: 'Bienvenidos a casa', brewing: 'Preparando tu café', skip: 'Entrar', switching: 'Cambiando idioma a' },
    nav: { house: 'La casa', menu: 'La carta', night: 'De noche', gallery: 'Galería', visit: 'Visítanos', order: 'Domicilios', lang: 'Idioma', open: 'Abrir menú', close: 'Cerrar menú' },
    hero: {
      day: 'De día', night: 'De noche',
      dayEyebrow: 'Café colombiano · Riohacha', nightEyebrow: 'Bar · Cócteles · Karaoke',
      dayL1: 'Un lugar donde los buenos momentos', dayL2: 'se convierten en recuerdos',
      nightL1: 'Cuando cae la noche,', nightL2: 'la casa se enciende',
      daySub: 'Disfruta la experiencia de un buen café colombiano, desayunos caseros y tortas hechas con ingredientes naturales y mucho amor.',
      nightSub: 'Micheladas, cócteles y karaoke hasta la madrugada. Jueves hasta la 1 a. m., viernes y sábado hasta las 3 a. m.',
      c1: 'Pedir a domicilio', c2: 'Ver la carta', openNow: 'Abierto ahora', closedNow: 'Cerrado ahora', until: 'hasta las',
      waMsg: '¡Hola Casa Vieja! ☕ Quiero hacer un pedido a domicilio.',
      note: 'Una taza de café no cambiará el mundo, pero es un gran comienzo.',
    },
    tape: ['Café de origen', 'Desayunos', 'Tortas caseras', 'Bar', 'Cócteles', 'Karaoke'],
    house: {
      eyebrow: 'La casa', title: 'Una casa vieja con alma nueva',
      lead: 'Puertas azules, baldosas de colores y sillas de madera en una esquina de Riohacha. Aquí el café se toma despacio, las tortas se hornean en casa y las noches terminan cantando.',
      quote: 'Gracias por ser parte de nuestra historia.',
      points: ['Café colombiano de origen', 'Tortas hechas con ingredientes naturales', 'Bar y karaoke de jueves a sábado'],
    },
    moments: {
      eyebrow: 'Momentos', title: 'Cinco razones para volver',
      items: {
        cafe: { t: 'Café', d: 'Café de origen colombiano en espresso, capuchino, latte o frío. Amor en cada preparación.' },
        desayunos: { t: 'Desayunos', d: 'Empieza el día con parfait, huevos al gusto, calentado o tostadas francesas.' },
        tortas: { t: 'Tortas', d: 'Zanahoria, chocolate y más, hechas en casa con ingredientes naturales y mucho amor.' },
        bar: { t: 'Bar', d: 'Micheladas, cócteles de la casa y cerveza bien fría cuando cae la tarde.' },
        karaoke: { t: 'Karaoke', d: 'Las noches de jueves a sábado se cantan. Trae a tus amigos y elige tu canción.' },
      },
    },
    menu: {
      eyebrow: 'La carta', title: 'Del primer café al último brindis', lead: 'Café, desayunos, tortas, bebidas frías y bar. Mira la carta completa con foto de cada producto.',
      full: 'Ver la carta completa', back: 'Volver al inicio', fav: 'Favorito', order: 'Pedir',
      note: 'Precios de referencia en pesos colombianos. Confirma disponibilidad por WhatsApp.',
      cats: { cafe: 'Café', desayunos: 'Desayunos', tortas: 'Tortas', frias: 'Bebidas frías', bar: 'Bar' },
      orderMsg: (n) => `¡Hola Casa Vieja! ☕ Quiero pedir: ${n}`,
    },
    night: {
      eyebrow: 'De noche', title: 'Bar & karaoke', lead: 'Cuando se apagan las cafeteras, se encienden las luces. Cócteles, micheladas y tu canción favorita hasta la madrugada.',
      sign: 'Karaoke', hours: [['Jueves', 'hasta la 1 a. m.'], ['Viernes', 'hasta las 3 a. m.'], ['Sábado', 'hasta las 3 a. m.']], cta: 'Reservar mesa para la noche',
      resMsg: '¡Hola Casa Vieja! 🎤 Quiero reservar una mesa para la noche.',
    },
    gal: { eyebrow: 'Galería', title: 'Recuerdos de la casa', lead: 'Momentos que se viven en Casa Vieja.', cta: 'Ver Instagram', close: 'Cerrar', prev: 'Anterior', next: 'Siguiente' },
    visit: {
      title: 'Te esperamos en casa', lead: 'Ven a tomarte un café, pide a domicilio o reserva tu mesa por WhatsApp.',
      addr: 'Dirección', map: 'Cómo llegar', wa: 'Domicilios', hours: 'Horario', closed: 'Consultar', today: 'Hoy',
      formT: 'Reserva tu mesa', name: 'Nombre', namePh: 'Tu nombre', date: 'Fecha', time: 'Hora', people: 'Personas', note: 'Comentario', notePh: 'Cumpleaños, karaoke, mesa afuera… (opcional)',
      send: 'Reservar por WhatsApp', one: 'persona', many: 'personas',
      msg: (n, d, h, p, c) => `¡Hola Casa Vieja! ☕ Quiero reservar una mesa.\nNombre: ${n}\nFecha: ${d}\nHora: ${h}\nPersonas: ${p}${c ? `\nComentario: ${c}` : ''}`,
    },
    foot: { rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    days: DAYS.en,
    loader: { welcome: 'Welcome home', brewing: 'Brewing your coffee', skip: 'Enter', switching: 'Switching language to' },
    nav: { house: 'The house', menu: 'Menu', night: 'At night', gallery: 'Gallery', visit: 'Visit us', order: 'Delivery', lang: 'Language', open: 'Open menu', close: 'Close menu' },
    hero: {
      day: 'By day', night: 'By night',
      dayEyebrow: 'Colombian coffee · Riohacha', nightEyebrow: 'Bar · Cocktails · Karaoke',
      dayL1: 'A place where good moments', dayL2: 'become memories',
      nightL1: 'When night falls,', nightL2: 'the house lights up',
      daySub: 'Enjoy great Colombian coffee, homemade breakfasts and cakes made with natural ingredients and lots of love.',
      nightSub: 'Micheladas, cocktails and karaoke until late. Thursdays until 1 a.m., Fridays and Saturdays until 3 a.m.',
      c1: 'Order delivery', c2: 'See the menu', openNow: 'Open now', closedNow: 'Closed now', until: 'until',
      waMsg: 'Hi Casa Vieja! ☕ I would like to order delivery.',
      note: 'A cup of coffee won’t change the world, but it’s a great start.',
    },
    tape: ['Single-origin coffee', 'Breakfast', 'Homemade cakes', 'Bar', 'Cocktails', 'Karaoke'],
    house: {
      eyebrow: 'The house', title: 'An old house with a new soul',
      lead: 'Blue doors, colorful tiles and wooden chairs on a Riohacha corner. Here coffee is enjoyed slowly, cakes are baked at home and nights end in song.',
      quote: 'Thank you for being part of our story.',
      points: ['Colombian single-origin coffee', 'Cakes made with natural ingredients', 'Bar and karaoke Thursday to Saturday'],
    },
    moments: {
      eyebrow: 'Moments', title: 'Five reasons to come back',
      items: {
        cafe: { t: 'Coffee', d: 'Colombian single-origin coffee as espresso, cappuccino, latte or iced. Love in every cup.' },
        desayunos: { t: 'Breakfast', d: 'Start the day with parfait, eggs your way, calentado or French toast.' },
        tortas: { t: 'Cakes', d: 'Carrot, chocolate and more, baked at home with natural ingredients and lots of love.' },
        bar: { t: 'Bar', d: 'Micheladas, house cocktails and ice-cold beer as the afternoon fades.' },
        karaoke: { t: 'Karaoke', d: 'Thursday to Saturday nights are for singing. Bring your friends and pick your song.' },
      },
    },
    menu: {
      eyebrow: 'The menu', title: 'From the first coffee to the last toast', lead: 'Coffee, breakfast, cakes, cold drinks and bar. See the full menu with a photo of every item.',
      full: 'See the full menu', back: 'Back to home', fav: 'Favorite', order: 'Order',
      note: 'Reference prices in Colombian pesos. Check availability on WhatsApp.',
      cats: { cafe: 'Coffee', desayunos: 'Breakfast', tortas: 'Cakes', frias: 'Cold drinks', bar: 'Bar' },
      orderMsg: (n) => `Hi Casa Vieja! ☕ I would like to order: ${n}`,
    },
    night: {
      eyebrow: 'At night', title: 'Bar & karaoke', lead: 'When the coffee machines rest, the lights come on. Cocktails, micheladas and your favorite song until late.',
      sign: 'Karaoke', hours: [['Thursday', 'until 1 a.m.'], ['Friday', 'until 3 a.m.'], ['Saturday', 'until 3 a.m.']], cta: 'Book a table for tonight',
      resMsg: 'Hi Casa Vieja! 🎤 I would like to book a table for tonight.',
    },
    gal: { eyebrow: 'Gallery', title: 'Memories of the house', lead: 'Moments lived at Casa Vieja.', cta: 'Open Instagram', close: 'Close', prev: 'Previous', next: 'Next' },
    visit: {
      title: 'We are waiting for you', lead: 'Come for a coffee, order delivery or book your table on WhatsApp.',
      addr: 'Address', map: 'Get directions', wa: 'Delivery', hours: 'Hours', closed: 'Ask us', today: 'Today',
      formT: 'Book your table', name: 'Name', namePh: 'Your name', date: 'Date', time: 'Time', people: 'Guests', note: 'Comment', notePh: 'Birthday, karaoke, outdoor table… (optional)',
      send: 'Book via WhatsApp', one: 'guest', many: 'guests',
      msg: (n, d, h, p, c) => `Hi Casa Vieja! ☕ I would like to book a table.\nName: ${n}\nDate: ${d}\nTime: ${h}\nGuests: ${p}${c ? `\nComment: ${c}` : ''}`,
    },
    foot: { rights: 'All rights reserved.', top: 'Back to top' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('cv_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('cv_lang', lang); } catch { /* sin almacenamiento */ }
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
