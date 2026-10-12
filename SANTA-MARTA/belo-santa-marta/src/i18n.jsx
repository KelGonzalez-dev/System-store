import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================
// CONTACTO (de su Instagram y publicaciones)
// ============================================================
export const WHATSAPP = '573245112834'; // número de sus publicaciones (Lunch Day / reservas)
export const IG = 'belo.smr';
export const IG_ROOF = 'belorooftop';
export const MENU_URL = 'https://belo.cluvi.co';
export const ADDRESS = 'Calle 18 # 4-08, Centro Histórico, Santa Marta';
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=BELO+Cocina+%26+Rooftop+Calle+18+%234-08+Santa+Marta';
export const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const LANGS = [
  { code: 'es', label: 'Español', locale: 'es-CO' },
  { code: 'en', label: 'English', locale: 'en-US' },
];
const IDX = { es: 0, en: 1 };

export const DICT = {
  es: {
    loader: { up: 'Subiendo al rooftop', tag: 'Cocina & Rooftop', place: 'Mediterránea & Caribe · Santa Marta', skip: 'Entrar', switching: 'Cambiando idioma a' },
    nav: { kitchen: 'La cocina', roof: 'Rooftop', menu: 'La carta', lunch: 'Lunch Day', events: 'Eventos', visit: 'Visítanos', book: 'Reservar', lang: 'Idioma', open: 'Abrir menú', close: 'Cerrar menú' },
    hero: {
      eyebrow: 'Centro Histórico · Santa Marta', sub1: 'Cocina mediterránea & caribe', sub2: 'abajo la mesa, arriba el rooftop',
      lead: 'Producto del mar Caribe, recetas del Mediterráneo y cócteles de autor en una casa de ladrillo, libros y lámparas tejidas. Y cuando cae el sol, se sube al rooftop.',
      c1: 'Reservar mesa', c2: 'Ver la carta', scroll: 'Desliza',
      waMsg: '¡Hola BELO! Quiero reservar una mesa.',
    },
    tape: ['Cocina mediterránea', 'Sabor caribe', 'Rooftop', 'Cócteles de autor', 'Lunch Day', 'Centro Histórico'],
    floors: {
      eyebrow: 'Dos pisos, dos mundos', floor: 'Piso',
      f1: { n: 'Cocina', t: 'Abajo, la cocina', d: 'Ladrillo a la vista, estanterías con libros, lámparas tejidas y mesas de mármol. Aquí se cocina el Mediterráneo con producto del Caribe.' },
      f2: { n: 'Rooftop', t: 'Arriba, el rooftop', d: 'La catedral iluminada, el DJ, la brisa del mar y cócteles de autor bajo las estrellas de Santa Marta.' },
    },
    dishes: { eyebrow: 'Nuevos platos', title: 'Del Mediterráneo al Caribe', lead: 'Lo nuevo de la cocina de BELO.', order: 'Reservar para probarlo' },
    lunch: {
      eyebrow: 'Nueva experiencia', title: 'Lunch Day', sub: 'con cocina de barrio',
      lead: 'Almuerzos de la casa con el sabor de siempre y el estilo de BELO.', from: 'Almuerzos desde', days: 'Lunes a viernes', hours: '12:00 p. m. – 3:00 p. m.',
      cta: 'Pedir el almuerzo de hoy', msg: '¡Hola BELO! Quiero información del Lunch Day de hoy.',
    },
    bar: {
      eyebrow: 'El bar', title: 'Cócteles de autor', bottles: 'Licores para compartir',
      lead: 'Recetas propias, destilados premium y botellas para celebrar en la mesa.',
    },
    events: {
      eyebrow: 'Eventos', title: 'Siempre hay una razón',
      items: [
        { t: 'Tu cumpleaños', d: 'Celebra tu cumpleaños con nosotros y recibe cena gratis.', cta: 'Reservar mi cumpleaños', msg: '¡Hola BELO! Quiero celebrar mi cumpleaños con ustedes.' },
        { t: 'Fútbol en pantalla gigante', d: 'La pasión del fútbol se vive aquí: partidos en pantalla gigante y cubetazos.', cta: 'Reservar para el partido', msg: '¡Hola BELO! Quiero reservar para ver el partido.' },
        { t: 'Noches de rooftop', d: 'DJ, luces y la catedral de fondo. Un nuevo espacio para las noches de Santa Marta.', cta: 'Reservar en el rooftop', msg: '¡Hola BELO! Quiero reservar en el rooftop.' },
      ],
    },
    menu: {
      eyebrow: 'La carta', title: 'Carta completa', lead: 'Entradas, fuertes, Lunch Day, postres, licores, cócteles, bebidas y vinos, con foto de cada plato.',
      full: 'Ver la carta completa', back: 'Volver al inicio', digital: 'Carta digital oficial', new: 'Nuevo', ref: 'Referencia', order: 'Reservar',
      note: 'Los platos marcados como "Referencia" y sus precios son de ejemplo: confirma la carta del día con el restaurante.',
      cats: { entradas: 'Entradas', fuertes: 'Fuertes', lunch: 'Lunch Day', postres: 'Postres', licores: 'Licores', cocteles: 'Cócteles', bebidas: 'Bebidas', vinos: 'Vinos' },
      orderMsg: (n) => `¡Hola BELO! Quiero reservar y probar: ${n}`,
    },
    gal: { eyebrow: 'Galería', title: 'La vida en BELO', lead: 'Desliza para recorrer la casa.', close: 'Cerrar', prev: 'Anterior', next: 'Siguiente' },
    visit: {
      title: 'Te esperamos en el Centro Histórico', lead: 'Reserva tu mesa abajo o en el rooftop. Te confirmamos por WhatsApp.',
      addr: 'Dirección', map: 'Cómo llegar', book: 'Reservas', hours: 'Horario', lunchH: 'Lunch Day: lunes a viernes, 12:00 p. m. – 3:00 p. m.', otherH: 'Cena y rooftop: escríbenos para conocer el horario de hoy',
      formT: 'Reserva tu mesa', name: 'Nombre', namePh: 'Tu nombre', date: 'Fecha', time: 'Hora', people: 'Personas', zone: 'Dónde', zones: ['Restaurante', 'Rooftop', 'Lo que haya disponible'],
      note: 'Ocasión', notePh: 'Cumpleaños, aniversario, partido… (opcional)', send: 'Reservar por WhatsApp', one: 'persona', many: 'personas',
      msg: (n, d, h, p, z, c) => `¡Hola BELO! Quiero reservar una mesa.\nNombre: ${n}\nFecha: ${d}\nHora: ${h}\nPersonas: ${p}\nZona: ${z}${c ? `\nOcasión: ${c}` : ''}`,
    },
    foot: { rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    loader: { up: 'Going up to the rooftop', tag: 'Kitchen & Rooftop', place: 'Mediterranean & Caribbean · Santa Marta', skip: 'Enter', switching: 'Switching language to' },
    nav: { kitchen: 'Kitchen', roof: 'Rooftop', menu: 'Menu', lunch: 'Lunch Day', events: 'Events', visit: 'Visit us', book: 'Book', lang: 'Language', open: 'Open menu', close: 'Close menu' },
    hero: {
      eyebrow: 'Historic Center · Santa Marta', sub1: 'Mediterranean & Caribbean cuisine', sub2: 'the table downstairs, the rooftop above',
      lead: 'Caribbean seafood, Mediterranean recipes and signature cocktails in a house of brick, books and woven lamps. And when the sun goes down, head up to the rooftop.',
      c1: 'Book a table', c2: 'See the menu', scroll: 'Scroll',
      waMsg: 'Hi BELO! I would like to book a table.',
    },
    tape: ['Mediterranean cuisine', 'Caribbean flavor', 'Rooftop', 'Signature cocktails', 'Lunch Day', 'Historic Center'],
    floors: {
      eyebrow: 'Two floors, two worlds', floor: 'Floor',
      f1: { n: 'Kitchen', t: 'Downstairs, the kitchen', d: 'Exposed brick, bookshelves, woven lamps and marble tables. Here the Mediterranean is cooked with Caribbean produce.' },
      f2: { n: 'Rooftop', t: 'Upstairs, the rooftop', d: 'The lit-up cathedral, the DJ, the sea breeze and signature cocktails under Santa Marta’s stars.' },
    },
    dishes: { eyebrow: 'New dishes', title: 'From the Mediterranean to the Caribbean', lead: 'What’s new in BELO’s kitchen.', order: 'Book to try it' },
    lunch: {
      eyebrow: 'New experience', title: 'Lunch Day', sub: 'with neighborhood cooking',
      lead: 'House lunches with the flavor you love and BELO’s style.', from: 'Lunches from', days: 'Monday to Friday', hours: '12:00 p.m. – 3:00 p.m.',
      cta: 'Ask for today’s lunch', msg: 'Hi BELO! I would like information about today’s Lunch Day.',
    },
    bar: { eyebrow: 'The bar', title: 'Signature cocktails', bottles: 'Bottles to share', lead: 'Our own recipes, premium spirits and bottles to celebrate at the table.' },
    events: {
      eyebrow: 'Events', title: 'There is always a reason',
      items: [
        { t: 'Your birthday', d: 'Celebrate your birthday with us and get a free dinner.', cta: 'Book my birthday', msg: 'Hi BELO! I would like to celebrate my birthday with you.' },
        { t: 'Football on the big screen', d: 'Football passion lives here: matches on the big screen and beer buckets.', cta: 'Book for the match', msg: 'Hi BELO! I would like to book to watch the match.' },
        { t: 'Rooftop nights', d: 'DJ, lights and the cathedral in the background. A new space for Santa Marta nights.', cta: 'Book the rooftop', msg: 'Hi BELO! I would like to book on the rooftop.' },
      ],
    },
    menu: {
      eyebrow: 'The menu', title: 'Full menu', lead: 'Starters, mains, Lunch Day, desserts, spirits, cocktails, drinks and wines, with a photo of every dish.',
      full: 'See the full menu', back: 'Back to home', digital: 'Official digital menu', new: 'New', ref: 'Reference', order: 'Book',
      note: 'Dishes marked "Reference" and their prices are examples: check the day’s menu with the restaurant.',
      cats: { entradas: 'Starters', fuertes: 'Mains', lunch: 'Lunch Day', postres: 'Desserts', licores: 'Spirits', cocteles: 'Cocktails', bebidas: 'Drinks', vinos: 'Wines' },
      orderMsg: (n) => `Hi BELO! I would like to book and try: ${n}`,
    },
    gal: { eyebrow: 'Gallery', title: 'Life at BELO', lead: 'Scroll to walk through the house.', close: 'Close', prev: 'Previous', next: 'Next' },
    visit: {
      title: 'See you in the Historic Center', lead: 'Book your table downstairs or on the rooftop. We confirm on WhatsApp.',
      addr: 'Address', map: 'Get directions', book: 'Bookings', hours: 'Hours', lunchH: 'Lunch Day: Monday to Friday, 12:00 p.m. – 3:00 p.m.', otherH: 'Dinner and rooftop: message us for today’s hours',
      formT: 'Book your table', name: 'Name', namePh: 'Your name', date: 'Date', time: 'Time', people: 'Guests', zone: 'Where', zones: ['Restaurant', 'Rooftop', 'Whatever is available'],
      note: 'Occasion', notePh: 'Birthday, anniversary, match… (optional)', send: 'Book via WhatsApp', one: 'guest', many: 'guests',
      msg: (n, d, h, p, z, c) => `Hi BELO! I would like to book a table.\nName: ${n}\nDate: ${d}\nTime: ${h}\nGuests: ${p}\nArea: ${z}${c ? `\nOccasion: ${c}` : ''}`,
    },
    foot: { rights: 'All rights reserved.', top: 'Back to top' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('belo_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('belo_lang', lang); } catch { /* sin almacenamiento */ }
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
