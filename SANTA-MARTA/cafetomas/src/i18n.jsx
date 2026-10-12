import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================
// CONTACTO (de su Instagram). Completa WhatsApp y dirección cuando los tengas.
// ============================================================
export const IG = 'cafetomascol';
export const LINKTREE = 'https://linktr.ee/cafetomas';
export const WHATSAPP = ''; // ej. '573001234567' — si queda vacío, los botones llevan al Linktree
export const ADDRESS = ''; // ← escribe aquí la dirección de la tienda
export const contactLink = (text) => (WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}` : LINKTREE);

export const LANGS = [
  { code: 'es', label: 'Español', locale: 'es-CO' },
  { code: 'en', label: 'English', locale: 'en-US' },
];
const IDX = { es: 0, en: 1 };

export const DICT = {
  es: {
    loader: { extraction: 'Extracción', dose: 'Dosis', yield: 'Taza', tag: 'Maestría en café de especialidad', skip: 'Entrar', switching: 'Cambiando idioma a', ring: 'MAESTRÍA EN CAFÉ · COFFEE LAB · ESCUELA DE BARISMO · ' },
    nav: { coffee: 'El café', lab: 'Coffee Lab', school: 'Escuela', menu: 'Carta', gallery: 'Galería', contact: 'Contacto', cta: 'Escríbenos', lang: 'Idioma', open: 'Abrir menú', close: 'Cerrar menú' },
    hero: {
      eyebrow: 'Coffee Shop · Specialty Coffee Lab · Escuela de Barismo',
      l1: 'Maestría en café', l2: 'de especialidad',
      lead: 'Café de especialidad preparado con alta competencia: del grano a la taza, con métodos de filtrado, bebidas de autor y la escuela donde formamos baristas profesionales.',
      c1: 'Ver la carta', c2: 'Conoce la escuela', badge: 'Alta competencia',
      msg: '¡Hola Cafetomás! ☕ Quiero más información.',
    },
    tape: ['Café de especialidad', 'Coffee Lab', 'Escuela de barismo', 'Métodos de filtrado', 'Bebidas de autor', 'Latte art'],
    journey: {
      eyebrow: 'Del grano a la taza', title: 'Cada taza es un viaje',
      steps: [
        { t: 'Cereza', d: 'Todo empieza en la finca: cerezas de café maduras, recogidas una a una a mano.' },
        { t: 'Grano verde', d: 'Se despulpa, se fermenta y se seca hasta obtener el grano verde, lleno de potencial.' },
        { t: 'Tostión', d: 'El calor despierta azúcares y aromas. Cada perfil de tueste se diseña para resaltar el origen.' },
        { t: 'Molienda', d: 'Justo antes de preparar, molemos a la medida exacta de cada método.' },
        { t: 'Extracción', d: 'Agua, temperatura y tiempo en equilibrio: aquí está la maestría del barista.' },
        { t: 'Tu taza', d: 'Un café limpio, dulce y con carácter. Listo para disfrutarse despacio.' },
      ],
    },
    lab: {
      eyebrow: 'Coffee Lab', title: 'Calcula tu receta', lead: 'Elige un método y los gramos de café: te damos el agua, la temperatura, la molienda y el tiempo, como lo hacemos en la barra.',
      coffee: 'Café', water: 'Agua', ratio: 'Proporción', temp: 'Temperatura', grind: 'Molienda', time: 'Tiempo', grams: 'gramos de café',
    },
    menu: {
      eyebrow: 'La carta', title: 'Para todos los gustos de café', lead: 'Espresso, métodos de filtrado, bebidas de autor y panadería. Mira la carta completa con foto de cada producto.',
      full: 'Ver la carta completa', back: 'Volver al inicio', fav: 'Favorito', ref: 'Referencia', order: 'Pedir',
      note: 'Productos y precios de referencia: confírmalos con Cafetomás.',
      cats: { espresso: 'Espresso', metodos: 'Métodos', autor: 'De autor', frias: 'Frías', panaderia: 'Panadería' },
      orderMsg: (n) => `¡Hola Cafetomás! ☕ Quiero pedir: ${n}`,
    },
    school: {
      eyebrow: 'Escuela de Barismo Profesional', title: 'Anímate a ser un profesional del café',
      lead: 'Módulos prácticos en nuestra barra, con máquinas profesionales y baristas de alta competencia. Para empezar desde cero o perfeccionar tu técnica.',
      cta: 'Quiero inscribirme', msg: '¡Hola Cafetomás! 🎓 Quiero información de los módulos de barismo.', grads: '¡Graduados!',
      modules: [
        { t: 'Barismo Básico', d: 'Espresso, molienda, texturizado de leche y bebidas clásicas.' },
        { t: 'Barismo Básico Kids', d: 'Los más pequeños también aprenden el mundo del café (sin cafeína).' },
        { t: 'Latte Art', d: 'Corazón, tulipán y rosetta: técnica de vertido y texturas.' },
        { t: 'Métodos de filtrado', d: 'V60, Chemex, AeroPress y prensa: recetas y extracción.' },
        { t: 'Catación', d: 'Análisis sensorial: aroma, acidez, dulzor, cuerpo y final.' },
      ],
    },
    gal: { eyebrow: 'Galería', title: 'La vida en la barra', lead: 'Baja para girar.', cta: 'Ver Instagram' },
    contact: {
      title: '¿Un café?', lead: 'Escríbenos para pedidos, inscripciones a la escuela o para saber dónde encontrarnos.',
      ig: 'Instagram', links: 'Todos nuestros enlaces', where: 'Dónde estamos', whereV: 'Escríbenos y te contamos cómo llegar',
    },
    foot: { rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    loader: { extraction: 'Extraction', dose: 'Dose', yield: 'Cup', tag: 'Mastery in specialty coffee', skip: 'Enter', switching: 'Switching language to', ring: 'MASTERY IN COFFEE · COFFEE LAB · BARISTA SCHOOL · ' },
    nav: { coffee: 'Coffee', lab: 'Coffee Lab', school: 'School', menu: 'Menu', gallery: 'Gallery', contact: 'Contact', cta: 'Message us', lang: 'Language', open: 'Open menu', close: 'Close menu' },
    hero: {
      eyebrow: 'Coffee Shop · Specialty Coffee Lab · Barista School',
      l1: 'Mastery in', l2: 'specialty coffee',
      lead: 'Specialty coffee brewed at competition level: from bean to cup, with pour-over methods, signature drinks and the school where we train professional baristas.',
      c1: 'See the menu', c2: 'Discover the school', badge: 'Competition level',
      msg: 'Hi Cafetomás! ☕ I would like more information.',
    },
    tape: ['Specialty coffee', 'Coffee Lab', 'Barista school', 'Pour-over methods', 'Signature drinks', 'Latte art'],
    journey: {
      eyebrow: 'From bean to cup', title: 'Every cup is a journey',
      steps: [
        { t: 'Cherry', d: 'It all starts at the farm: ripe coffee cherries, hand-picked one by one.' },
        { t: 'Green bean', d: 'Pulped, fermented and dried into the green bean, full of potential.' },
        { t: 'Roast', d: 'Heat awakens sugars and aromas. Each roast profile is designed to highlight the origin.' },
        { t: 'Grind', d: 'Right before brewing, we grind to the exact size for each method.' },
        { t: 'Extraction', d: 'Water, temperature and time in balance: this is the barista’s mastery.' },
        { t: 'Your cup', d: 'A clean, sweet coffee with character. Ready to be enjoyed slowly.' },
      ],
    },
    lab: {
      eyebrow: 'Coffee Lab', title: 'Calculate your recipe', lead: 'Pick a method and the grams of coffee: we give you the water, temperature, grind and time, just like at our bar.',
      coffee: 'Coffee', water: 'Water', ratio: 'Ratio', temp: 'Temperature', grind: 'Grind', time: 'Time', grams: 'grams of coffee',
    },
    menu: {
      eyebrow: 'The menu', title: 'For every coffee taste', lead: 'Espresso, pour-over methods, signature drinks and bakery. See the full menu with a photo of every item.',
      full: 'See the full menu', back: 'Back to home', fav: 'Favorite', ref: 'Reference', order: 'Order',
      note: 'Reference products and prices: confirm them with Cafetomás.',
      cats: { espresso: 'Espresso', metodos: 'Methods', autor: 'Signature', frias: 'Cold', panaderia: 'Bakery' },
      orderMsg: (n) => `Hi Cafetomás! ☕ I would like to order: ${n}`,
    },
    school: {
      eyebrow: 'Professional Barista School', title: 'Become a coffee professional',
      lead: 'Hands-on modules at our bar, with professional machines and competition baristas. Start from scratch or perfect your technique.',
      cta: 'I want to enroll', msg: 'Hi Cafetomás! 🎓 I would like information about the barista modules.', grads: 'Graduates!',
      modules: [
        { t: 'Basic Barista', d: 'Espresso, grinding, milk texturing and classic drinks.' },
        { t: 'Basic Barista Kids', d: 'Little ones learn the world of coffee too (caffeine-free).' },
        { t: 'Latte Art', d: 'Heart, tulip and rosetta: pouring technique and textures.' },
        { t: 'Pour-over methods', d: 'V60, Chemex, AeroPress and French press: recipes and extraction.' },
        { t: 'Cupping', d: 'Sensory analysis: aroma, acidity, sweetness, body and finish.' },
      ],
    },
    gal: { eyebrow: 'Gallery', title: 'Life at the bar', lead: 'Scroll to spin.', cta: 'Open Instagram' },
    contact: {
      title: 'Coffee?', lead: 'Message us for orders, school enrollment or to find out where to find us.',
      ig: 'Instagram', links: 'All our links', where: 'Where we are', whereV: 'Message us and we’ll tell you how to get there',
    },
    foot: { rights: 'All rights reserved.', top: 'Back to top' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('ct_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('ct_lang', lang); } catch { /* sin almacenamiento */ }
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
