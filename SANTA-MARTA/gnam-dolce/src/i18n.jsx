import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================
// CONTACTO (de su Instagram y su carta)
// ============================================================
export const WHATSAPP = '573214086024'; // Reservas
export const IG = 'gnam_dolce';
export const ADDRESS = 'Calle 17 # 3-59, Centro Histórico, Santa Marta';
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=Gnam+Dolce+Calle+17+%233-59+Santa+Marta';
export const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const LANGS = [
  { code: 'es', label: 'Español', locale: 'es-CO' },
  { code: 'en', label: 'English', locale: 'en-US' },
];
const IDX = { es: 0, en: 1 };

export const DICT = {
  es: {
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    loader: { making: 'Preparando tu copa', skip: 'Entrar', switching: 'Cambiando idioma a' },
    nav: { day: 'Un día en Gnam', gelato: 'Gelato', menu: 'La carta', gallery: 'Galería', visit: 'Visítanos', book: 'Reservar', lang: 'Idioma', open: 'Abrir menú', close: 'Cerrar menú' },
    hero: {
      kicker: 'Restaurante · Cafetería · Gelato artesanal',
      line: 'Brunch, pastas, pizzetas de masa madurada 48 horas y el gelato que hacemos en casa, en el corazón del Centro Histórico de Santa Marta.',
      c1: 'Reservar mesa', c2: 'Ver la carta', badge: 'Dolce Vita', scroll: 'Baja despacio',
      msg: '¡Hola Gnam Dolce! Quiero reservar una mesa.',
    },
    ribbon: ['Brunch', 'Gelato de la casa', 'Pastas', 'Pizzetas 48 h', 'Waffles', 'Affogatos', 'Milkshakes'],
    day: {
      eyebrow: 'Un día en Gnam', title: 'De la primera taza a la última copa',
      moments: [
        { t: 'Brunch', d: 'Desde la mañana: toasts de masa madre, cayeye, pancakes y café.' },
        { t: 'Hora del gelato', d: 'Desde la 1:00 p. m. llegan las copas con nuestro gelato artesanal.' },
        { t: 'Cocina italiana', d: 'A partir de las 5:00 p. m.: pastas, lasañas y pizzetas de masa de 48 horas.' },
        { t: 'Noche especial', d: 'Costillas ahumadas, cortes, salmón toscano y langostinos bravos.' },
      ],
      am: 'a. m.', pm: 'p. m.', see: 'Ver en la carta',
    },
    gelato: {
      eyebrow: 'Hecho en casa', title: 'Arma tu copa', lead: 'Elige hasta tres sabores de nuestro gelato y un topping. Te decimos qué copa de la carta es para ti.',
      flavors: 'Sabores', toppings: 'Topping', pick: 'Te recomendamos', order: 'Reservar y pedirla', clear: 'Empezar de nuevo',
      msg: (c) => `¡Hola Gnam Dolce! Quiero reservar y probar la copa ${c}.`,
    },
    menu: {
      eyebrow: 'La carta 2026', title: 'Todo lo que te espera', lead: 'Cinco mundos en una sola carta. Toca uno para verlo completo, con precios.',
      full: 'Ver la carta completa', back: 'Volver al inicio', items: 'platos', from: 'desde',
      blurb: { cafe: 'Espresso, lattes fríos y affogatos con nuestro gelato.', brunch: 'Toasts, paninis, pancakes y sándwiches hasta las 2:00 p. m.', cocina: 'Pastas, lasañas, pizzetas y especiales desde las 5:00 p. m.', bebidas: 'Granizadas, smoothies, sodas y copas de vino.', dolce: 'Milkshakes, waffles, bowls y copas con gelato.' },
      note: 'Precios en pesos colombianos tomados de la carta 2026 de Gnam Dolce.',
    },
    gal: { eyebrow: 'Galería', title: '#TuLugarDulce', lead: 'Baja y repartimos la mesa.' },
    visit: {
      title: 'Te esperamos en el Centro Histórico', lead: 'Reserva tu mesa por WhatsApp y te confirmamos enseguida.',
      addr: 'Dirección', map: 'Cómo llegar', book: 'Reservas', hours: 'Horario', closed: 'Sin servicio', today: 'Hoy', open: 'Abierto ahora', closedNow: 'Cerrado ahora', until: 'hasta las', note: 'Los martes no hay servicio.',
      formT: 'Reserva tu mesa', name: 'Nombre', namePh: 'Tu nombre', date: 'Fecha', time: 'Hora', people: 'Personas', occ: 'Ocasión', occPh: 'Cumpleaños, brunch, cita… (opcional)', send: 'Reservar por WhatsApp', one: 'persona', many: 'personas', tuesday: 'Los martes no hay servicio: elige otro día.',
      msg: (n, d, h, p, c) => `¡Hola Gnam Dolce! Quiero reservar una mesa.\nNombre: ${n}\nFecha: ${d}\nHora: ${h}\nPersonas: ${p}${c ? `\nOcasión: ${c}` : ''}`,
    },
    foot: { rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    loader: { making: 'Making your sundae', skip: 'Enter', switching: 'Switching language to' },
    nav: { day: 'A day at Gnam', gelato: 'Gelato', menu: 'Menu', gallery: 'Gallery', visit: 'Visit us', book: 'Book', lang: 'Language', open: 'Open menu', close: 'Close menu' },
    hero: {
      kicker: 'Restaurant · Café · Artisan gelato',
      line: 'Brunch, pasta, pizzettas with 48-hour dough and the gelato we make in-house, in the heart of Santa Marta’s Historic Center.',
      c1: 'Book a table', c2: 'See the menu', badge: 'Dolce Vita', scroll: 'Scroll slowly',
      msg: 'Hi Gnam Dolce! I would like to book a table.',
    },
    ribbon: ['Brunch', 'House gelato', 'Pasta', '48h pizzettas', 'Waffles', 'Affogatos', 'Milkshakes'],
    day: {
      eyebrow: 'A day at Gnam', title: 'From the first cup to the last sundae',
      moments: [
        { t: 'Brunch', d: 'From the morning: sourdough toasts, cayeye, pancakes and coffee.' },
        { t: 'Gelato time', d: 'From 1:00 p.m. the sundaes arrive with our artisan gelato.' },
        { t: 'Italian kitchen', d: 'From 5:00 p.m.: pasta, lasagna and 48-hour-dough pizzettas.' },
        { t: 'Special night', d: 'Smoked ribs, steaks, Tuscan salmon and spicy prawns.' },
      ],
      am: 'a.m.', pm: 'p.m.', see: 'See on the menu',
    },
    gelato: {
      eyebrow: 'Made in-house', title: 'Build your sundae', lead: 'Pick up to three flavors of our gelato and a topping. We’ll tell you which sundae on the menu is yours.',
      flavors: 'Flavors', toppings: 'Topping', pick: 'We recommend', order: 'Book and order it', clear: 'Start over',
      msg: (c) => `Hi Gnam Dolce! I would like to book and try the ${c} sundae.`,
    },
    menu: {
      eyebrow: 'Menu 2026', title: 'Everything waiting for you', lead: 'Five worlds in one menu. Tap one to see it in full, with prices.',
      full: 'See the full menu', back: 'Back to home', items: 'items', from: 'from',
      blurb: { cafe: 'Espresso, iced lattes and affogatos with our gelato.', brunch: 'Toasts, paninis, pancakes and sandwiches until 2:00 p.m.', cocina: 'Pasta, lasagna, pizzettas and specials from 5:00 p.m.', bebidas: 'Slushies, smoothies, sodas and glasses of wine.', dolce: 'Milkshakes, waffles, bowls and gelato sundaes.' },
      note: 'Prices in Colombian pesos from Gnam Dolce’s 2026 menu. Dish descriptions are in Spanish.',
    },
    gal: { eyebrow: 'Gallery', title: '#TuLugarDulce', lead: 'Scroll and we’ll set the table.' },
    visit: {
      title: 'See you in the Historic Center', lead: 'Book your table on WhatsApp and we’ll confirm right away.',
      addr: 'Address', map: 'Get directions', book: 'Bookings', hours: 'Hours', closed: 'Closed', today: 'Today', open: 'Open now', closedNow: 'Closed now', until: 'until', note: 'Closed on Tuesdays.',
      formT: 'Book your table', name: 'Name', namePh: 'Your name', date: 'Date', time: 'Time', people: 'Guests', occ: 'Occasion', occPh: 'Birthday, brunch, date… (optional)', send: 'Book via WhatsApp', one: 'guest', many: 'guests', tuesday: 'We are closed on Tuesdays: please pick another day.',
      msg: (n, d, h, p, c) => `Hi Gnam Dolce! I would like to book a table.\nName: ${n}\nDate: ${d}\nTime: ${h}\nGuests: ${p}${c ? `\nOccasion: ${c}` : ''}`,
    },
    foot: { rights: 'All rights reserved.', top: 'Back to top' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('gnam_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('gnam_lang', lang); } catch { /* sin almacenamiento */ }
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
