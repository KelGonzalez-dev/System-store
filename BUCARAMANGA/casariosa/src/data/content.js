export const BRAND = { name: 'Casa Riosa', tagline: "La Cucina Dell'amore" };

export const CONTACT = {
  phoneDisplay: '+57 300 912 8439',
  whatsapp: '573009128439',
  instagram: 'https://www.instagram.com/casa_riosa',
  instagramHandle: '@casa_riosa',
  menuUrl: 'https://casa-riosa.cluvi.co',
  address: 'Calle 36 # 32-23, Cabecera, Bucaramanga',
  maps: 'https://www.google.com/maps/search/?api=1&query=Calle+36+%2332-23+Cabecera+Bucaramanga',
};

export const waLink = (text) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV_IDS = ['inicio', 'concepto', 'carta', 'galeria', 'ubicacion', 'reservas'];

const un = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=68`;
const IDS = {
  hero: ['photo-1414235077428-338989a2e8c0', 'photo-1551218808-94e220e084d2'],
  concept: ['photo-1414235077428-338989a2e8c0', 'photo-1498579150354-977475b7ea0b'],
  pizza: ['photo-1513104890138-7c749659a591', 'photo-1565299624946-b28f40a0ae38'],
  pasta: ['photo-1621996346565-e3dbc646d9a9', 'photo-1551183053-bf91a1d81141'],
  risotto: ['photo-1476124369491-e7addf5db371', 'photo-1572441713132-51c75654db73'],
  antipasti: ['photo-1541529086526-db283c563270', 'photo-1626200419199-391ae4be7a41'],
  dolci: ['photo-1551024601-bec78aea704b', 'photo-1488477181946-6428a0291777'],
  cocteles: ['photo-1514362545857-3bc16c4c7d1b', 'photo-1470337458703-46ad1756a187'],
  zuppe: ['photo-1547592166-23ac45744acd', 'photo-1547592180-85f173990554'],
  sala: ['photo-1559339352-11d035aa65de', 'photo-1552566626-52f8b828add9'],
  mesa: ['photo-1424847651672-bf20a4b0982b', 'photo-1466978913421-dad2ebd01d17'],
  cocina: ['photo-1556910103-1c02745aae4d', 'photo-1551218808-94e220e084d2'],
  detalle: ['photo-1544025162-d76694265947', 'photo-1414235077428-338989a2e8c0'],
  noche: ['photo-1414235077428-338989a2e8c0', 'photo-1552566626-52f8b828add9'],
  city: ['photo-1583531352515-8884af319dc1', 'photo-1518509562904-e7ef99cdcc86'],
};
const KEYWORDS = {
  hero: 'romantic,restaurant,candlelight', concept: 'italian,food', pizza: 'pizza,italian', pasta: 'pasta,italian',
  risotto: 'risotto,food', antipasti: 'antipasto,italian', dolci: 'dessert,tiramisu', cocteles: 'cocktail,bar',
  zuppe: 'soup,food', sala: 'restaurant,string lights,pergola', mesa: 'restaurant,table,candlelight', cocina: 'chef,kitchen',
  detalle: 'red roses,candle', noche: 'restaurant,velvet,romantic', city: 'bucaramanga,colombia',
};
export const pic = (key, w = 1200) => [
  ...IDS[key].map((id) => un(id, w)),
  `https://loremflickr.com/${w}/${Math.round(w * 0.8)}/${KEYWORDS[key]}?lock=${Object.keys(IDS).indexOf(key) + 31}`,
];
