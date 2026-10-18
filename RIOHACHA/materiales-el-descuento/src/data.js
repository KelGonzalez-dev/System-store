// ============================================================
// MATERIALES EL DESCUENTO S.A.S ZESE — Riohacha
// "Tu aliado para la construcción" · Más de 20 años
// ------------------------------------------------------------
// ⚠️ IMPORTANTE: los productos, precios, promociones y noticias de este archivo son
// DATOS DE EJEMPLO para mostrar cómo se ve la tienda. Reemplázalos por los reales.
//   detal  = precio por unidad al detal
//   mayor  = precio por unidad al por mayor
//   min    = cantidad mínima para el precio al por mayor
//   unit   = unidad de venta (bulto, unidad, metro, m², galón…)
//   img    = foto (id de Unsplash o ruta local '/images/productos/...'); si no carga, se muestra la ilustración
//   art    = ilustración de respaldo { k: tipo, c: color, t: texto }
// ============================================================

export const CONFIG = {
  name: 'Materiales El Descuento',
  legal: 'MATERIALES EL DESCUENTO S.A.S ZESE',
  whatsapp: '573184009867', // de su Instagram
  instagram: 'materialeseldescuento',
  address: 'Cra 7 # 16-15',
  city: 'Riohacha, La Guajira 440002',
  maps: 'https://www.google.com/maps/search/?api=1&query=Cra+7+%2316-15+Riohacha+La+Guajira',
  mapsEmbed: 'https://www.google.com/maps?q=Carrera+7+16-15,+Riohacha,+La+Guajira&z=17&output=embed',
  years: 20,
};

// Horario real (de su Instagram). 0 = domingo. Minutos desde la medianoche.
export const HOURS = { 0: null, 1: [420, 1020], 2: [420, 960], 3: [420, 1020], 4: [420, 1020], 5: [420, 960], 6: [480, 720] };

export const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const U = (id, w = 600) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);
export const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
export const unitPrice = (p, q) => (q >= p.min ? p.mayor : p.detal);

export const L = {
  fachada: '/images/local/fachada.jpg', cementos: '/images/local/cementos.jpg', pegas: '/images/local/pegas.jpg',
  postCementos: '/images/local/post-cementos.jpg', postPegas: '/images/local/post-pegas.jpg', postFachada: '/images/local/post-fachada.jpg', quienes: '/images/local/quienes.jpg',
};

// Categorías: icono, ilustración y foto de portada (Unsplash; si falla, ilustración)
export const CATS = [
  { id: 'cementos', n: 'Cementos', d: 'Gris, blanco y especiales', art: { k: 'saco', c: '#1f4fa3', t: 'CEMENTO' }, img: L.cementos },
  { id: 'pegas', n: 'Morteros y pegas', d: 'Pegantes, morteros, boquillas', art: { k: 'saco', c: '#e2a21b', t: 'PEGANTE' }, img: L.pegas },
  { id: 'acero', n: 'Hierro y acero', d: 'Varilla, alambre, mallas', art: { k: 'varilla', c: '#7b5a4a' }, img: '1504307651254-35680f356dfd' },
  { id: 'obra-gris', n: 'Bloques y agregados', d: 'Bloque, ladrillo, arena, triturado', art: { k: 'bloque', c: '#a7a29a' }, img: '1590069261209-f8e9b8642343' },
  { id: 'plomeria', n: 'Plomería y PVC', d: 'Tubería, accesorios, tanques', art: { k: 'tubo', c: '#f2f2f2' }, img: '1585704032915-c3400ca199e7' },
  { id: 'electricos', n: 'Eléctricos', d: 'Cable, tomas, breakers, LED', art: { k: 'cable', c: '#d32f2f' }, img: '1621905251189-08b45d6a269e' },
  { id: 'pinturas', n: 'Pinturas', d: 'Vinilos, esmaltes, estucos', art: { k: 'balde', c: '#2e7d32', t: 'VINILO' }, img: '1562259949-e8e7689d7828' },
  { id: 'pisos', n: 'Pisos y enchapes', d: 'Cerámica, porcelanato', art: { k: 'baldosa', c: '#c9b79c' }, img: '1615971677499-5467cbab01c0' },
  { id: 'herramientas', n: 'Herramientas', d: 'Manuales y eléctricas', art: { k: 'martillo', c: '#e65100' }, img: '1530124566582-a618bc2615dc' },
  { id: 'techos', n: 'Techos', d: 'Tejas y accesorios', art: { k: 'teja', c: '#b0bec5' }, img: '1632759145351-1d592919f522' },
  { id: 'banos', n: 'Baños y grifería', d: 'Sanitarios, lavamanos, llaves', art: { k: 'sanitario', c: '#eceff1' }, img: '1584622650111-993a426fbf0a' },
  { id: 'quimicos', n: 'Impermeabilizantes', d: 'Sellantes, siliconas, aditivos', art: { k: 'balde', c: '#455a64', t: 'IMPERM.' }, img: '1581578731548-c64695cc6952' },
];

const P = (id, cat, n, brand, unit, detal, mayor, min, art, extra = {}) => ({ id, cat, n, brand, unit, detal, mayor, min, art, ...extra });

export const PRODUCTS = [
  // ---------- Cementos (marcas reales que manejan: Ultracem, Ecocemento, Cemex)
  P(1, 'cementos', 'Cemento gris uso general 50 kg', 'Ultracem', 'bulto', 34500, 32900, 20, { k: 'saco', c: '#1f4fa3', t: 'ULTRACEM' }, { top: true }),
  P(2, 'cementos', 'Cemento gris uso general 50 kg', 'Cemex', 'bulto', 35500, 33800, 20, { k: 'saco', c: '#0d47a1', t: 'CEMEX' }),
  P(3, 'cementos', 'Ecocemento uso general 50 kg', 'Ecocemento', 'bulto', 33900, 32300, 20, { k: 'saco', c: '#2e7d32', t: 'ECO' }, { isNew: true }),
  P(4, 'cementos', 'Cemento blanco 25 kg', 'Cemex', 'bulto', 52000, 49500, 10, { k: 'saco', c: '#eceff1', t: 'BLANCO' }),
  P(5, 'cementos', 'Cemento estructural ART 50 kg', 'Ultracem', 'bulto', 37900, 36200, 20, { k: 'saco', c: '#c62828', t: 'ESTRUCT.' }),

  // ---------- Morteros y pegas (Sika, MK, Tecnipega, Pego Perfecto)
  P(6, 'pegas', 'Pegante cerámico gris 25 kg', 'Pego Perfecto', 'bulto', 19900, 18500, 10, { k: 'saco', c: '#f9a825', t: 'PEGO' }, { top: true }),
  P(7, 'pegas', 'Pegante cerámica y porcelanato 25 kg', 'Tecnipega', 'bulto', 24500, 22900, 10, { k: 'saco', c: '#ef6c00', t: 'TECNIPEGA' }),
  P(8, 'pegas', 'Pegante para porcelanato 25 kg', 'Sika', 'bulto', 28900, 27200, 10, { k: 'saco', c: '#fbc02d', t: 'SIKA' }),
  P(9, 'pegas', 'Pega porcelanato flexible 25 kg', 'MK', 'bulto', 39900, 37500, 10, { k: 'saco', c: '#424242', t: 'MK' }),
  P(10, 'pegas', 'Mortero seco para pañete 40 kg', 'MK', 'bulto', 21900, 20500, 15, { k: 'saco', c: '#757575', t: 'MORTERO' }),
  P(11, 'pegas', 'Boquilla para juntas 2 kg', 'Sika', 'unidad', 8900, 8200, 12, { k: 'saco', c: '#90a4ae', t: 'BOQUILLA', small: true }),

  // ---------- Hierro y acero
  P(12, 'acero', 'Varilla corrugada 3/8" × 6 m', 'Acero nacional', 'unidad', 19800, 18900, 50, { k: 'varilla', c: '#6d4c41' }, { top: true }),
  P(13, 'acero', 'Varilla corrugada 1/2" × 6 m', 'Acero nacional', 'unidad', 34900, 33200, 50, { k: 'varilla', c: '#5d4037' }),
  P(14, 'acero', 'Varilla lisa 1/4" × 6 m', 'Acero nacional', 'unidad', 7900, 7400, 50, { k: 'varilla', c: '#8d6e63' }),
  P(15, 'acero', 'Alambre negro recocido', 'Genérico', 'kg', 7500, 6900, 25, { k: 'cable', c: '#37474f' }),
  P(16, 'acero', 'Malla electrosoldada 2,35 × 6 m', 'Genérico', 'unidad', 145000, 138000, 10, { k: 'malla', c: '#607d8b' }),
  P(17, 'acero', 'Puntilla con cabeza 2"', 'Genérico', 'kg', 8900, 8200, 10, { k: 'clavos', c: '#9e9e9e' }),

  // ---------- Bloques y agregados
  P(18, 'obra-gris', 'Bloque de concreto N.º 4 (10×20×40)', 'Bloquera local', 'unidad', 2300, 2050, 500, { k: 'bloque', c: '#9e9e9e' }, { top: true }),
  P(19, 'obra-gris', 'Bloque de concreto N.º 5 (12×20×40)', 'Bloquera local', 'unidad', 2700, 2450, 500, { k: 'bloque', c: '#8d8d8d' }),
  P(20, 'obra-gris', 'Ladrillo tolete', 'Ladrillera', 'unidad', 1200, 1050, 1000, { k: 'bloque', c: '#c75b39', brick: true }),
  P(21, 'obra-gris', 'Arena lavada', 'Agregados', 'm³', 95000, 88000, 6, { k: 'arena', c: '#d7b98a' }),
  P(22, 'obra-gris', 'Triturado de 3/4"', 'Agregados', 'm³', 120000, 112000, 6, { k: 'arena', c: '#8f8b85' }),

  // ---------- Plomería y PVC
  P(23, 'plomeria', 'Tubo PVC presión 1/2" × 6 m', 'Pavco', 'unidad', 18900, 17500, 20, { k: 'tubo', c: '#eeeeee' }),
  P(24, 'plomeria', 'Tubo PVC sanitario 4" × 6 m', 'Pavco', 'unidad', 79900, 75000, 10, { k: 'tubo', c: '#f5f5f5', big: true }),
  P(25, 'plomeria', 'Codo PVC presión 1/2" × 90°', 'Pavco', 'unidad', 900, 750, 50, { k: 'codo', c: '#eeeeee' }),
  P(26, 'plomeria', 'Soldadura PVC 1/4 de galón', 'Pavco', 'unidad', 32000, 29900, 6, { k: 'balde', c: '#1565c0', t: 'PVC', small: true }),
  P(27, 'plomeria', 'Tanque plástico 1.000 litros', 'Eternit', 'unidad', 499000, 479000, 3, { k: 'tanque', c: '#263238' }),

  // ---------- Eléctricos
  P(28, 'electricos', 'Cable THHN N.º 12 rollo × 100 m', 'Centelsa', 'rollo', 215000, 205000, 5, { k: 'cable', c: '#d32f2f' }, { top: true }),
  P(29, 'electricos', 'Cable THHN N.º 12 por metro', 'Centelsa', 'metro', 2400, 2200, 100, { k: 'cable', c: '#1976d2' }),
  P(30, 'electricos', 'Tomacorriente doble con polo a tierra', 'Genérico', 'unidad', 6900, 6200, 20, { k: 'toma', c: '#fafafa' }),
  P(31, 'electricos', 'Interruptor sencillo', 'Genérico', 'unidad', 5900, 5300, 20, { k: 'toma', c: '#fafafa', sw: true }),
  P(32, 'electricos', 'Bombillo LED 9 W luz blanca', 'Genérico', 'unidad', 4900, 4200, 24, { k: 'bombillo', c: '#fff8e1' }),
  P(33, 'electricos', 'Breaker enchufable 1 × 20 A', 'Genérico', 'unidad', 18900, 17500, 10, { k: 'toma', c: '#212121', br: true }),

  // ---------- Pinturas
  P(34, 'pinturas', 'Vinilo tipo 1 blanco × galón', 'Pintuco', 'galón', 79900, 75000, 6, { k: 'balde', c: '#fafafa', t: 'VINILO T1' }, { top: true }),
  P(35, 'pinturas', 'Vinilo tipo 2 blanco × cuñete 5 gal', 'Pintuco', 'cuñete', 189000, 178000, 3, { k: 'balde', c: '#e3f2fd', t: 'CUÑETE', big: true }),
  P(36, 'pinturas', 'Esmalte sintético × galón', 'Pintuco', 'galón', 89900, 85000, 6, { k: 'balde', c: '#c62828', t: 'ESMALTE' }),
  P(37, 'pinturas', 'Estuco plástico × galón', 'Genérico', 'galón', 29900, 27900, 6, { k: 'balde', c: '#f5f5f5', t: 'ESTUCO' }),
  P(38, 'pinturas', 'Rodillo de felpa 9"', 'Genérico', 'unidad', 14900, 13500, 12, { k: 'rodillo', c: '#ffb300' }),
  P(39, 'pinturas', 'Brocha de 3"', 'Genérico', 'unidad', 6900, 6200, 12, { k: 'brocha', c: '#8d6e63' }),

  // ---------- Pisos y enchapes
  P(40, 'pisos', 'Cerámica piso 45×45 beige', 'Corona', 'm²', 32900, 29900, 30, { k: 'baldosa', c: '#d7c4a5' }, { top: true }),
  P(41, 'pisos', 'Porcelanato 60×60 gris mate', 'Corona', 'm²', 59900, 55900, 30, { k: 'baldosa', c: '#9e9e9e' }),
  P(42, 'pisos', 'Cerámica pared 25×40 blanca', 'Corona', 'm²', 27900, 25900, 30, { k: 'baldosa', c: '#f5f5f5' }),

  // ---------- Herramientas
  P(43, 'herramientas', 'Martillo de uña 16 oz', 'Stanley', 'unidad', 24900, 22900, 6, { k: 'martillo', c: '#fbc02d' }),
  P(44, 'herramientas', 'Pala cuadrada con mango', 'Bellota', 'unidad', 34900, 32500, 6, { k: 'pala', c: '#455a64' }),
  P(45, 'herramientas', 'Carretilla 89 L llanta neumática', 'Genérico', 'unidad', 239000, 225000, 3, { k: 'carretilla', c: '#d32f2f' }, { top: true }),
  P(46, 'herramientas', 'Palustre 9"', 'Bellota', 'unidad', 15900, 14500, 6, { k: 'palustre', c: '#8d6e63' }),
  P(47, 'herramientas', 'Nivel de burbuja 24"', 'Stanley', 'unidad', 29900, 27500, 6, { k: 'nivel', c: '#fbc02d' }),
  P(48, 'herramientas', 'Flexómetro 5 m', 'Stanley', 'unidad', 14900, 13500, 6, { k: 'flexometro', c: '#fbc02d' }),
  P(49, 'herramientas', 'Taladro percutor 650 W', 'Black+Decker', 'unidad', 239000, 225000, 3, { k: 'taladro', c: '#ff8f00' }),

  // ---------- Techos
  P(50, 'techos', 'Teja fibrocemento N.º 6', 'Eternit', 'unidad', 39900, 37500, 20, { k: 'teja', c: '#b0bec5' }),
  P(51, 'techos', 'Teja de zinc 3 m', 'Genérico', 'unidad', 32900, 30900, 20, { k: 'teja', c: '#90a4ae', zinc: true }),
  P(52, 'techos', 'Gancho para teja con capuchón', 'Genérico', 'unidad', 1200, 1000, 100, { k: 'clavos', c: '#9e9e9e' }),

  // ---------- Baños y grifería
  P(53, 'banos', 'Sanitario completo blanco', 'Corona', 'unidad', 289000, 269000, 3, { k: 'sanitario', c: '#fafafa' }),
  P(54, 'banos', 'Lavamanos de colgar', 'Corona', 'unidad', 129000, 119000, 3, { k: 'lavamanos', c: '#fafafa' }),
  P(55, 'banos', 'Llave terminal 1/2"', 'Grival', 'unidad', 14900, 13500, 12, { k: 'llave', c: '#b0bec5' }),
  P(56, 'banos', 'Ducha sencilla cromada', 'Grival', 'unidad', 24900, 22900, 6, { k: 'llave', c: '#cfd8dc', shower: true }),

  // ---------- Impermeabilizantes y químicos
  P(57, 'quimicos', 'Impermeabilizante integral × galón', 'Sika', 'galón', 39900, 37500, 6, { k: 'balde', c: '#fbc02d', t: 'SIKA 1' }),
  P(58, 'quimicos', 'Manto impermeabilizante techo × galón', 'Sika', 'galón', 89000, 84000, 6, { k: 'balde', c: '#b71c1c', t: 'TECHO' }),
  P(59, 'quimicos', 'Silicona transparente 280 ml', 'Sika', 'unidad', 10900, 9900, 12, { k: 'silicona', c: '#eceff1' }),
  P(60, 'quimicos', 'Sellador para juntas 300 ml', 'Sika', 'unidad', 18900, 17500, 12, { k: 'silicona', c: '#9e9e9e' }),
];

// Marcas (texto; los logos oficiales se pueden poner después)
export const BRANDS = ['Ultracem', 'Cemex', 'Ecocemento', 'Sika', 'MK', 'Tecnipega', 'Pego Perfecto', 'Toptec', 'Pavco', 'Corona', 'Pintuco', 'Stanley', 'Eternit', 'Grival'];

// ⚠️ Promociones de EJEMPLO (reemplazar por las reales). until: fecha AAAA-MM-DD en que termina.
export const PROMOS = [
  { id: 'p1', tag: 'Semana del cemento', t: 'Cemento gris 50 kg a precio de mayorista', d: 'Llevando desde 10 bultos te damos el precio por mayor de 20.', pid: 1, price: 32900, old: 34500, until: '2026-11-15', color: '#1f4fa3' },
  { id: 'p2', tag: 'Combo enchape', t: '30 m² de cerámica + 8 bultos de pegante', d: 'Todo para enchapar tu piso, a un solo precio.', items: [[40, 30], [6, 8]], price: 1029000, old: 1146200, until: '2026-11-30', color: '#b3121b' },
  { id: 'p3', tag: 'Pintura', t: 'Vinilo tipo 1 + rodillo de regalo', d: 'Por cada 2 galones, te llevas un rodillo 9" gratis.', pid: 34, price: 79900, until: '2026-11-08', color: '#2e7d32' },
  { id: 'p4', tag: 'Herramientas', t: '-10% en herramientas manuales', d: 'Martillos, palas, palustres, niveles y flexómetros.', cat: 'herramientas', until: '2026-11-20', color: '#e65100' },
];

// ⚠️ Noticias de EJEMPLO (reemplazar por las reales)
export const NEWS = [
  { id: 'n1', date: '2026-10-14', tag: 'Novedades', t: 'Llegó Ecocemento a nuestra bodega', d: 'Un cemento de uso general con menor huella de carbono, ideal para obras residenciales.', body: 'Ya tenemos disponible Ecocemento en presentación de 50 kg. Es un cemento de uso general pensado para la construcción residencial, con un proceso de fabricación que reduce las emisiones. Pregunta por el precio al por mayor desde 20 bultos.', img: L.postCementos },
  { id: 'n2', date: '2026-10-08', tag: 'Consejos', t: '¿Cuántos bultos de pegante necesito para enchapar?', d: 'Una regla rápida para no quedarte corto ni comprar de más.', body: 'Como referencia, un bulto de pegante de 25 kg rinde entre 4 y 5 m² según el tamaño de la baldosa y el tipo de llana. Para porcelanatos grandes el consumo aumenta. Usa nuestra calculadora y confirma con un asesor antes de comprar.', img: L.postPegas },
  { id: 'n3', date: '2026-09-30', tag: 'Avisos', t: 'Nuestro horario de atención', d: 'Lun, Mié y Jue 7 a. m. a 5 p. m. · Mar y Vie 7 a. m. a 4 p. m. · Sáb 8 a. m. a 12 m.', body: 'Te esperamos en la Cra 7 # 16-15 de Riohacha. Lunes, miércoles y jueves de 7:00 a. m. a 5:00 p. m.; martes y viernes de 7:00 a. m. a 4:00 p. m.; sábados de 8:00 a. m. a 12:00 m. Pedidos y consultas por WhatsApp.', img: L.postFachada },
  { id: 'n4', date: '2026-09-22', tag: 'Consejos', t: 'Mortero o pegante: ¿cuál usar?', d: 'El mortero es para pañetar y levantar muros; el pegante, para adherir enchapes.', body: 'El mortero seco se usa para pañetes y pega de bloque; el pegante cerámico está formulado para adherir baldosas y porcelanatos con mayor agarre. Para porcelanato, elige un pegante especial para porcelanato.', img: L.pegas },
];

// Galería
export const GALLERY = [
  { src: L.postFachada, t: 'Aquí te esperamos' },
  { src: L.postCementos, t: 'Cementos para tu obra' },
  { src: L.postPegas, t: 'Morteros y pegas' },
  { src: L.quienes, t: 'Quiénes somos' },
  { src: L.fachada, t: 'Nuestro local en la Cra 7' },
  { src: '1503387762-592deb58ef4e', t: 'Obra en construcción', art: { k: 'carretilla', c: '#d32f2f' } },
  { src: '1541888946425-d81bb19240f5', t: 'Tu obra, nuestro compromiso', art: { k: 'bloque', c: '#9e9e9e' } },
  { src: '1581094794329-c8112a89af12', t: 'Materiales de calidad', art: { k: 'saco', c: '#1f4fa3', t: 'CEMENTO' } },
];
