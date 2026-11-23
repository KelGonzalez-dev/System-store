export const BRAND = { name: 'Jugos Bar', tagline: 'El sabor y la calidad de lo natural' };

export const INSTAGRAM = { url: 'https://www.instagram.com/jugosbar/', handle: '@jugosbar' };

export const SEDES = [
  { id: 'principal', n: '01', name: 'Jugos Bar', city: 'Maicao', address: 'Cra. 9 #12-36, Maicao, La Guajira', wa: '573000000001', wad: '300 000 0001', tint: '#62bf00' },
  { id: 'boscan', n: '02', name: 'Jugos Bar Boscan', city: 'Maicao', address: 'Cl. 6A #13-83, Maicao, La Guajira', wa: '573000000002', wad: '300 000 0002', tint: '#8fe02f' },
  { id: 'mister', n: '03', name: 'Mister Jugos', city: 'Maicao', address: 'Cl. 14 #8-111, Maicao, La Guajira', wa: '573000000003', wad: '300 000 0003', tint: '#3d8200' },
  { id: 'uribia', n: '04', name: 'Jugos Bar Uribia', city: 'Uribia', address: 'Uribia, La Guajira', wa: '573000000004', wad: '300 000 0004', tint: '#b6f060' },
];

export const sedeById = (id) => SEDES.find((s) => s.id === id);

export const waLink = (sede, text) => `https://wa.me/${sede.wa}?text=${encodeURIComponent(text)}`;
export const mapsLink = (sede) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${sede.name} ${sede.address}`)}`;
export const cop = (n) => '$' + n.toLocaleString('es-CO');

const IMG = {
  straw: '1598793929269-8e2a4b5a20e4',
  wood: '1650316710473-8b2ecdcd2b10',
  trio: '1497534446932-c925b458314e',
  lemon: '1676159434854-2f7f860a18cd',
  market: '1565115691808-7edfe1bc431a',
  sandwich: '1463424625195-3776f3c34a6b',
};
export const photo = (k, w = 900) => `https://images.unsplash.com/photo-${IMG[k]}?auto=format&fit=crop&q=70&w=${w}`;

export const NAV = [
  ['sedes', 'Sedes'],
  ['favoritos', 'Favoritos'],
  ['resenas', 'Reseñas'],
  ['pedir', 'Cómo pedir'],
  ['galeria', 'Galería'],
];

export const TICKER = ['Jugos naturales', 'Batidos', 'Sándwiches', 'Platos', 'Domicilios por WhatsApp', 'Maicao', 'Uribia'];

export const CATS = [
  { id: 'jugos', name: 'Jugos naturales', icon: 'cup' },
  { id: 'batidos', name: 'Batidos', icon: 'shake' },
  { id: 'sandwiches', name: 'Sándwiches', icon: 'sandwich' },
  { id: 'platos', name: 'Platos', icon: 'plate' },
  { id: 'frutas', name: 'Frutas y postres', icon: 'bowl' },
];

const I = (id, cat, name, desc, price, c, o = {}) => ({ id, cat, name, desc, price, c, ...o });

export const ITEMS = [
  I('j-naranja', 'jugos', 'Naranja natural', 'Exprimida al momento, sin azúcar añadida.', 6000, '#ff9f1c', { feat: 'wood' }),
  I('j-mora-agua', 'jugos', 'Mora en agua', 'Mora fresca licuada con agua y hielo.', 7000, '#6a1b4d'),
  I('j-mora-leche', 'jugos', 'Mora en leche', 'Cremoso, con leche entera fría.', 8500, '#8e2c6a', { adj: { uribia: 500 } }),
  I('j-maracuya', 'jugos', 'Maracuyá', 'Ácido y refrescante, en agua o en leche.', 7000, '#f6c90e'),
  I('j-lulo', 'jugos', 'Lulo', 'El clásico de siempre, bien frío.', 7500, '#a4c639'),
  I('j-mango', 'jugos', 'Mango', 'Mango maduro, dulce y espeso.', 7500, '#ffb300'),
  I('j-guanabana', 'jugos', 'Guanábana', 'Cremosa y suave, en leche o en agua.', 8500, '#e8efe0', { not: ['mister'] }),
  I('j-corozo', 'jugos', 'Corozo', 'Sabor de la región, bien helado.', 6500, '#7a1f3d', { only: ['principal', 'uribia'] }),
  I('j-tamarindo', 'jugos', 'Tamarindo', 'Agridulce, natural y refrescante.', 6500, '#8a5a2b', { only: ['boscan', 'mister', 'uribia'] }),
  I('j-limonada', 'jugos', 'Limonada natural', 'Limón fresco, hielo y un toque de hierbabuena.', 6000, '#d7f25a', { feat: 'lemon' }),
  I('j-limonada-coco', 'jugos', 'Limonada de coco', 'Cremosa, con leche de coco.', 9500, '#f4f1e4', { not: ['mister'] }),
  I('j-cerezada', 'jugos', 'Limonada cerezada', 'Limonada con granadina y cereza.', 8000, '#e0364f', { only: ['principal', 'boscan'] }),
  I('j-verde', 'jugos', 'Jugo verde', 'Piña, pepino, apio y limón.', 9000, '#62bf00', { not: ['uribia'] }),
  I('b-fresa', 'batidos', 'Shake de fresa', 'Fresas, helado de vainilla y leche.', 11000, '#ff5d7a', { feat: 'trio' }),
  I('b-oreo', 'batidos', 'Shake de galleta', 'Helado, leche y galleta triturada.', 12500, '#3b2f2a', { not: ['uribia'] }),
  I('b-banano', 'batidos', 'Batido de banano y avena', 'Energía natural para empezar el día.', 9500, '#f5dc7a'),
  I('b-proteico', 'batidos', 'Batido proteico', 'Banano, avena, mantequilla de maní y leche.', 13500, '#c9a36b', { only: ['principal', 'boscan'] }),
  I('b-mango-yogur', 'batidos', 'Mango con yogur', 'Mango, yogur natural y hielo.', 10000, '#ffc233', { only: ['mister', 'uribia', 'boscan'] }),
  I('s-pollo', 'sandwiches', 'Sándwich de pollo', 'Pollo desmechado, queso, lechuga y tomate.', 15500, '#d9a05b', { feat: 'sandwich' }),
  I('s-club', 'sandwiches', 'Club sándwich', 'Jamón, pollo, queso, huevo y tocineta.', 18500, '#c98a43', { not: ['uribia'] }),
  I('s-cerdo', 'sandwiches', 'Sándwich de cerdo', 'Cerdo desmechado, queso y salsa de la casa.', 17000, '#b97433'),
  I('s-vegetal', 'sandwiches', 'Sándwich vegetal', 'Queso, aguacate, tomate y lechuga.', 13500, '#9acd32', { only: ['principal', 'boscan', 'mister'] }),
  I('p-parrilla', 'platos', 'Parrilla con patacones', 'Carne a la plancha con patacones y ensalada.', 28000, '#8b4a2b', { not: ['mister'], adj: { uribia: 1500 } }),
  I('p-pollo', 'platos', 'Pechuga a la plancha', 'Con arroz, ensalada y papas.', 22000, '#e3b46f', { not: ['mister'] }),
  I('p-desayuno', 'platos', 'Desayuno completo', 'Huevos al gusto, arepa, queso y jugo.', 14500, '#f0c24b', { only: ['principal', 'boscan'] }),
  I('p-bandeja', 'platos', 'Bandeja ejecutiva', 'Plato del día con sopa y jugo.', 19000, '#a86a3a', { only: ['principal', 'uribia'] }),
  I('f-ensalada', 'frutas', 'Ensalada de frutas', 'Frutas de temporada con helado y crema.', 11500, '#ff7a45', { feat: 'market' }),
  I('f-cocktail', 'frutas', 'Cóctel de frutas', 'Frutas picadas con jugo de naranja.', 9000, '#ffa24b', { not: ['uribia'] }),
  I('f-copa', 'frutas', 'Copa de helado', 'Tres bolas, salsa y topping a elegir.', 10500, '#f4d6e3', { only: ['principal', 'boscan', 'mister'] }),
  I('f-fruta-pic', 'frutas', 'Fruta picada', 'Piña, papaya, sandía y melón con limón.', 7500, '#6bd36b'),
];

export const menuFor = (sedeId) =>
  ITEMS.filter((i) => (!i.only || i.only.includes(sedeId)) && (!i.not || !i.not.includes(sedeId))).map((i) => ({
    ...i,
    price: i.price + ((i.adj && i.adj[sedeId]) || 0),
  }));

export const FEATURED = ITEMS.filter((i) => i.feat);

export const STEPS = [
  { n: '01', t: 'Elige tu sede', d: 'Cada sede tiene su propio menú y su propio WhatsApp.' },
  { n: '02', t: 'Arma tu pedido', d: 'Agrega tus jugos, batidos y platos favoritos al carrito.' },
  { n: '03', t: 'Envíalo por WhatsApp', d: 'Te llega el resumen listo para enviar. Sin vueltas.' },
];

export const GALLERY = [
  { k: 'straw', alt: 'Jugo de naranja con pitillo', cls: 'row-span-2', pos: '50% 50%' },
  { k: 'sandwich', alt: 'Sándwich recién hecho', cls: '', pos: '50% 50%' },
  { k: 'trio', alt: 'Tres jugos y batidos fríos', cls: '', pos: '50% 50%' },
  { k: 'market', alt: 'Frutas frescas', cls: 'row-span-2', pos: '50% 40%' },
  { k: 'lemon', alt: 'Limonada natural', cls: '', pos: '50% 50%' },
  { k: 'wood', alt: 'Naranja natural', cls: '', pos: '50% 50%' },
];

export const REVIEWS = [
  { n: 'Valentina R.', sede: 'Jugos Bar', stars: 5, t: 'La naranja natural es la mejor de Maicao. Siempre fresca y bien fría, y el domicilio llegó rapidísimo.' },
  { n: 'Carlos M.', sede: 'Jugos Bar Boscan', stars: 5, t: 'El sándwich de pollo está espectacular y el jugo de mora en leche es adictivo. Ya es mi parada fija.' },
  { n: 'Andrea P.', sede: 'Mister Jugos', stars: 5, t: 'Atención amable y todo se siente natural, no empalagoso. El shake de fresa me encantó.' },
  { n: 'Luis F.', sede: 'Jugos Bar Uribia', stars: 4, t: 'Por fin un lugar así en Uribia. Buenos precios, buen sabor y piden fácil por WhatsApp.' },
  { n: 'Daniela G.', sede: 'Jugos Bar', stars: 5, t: 'La limonada de coco es otro nivel. Pedí para toda la oficina y llegó todo perfecto.' },
  { n: 'Jhon S.', sede: 'Jugos Bar Boscan', stars: 5, t: 'Porciones generosas y frutas de verdad. Se nota la calidad en cada vaso.' },
];

export const RATING = Math.round((REVIEWS.reduce((a, r) => a + r.stars, 0) / REVIEWS.length) * 10) / 10;
