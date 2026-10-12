// ============================================================
// ZULIMA · Consultora de belleza Natura
// ------------------------------------------------------------
// 1) Llena tus datos en CONFIG (WhatsApp, Instagram, ciudad).
// 2) Actualiza precios y productos en PRODUCTS cada ciclo.
//    · fav: true      → aparece en "Favoritos de Zulima"
//    · oldPrice: 999  → (opcional) muestra el precio anterior tachado si hay una oferta REAL del ciclo
//    · ilustración: art = { k: tipo, c: color del producto, a: color de la tapa/acento }
//      tipos: 'perfume-round' 'perfume-square' 'perfume-tall' 'perfume-flask' 'tube' 'jar' 'pump' 'soap' 'bottle' 'kit'
// Los precios incluidos son de REFERENCIA: cámbialos por los del ciclo vigente.
// ============================================================

export const CONFIG = {
  name: 'Zulima',
  whatsapp: '573000000000', // ← tu número con 57 adelante, sin espacios ni +
  instagram: '', // ← tu usuario de Instagram (sin @). Si queda vacío, no se muestra
  city: 'Colombia', // ← tu ciudad
  delivery: 'Entregas a domicilio en la ciudad y envíos a todo el país',
  payments: ['Efectivo', 'Nequi', 'Daviplata', 'Transferencia'],
};

// img: foto de la categoría (Unsplash). d: frase corta para la tarjeta
export const CATS = [
  { id: 'todos', n: 'Todo', icon: '✦' },
  { id: 'perfumes', n: 'Perfumes', icon: '🌸', img: '1541643600914-78b084683601', d: 'Aromas para cada momento' },
  { id: 'cuerpo', n: 'Cuidado corporal', icon: '🧴', img: '1556228578-8c89e6adf883', d: 'Hidratación que se siente' },
  { id: 'manos', n: 'Manos', icon: '🤲', img: '1612817288484-6f916006741a', d: 'Suaves todo el día' },
  { id: 'jabones', n: 'Jabones', icon: '🫧', img: '1600857544200-b2f666a9a2ec', d: 'Puro vegetal' },
  { id: 'cabello', n: 'Cabello', icon: '💇', img: '1631729371254-42c2892f0e6e', d: 'Brillo y fuerza' },
  { id: 'rostro', n: 'Rostro', icon: '✨', img: '1620916566398-39f1143ab7be', d: 'Tu piel, radiante' },
  { id: 'kits', n: 'Kits de regalo', icon: '🎁', img: '1513885535751-8b9238bd345a', d: 'Detalles que enamoran' },
];

// Fotos de ambiente (Unsplash)
export const MOOD = {
  hero: '1522335789203-aabd1fc54bc9',
  ritual: ['1600857544200-b2f666a9a2ec', '1556228578-8c89e6adf883', '1541643600914-78b084683601'],
  about: '1596462502278-27bfdc403348',
};

export const U = (id, w = 800) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`);

export const FOR = [
  { id: 'all', n: 'Para todos' },
  { id: 'ella', n: 'Para ella' },
  { id: 'el', n: 'Para él' },
];

// familias olfativas (para "Encuentra tu aroma")
export const FAMILIES = {
  floral: 'Floral', amaderado: 'Amaderado', citrico: 'Cítrico', frutal: 'Frutal', aromatico: 'Aromático', oriental: 'Oriental',
};

const P = (o) => o;

export const PRODUCTS = [
  // ---------- Perfumes para ella
  P({ id: 1, img: '1541643600914-78b084683601', cat: 'perfumes', for: 'ella', line: 'Essencial', name: 'Essencial Exclusivo Floral', size: 'Eau de parfum · 100 ml', price: 219900, fav: true, family: 'floral', notes: 'Flores blancas, rosa y almizcle', desc: 'Elegante e intenso, para las ocasiones especiales.', art: { k: 'perfume-square', c: '#e8c9b4', a: '#b8885a' } }),
  P({ id: 2, img: '1592945403244-b3fbafd7f539', cat: 'perfumes', for: 'ella', line: 'Luna', name: 'Luna Radiante', size: 'Eau de parfum · 75 ml', price: 159900, family: 'floral', notes: 'Flores luminosas y maderas suaves', desc: 'Femenino y radiante, para todos los días.', art: { k: 'perfume-round', c: '#f2d4dc', a: '#c98a9b' } }),
  P({ id: 3, img: '1523293182086-7651a899d37f', cat: 'perfumes', for: 'ella', line: 'Humor', name: 'Humor Meu Primeiro', size: 'Deo colonia · 75 ml', price: 99900, family: 'frutal', notes: 'Frutal y divertido', desc: 'Alegre y fresco, ideal para el día.', art: { k: 'perfume-flask', c: '#f6c6a8', a: '#e0785a' } }),
  P({ id: 4, img: '1587017539504-67cfbddac569', cat: 'perfumes', for: 'ella', line: 'Ilía', name: 'Ilía Secreto', size: 'Deo parfum · 50 ml', price: 149900, family: 'oriental', notes: 'Floral oriental envolvente', desc: 'Sensual y misterioso, para la noche.', art: { k: 'perfume-tall', c: '#c79bb0', a: '#6e3b55' } }),
  P({ id: 5, img: '1595425970377-c9703cf48b6d', cat: 'perfumes', for: 'ella', line: 'Kriska', name: 'Kriska Drama', size: 'Deo colonia · 100 ml', price: 89900, family: 'frutal', notes: 'Frutal intenso', desc: 'Atrevido y con mucha personalidad.', art: { k: 'perfume-round', c: '#e7a9b9', a: '#a33d5b' } }),

  // ---------- Perfumes para él
  P({ id: 6, img: '1594035910387-fea47794261f', cat: 'perfumes', for: 'el', line: 'Kaiak', name: 'Kaiak Clásico', size: 'Deo colonia · 100 ml', price: 119900, fav: true, family: 'aromatico', notes: 'Acuático, fresco y aromático', desc: 'Un clásico fresco para el día a día.', art: { k: 'perfume-flask', c: '#9cc7d6', a: '#2f6a86' } }),
  P({ id: 7, img: '1610461888750-10bfc601b874', cat: 'perfumes', for: 'el', line: 'Kaiak', name: 'Kaiak Aventura', size: 'Deo colonia · 100 ml', price: 119900, family: 'citrico', notes: 'Cítrico y vibrante', desc: 'Energía y frescura para salir a explorar.', art: { k: 'perfume-flask', c: '#a9cf9a', a: '#3f7a4c' } }),
  P({ id: 8, img: '1563170351-be82bc888aa4', cat: 'perfumes', for: 'el', line: 'Essencial', name: 'Essencial Masculino', size: 'Deo parfum · 100 ml', price: 189900, fav: true, family: 'amaderado', notes: 'Maderas y especias', desc: 'Intenso y sofisticado, con presencia.', art: { k: 'perfume-square', c: '#b88a5e', a: '#3a2a20' } }),
  P({ id: 9, img: '1588405748880-12d1d2a59f75', cat: 'perfumes', for: 'el', line: 'Homem', name: 'Homem Essence', size: 'Deo parfum · 100 ml', price: 169900, family: 'amaderado', notes: 'Amaderado con café y especias', desc: 'Moderno y masculino, para la noche.', art: { k: 'perfume-tall', c: '#6f5a4a', a: '#1f1a17' } }),

  // ---------- Unisex
  P({ id: 10, img: '1615634260167-c8cdede054de', cat: 'perfumes', for: 'all', line: 'Ekos', name: 'Ekos Frescor Maracuyá', size: 'Deo colonia · 150 ml', price: 89900, family: 'frutal', notes: 'Maracuyá fresco y luminoso', desc: 'La frescura de la biodiversidad brasileña.', art: { k: 'bottle', c: '#f3c45a', a: '#7a5a1f' } }),
  P({ id: 11, img: '1590736969955-71cc94901144', cat: 'perfumes', for: 'all', line: 'Ekos', name: 'Ekos Frescor Pitanga', size: 'Deo colonia · 150 ml', price: 89900, family: 'citrico', notes: 'Pitanga cítrica y jugosa', desc: 'Refrescante para usar todo el día.', art: { k: 'bottle', c: '#ef8d6a', a: '#8b3a22' } }),

  // ---------- Cuidado corporal
  P({ id: 12, img: '1556228578-8c89e6adf883', cat: 'cuerpo', for: 'all', line: 'Tododia', name: 'Crema corporal Cereza y Avellana', size: '400 ml', price: 52900, fav: true, desc: 'Hidratación prolongada con aroma delicioso.', art: { k: 'pump', c: '#d9536a', a: '#f4e6dc' } }),
  P({ id: 13, img: '1571781926291-c477ebfd024b', cat: 'cuerpo', for: 'all', line: 'Tododia', name: 'Crema corporal Algodón', size: '400 ml', price: 52900, desc: 'Suave y ligera, aroma a ropa limpia.', art: { k: 'pump', c: '#e9eef2', a: '#8fa6b8' } }),
  P({ id: 14, img: '1570194065650-d99fb4bedf0a', cat: 'cuerpo', for: 'all', line: 'Ekos', name: 'Pulpa hidratante Castaña', size: '400 ml', price: 69900, desc: 'Nutrición intensa para piel seca.', art: { k: 'jar', c: '#c9965c', a: '#5a3a1e' } }),
  P({ id: 15, img: '1608571423902-eed4a5ad8108', cat: 'cuerpo', for: 'all', line: 'Ekos', name: 'Aceite trifásico Maracuyá', size: '200 ml', price: 64900, desc: 'Aceite para el cuerpo con aroma relajante.', art: { k: 'bottle', c: '#f2b544', a: '#6b4a12' } }),
  P({ id: 16, img: '1620916566398-39f1143ab7be', cat: 'cuerpo', for: 'el', line: 'Kaiak', name: 'Desodorante roll-on Kaiak', size: '75 ml', price: 24900, desc: 'Protección y frescura todo el día.', art: { k: 'tube', c: '#9cc7d6', a: '#2f6a86' } }),

  // ---------- Manos
  P({ id: 17, img: '1612817288484-6f916006741a', cat: 'manos', for: 'all', line: 'Ekos', name: 'Crema de manos Castaña', size: '75 g', price: 29900, fav: true, desc: 'Manos nutridas y suaves sin sensación grasosa.', art: { k: 'tube', c: '#c9965c', a: '#5a3a1e' } }),
  P({ id: 18, img: '1598440947619-2c35fc9aa908', cat: 'manos', for: 'all', line: 'Ekos', name: 'Crema de manos Maracuyá', size: '75 g', price: 29900, desc: 'Hidrata y perfuma con frescura.', art: { k: 'tube', c: '#f3c45a', a: '#7a5a1f' } }),
  P({ id: 19, img: '1601049541289-9b1b7bbbfe19', cat: 'manos', for: 'all', line: 'Tododia', name: 'Crema de manos Cereza y Avellana', size: '50 g', price: 22900, desc: 'Ideal para llevar en la cartera.', art: { k: 'tube', c: '#d9536a', a: '#f4e6dc' } }),

  // ---------- Jabones
  P({ id: 20, img: '1600857544200-b2f666a9a2ec', cat: 'jabones', for: 'all', line: 'Ekos', name: 'Jabones en barra puro vegetal', size: 'Caja x 5 · 90 g c/u', price: 39900, fav: true, desc: 'Surtidos de la biodiversidad: castaña, maracuyá, andiroba y más.', art: { k: 'soap', c: '#e6c48f', a: '#4f7a4a' } }),
  P({ id: 21, img: '1607006344380-b6775a0824a7', cat: 'jabones', for: 'all', line: 'Tododia', name: 'Jabones en barra Tododia', size: 'Caja x 5 · 90 g c/u', price: 34900, desc: 'Limpieza suave con aroma para todo el día.', art: { k: 'soap', c: '#f2c1cb', a: '#c45b74' } }),
  P({ id: 22, img: '1584305574647-0cc949a2bb9f', cat: 'jabones', for: 'all', line: 'Ekos', name: 'Jabón líquido Castaña', size: '250 ml', price: 32900, desc: 'Limpia sin resecar, con espuma cremosa.', art: { k: 'pump', c: '#c9965c', a: '#5a3a1e' } }),

  // ---------- Cabello
  P({ id: 23, img: '1631729371254-42c2892f0e6e', cat: 'cabello', for: 'all', line: 'Lumina', name: 'Shampoo Lumina reparación', size: '300 ml', price: 39900, desc: 'Repara y da brillo al cabello dañado.', art: { k: 'bottle', c: '#8a6fb3', a: '#3d2a5e' } }),
  P({ id: 24, img: '1535585209827-a15fcdbc4c2d', cat: 'cabello', for: 'all', line: 'Ekos', name: 'Shampoo Patauá', size: '300 ml', price: 36900, desc: 'Fortalece y reduce la caída por quiebre.', art: { k: 'bottle', c: '#5e7a52', a: '#24361f' } }),

  // ---------- Rostro
  P({ id: 25, img: '1620916297397-a4a5402a3c6c', cat: 'rostro', for: 'ella', line: 'Chronos', name: 'Gel crema antiseñales', size: '40 g', price: 89900, desc: 'Hidrata y suaviza las líneas de expresión.', art: { k: 'jar', c: '#f1ebe6', a: '#8b6a5c' } }),
  P({ id: 26, img: '1621607512214-68297480165e', cat: 'rostro', for: 'el', line: 'Homem', name: 'Gel de afeitar Homem', size: '75 g', price: 34900, desc: 'Afeitado suave que protege la piel.', art: { k: 'tube', c: '#6f5a4a', a: '#1f1a17' } }),

  // ---------- Kits
  P({ id: 27, img: '1513885535751-8b9238bd345a', cat: 'kits', for: 'ella', line: 'Kit', name: 'Kit regalo Ella', size: 'Perfume + crema corporal + jabones', price: 199900, fav: true, desc: 'Un detalle completo en caja de regalo.', art: { k: 'kit', c: '#e8c9b4', a: '#c8693f' } }),
  P({ id: 28, img: '1549465220-1a8b9238cd48', cat: 'kits', for: 'el', line: 'Kit', name: 'Kit regalo Él', size: 'Perfume + desodorante + gel de afeitar', price: 179900, desc: 'Listo para regalar en cualquier ocasión.', art: { k: 'kit', c: '#9cc7d6', a: '#2f4a3a' } }),
];

export const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
