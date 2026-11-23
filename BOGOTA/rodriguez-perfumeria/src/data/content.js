
export const LOGO = `${import.meta.env.BASE_URL}logo.webp`;

export const BRAND = { name: 'Rodriguez Perfumería', short: 'Rodriguez', tagline: 'Perfumería de autor' };

export const CONTACT = {
  whatsapp: '573238349710',
  phoneDisplay: '+57 323 834 9710',
  instagram: 'https://www.instagram.com/rodriguez.perfumeria',
  instagramHandle: '@rodriguez.perfumeria',
};

export const waLink = (text) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
export const cop = (n) => '$' + n.toLocaleString('es-CO');

const IMG = {
  bottle: '1590156221350-bbf9f89cd368',
  pour: '1709662369957-0cbf9f8452fc',
  shelf: '1758225502621-9102d2856dc8',
  closeup: '1675255425189-ac9da0ae7d96',
  malle: '1699106358249-7aaa96f1224a',
};
export const photo = (k, w = 900) => `https://images.unsplash.com/photo-${IMG[k]}?auto=format&fit=crop&q=70&w=${w}`;

export const NAV = [
  ['categorias', 'Categorías'],
  ['coleccion', 'Colección'],
  ['esencia', 'Esencia'],
  ['asesor', 'Asesor'],
  ['contacto', 'Contacto'],
];

export const CATS = [
  { f: 'hombre', t: 'Para él', s: 'Amaderados, cuero y frescos', k: 'bottle', pos: '50% 45%' },
  { f: 'mujer', t: 'Para ella', s: 'Florales, gourmand y luminosos', k: 'closeup', pos: '50% 50%' },
  { f: 'arabe', t: 'Árabes', s: 'Oud, ámbar y especias', k: 'pour', pos: '50% 50%' },
  { f: 'unisex', t: 'Unisex', s: 'Sin género, con carácter', k: 'malle', pos: '50% 50%' },
  { f: 'todos', t: 'Decants y regalos', s: 'Prueba antes de elegir', k: 'shelf', pos: '50% 50%' },
];

export const MARQUEE = ['Originales', 'Árabes', 'Nicho', 'Decants', 'Regalos', 'Envíos a todo el país'];

export const STATS = [
  { value: 100, suffix: '%', label: 'Originales' },
  { value: 60, prefix: '+', label: 'Aromas' },
  { value: 24, suffix: 'h', label: 'Respuesta' },
];

export const STAGES = [
  { k: 'Salida', t: 'Los primeros segundos', n: ['Bergamota', 'Pimienta rosa', 'Cardamomo'] },
  { k: 'Corazón', t: 'Donde nace el carácter', n: ['Rosa de Damasco', 'Jazmín', 'Iris'] },
  { k: 'Fondo', t: 'La huella que se queda', n: ['Oud', 'Ámbar', 'Vainilla', 'Almizcle'] },
];

export const SIZES = [
  { l: 'Decant 10 ml', f: 0.16 },
  { l: '50 ml', f: 0.6 },
  { l: '100 ml', f: 1 },
];
export const priceFor = (p, s) => Math.round((p.price * s.f) / 1000) * 1000;

export const FILTERS = [
  ['todos', 'Todos'],
  ['hombre', 'Hombre'],
  ['mujer', 'Mujer'],
  ['unisex', 'Unisex'],
  ['arabe', 'Árabes'],
];

export const PRODUCTS = [
  { id: 'noir-absolu', name: 'Noir Absolu', gender: 'hombre', arabe: false, family: 'Amaderado oscuro', desc: 'Oscuro, magnético y seguro de sí mismo.', notes: { top: ['Pimienta negra', 'Bergamota'], heart: ['Cuero', 'Lavanda'], base: ['Vetiver', 'Haba tonka'] }, price: 289000, tag: 'Más vendido', shape: 'classic', liquid: '#7a3b12', glow: '#c2711f', occasions: ['noche', 'citas'], intensity: 'intenso', feat: true },
  { id: 'ambar-real', name: 'Ámbar Real', gender: 'unisex', arabe: true, family: 'Ámbar oriental', desc: 'Calidez dorada que dura todo el día.', notes: { top: ['Azafrán', 'Canela'], heart: ['Rosa', 'Oud'], base: ['Ámbar', 'Vainilla'] }, price: 245000, tag: 'Árabe', shape: 'arab', liquid: '#a8641a', glow: '#e0a040', occasions: ['noche', 'citas'], intensity: 'intenso', feat: true },
  { id: 'rosa-eterna', name: 'Rosa Eterna', gender: 'mujer', arabe: false, family: 'Floral elegante', desc: 'Delicada, luminosa y completamente memorable.', notes: { top: ['Frambuesa', 'Pera'], heart: ['Rosa de Damasco', 'Peonía'], base: ['Almizcle', 'Sándalo'] }, price: 265000, tag: 'Nuevo', shape: 'round', liquid: '#b04466', glow: '#e06b92', occasions: ['dia', 'citas', 'trabajo'], intensity: 'suave', feat: true },
  { id: 'citrico-alba', name: 'Cítrico Alba', gender: 'hombre', arabe: false, family: 'Cítrico fresco', desc: 'Energía limpia para empezar el día.', notes: { top: ['Limón', 'Mandarina', 'Menta'], heart: ['Neroli', 'Jengibre'], base: ['Cedro', 'Almizcle'] }, price: 198000, tag: null, shape: 'tall', liquid: '#b9c53d', glow: '#d7e06a', occasions: ['dia', 'trabajo'], intensity: 'suave', feat: true },
  { id: 'oud-medianoche', name: 'Oud Medianoche', gender: 'unisex', arabe: true, family: 'Oud profundo', desc: 'Misterio líquido para noches que se recuerdan.', notes: { top: ['Cardamomo', 'Incienso'], heart: ['Oud', 'Rosa turca'], base: ['Sándalo', 'Ámbar gris'] }, price: 340000, tag: 'Exclusivo', shape: 'arab', liquid: '#4a1d3c', glow: '#9a4a86', occasions: ['noche'], intensity: 'intenso', feat: true },
  { id: 'vainilla-nocturna', name: 'Vainilla Nocturna', gender: 'mujer', arabe: false, family: 'Gourmand', desc: 'Dulce, envolvente y adictiva.', notes: { top: ['Pera', 'Pimienta rosa'], heart: ['Orquídea', 'Café'], base: ['Vainilla', 'Praliné'] }, price: 255000, tag: null, shape: 'classic', liquid: '#c58a3a', glow: '#f0b45a', occasions: ['noche', 'citas'], intensity: 'intenso', feat: true },
  { id: 'cuero-dorado', name: 'Cuero Dorado', gender: 'hombre', arabe: false, family: 'Cuero y especias', desc: 'Elegancia robusta con carácter propio.', notes: { top: ['Cardamomo', 'Naranja'], heart: ['Cuero', 'Iris'], base: ['Ámbar', 'Musgo'] }, price: 310000, tag: null, shape: 'tall', liquid: '#5a3416', glow: '#b06f30', occasions: ['noche', 'trabajo'], intensity: 'intenso', feat: false },
  { id: 'jazmin-seda', name: 'Jazmín de Seda', gender: 'mujer', arabe: false, family: 'Floral blanco', desc: 'Suave como seda, fresca como la mañana.', notes: { top: ['Mandarina', 'Lichi'], heart: ['Jazmín', 'Flor de tiaré'], base: ['Almizcle blanco', 'Cedro'] }, price: 238000, tag: null, shape: 'round', liquid: '#e2cf9a', glow: '#f3e3b5', occasions: ['dia', 'trabajo'], intensity: 'suave', feat: false },
  { id: 'sandalo-imperial', name: 'Sándalo Imperial', gender: 'unisex', arabe: true, family: 'Amaderado cremoso', desc: 'Madera cálida y cremosa, de aire real.', notes: { top: ['Azafrán', 'Cardamomo'], heart: ['Sándalo', 'Rosa'], base: ['Ámbar', 'Almizcle'] }, price: 275000, tag: 'Árabe', shape: 'classic', liquid: '#8a5a2a', glow: '#c9955a', occasions: ['dia', 'noche'], intensity: 'intenso', feat: false },
  { id: 'brisa-marina', name: 'Brisa Marina', gender: 'unisex', arabe: false, family: 'Acuático', desc: 'Sal, sol y mar en cada aplicación.', notes: { top: ['Sal marina', 'Pomelo'], heart: ['Algas', 'Salvia'], base: ['Madera flotada', 'Almizcle'] }, price: 185000, tag: null, shape: 'tall', liquid: '#2f8fb0', glow: '#58c0e0', occasions: ['dia'], intensity: 'suave', feat: false },
  { id: 'tabaco-miel', name: 'Tabaco & Miel', gender: 'hombre', arabe: false, family: 'Tabaco dulce', desc: 'Cálido, dulce y con presencia.', notes: { top: ['Hoja de tabaco', 'Canela'], heart: ['Miel', 'Haba tonka'], base: ['Vainilla', 'Madera seca'] }, price: 295000, tag: null, shape: 'classic', liquid: '#8c4a14', glow: '#d08a2a', occasions: ['noche'], intensity: 'intenso', feat: false },
  { id: 'azahar-blanco', name: 'Azahar Blanco', gender: 'mujer', arabe: false, family: 'Floral cítrico', desc: 'Luz de verano en un frasco.', notes: { top: ['Naranja', 'Bergamota'], heart: ['Azahar', 'Jazmín'], base: ['Almizcle', 'Madera clara'] }, price: 225000, tag: null, shape: 'round', liquid: '#e8dcc0', glow: '#f6efe2', occasions: ['dia', 'trabajo', 'citas'], intensity: 'suave', feat: false },
];

export const QUIZ = [
  { k: 'who', q: '¿Para quién es?', o: [['hombre', 'Para él'], ['mujer', 'Para ella'], ['unisex', 'Sin género'], ['any', 'Sorpréndeme']] },
  { k: 'occ', q: '¿Para qué momento?', o: [['dia', 'Día a día'], ['trabajo', 'Trabajo'], ['citas', 'Una cita'], ['noche', 'Noche']] },
  { k: 'int', q: '¿Qué intensidad prefieres?', o: [['suave', 'Suave y fresca'], ['intenso', 'Intensa y duradera']] },
];
