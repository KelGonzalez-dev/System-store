export const BRAND = { name: 'Lulo Café Bar', short: 'lulo' };

export const CONTACT = {
  phoneDisplay: '320 476 8870',
  phoneTel: '+573204768870',
  whatsapp: '573204768870',
  instagram: 'https://www.instagram.com/lulocafebar',
  instagramHandle: '@lulocafebar',
  order: 'https://thissa.store/lulo',
  mapsCentro: 'https://www.google.com/maps/search/?api=1&query=Lulo+Caf%C3%A9+Bar+Carrera+3+%2316-34+Santa+Marta',
  mapsPaz: 'https://www.google.com/maps/search/?api=1&query=Lulo+Caf%C3%A9+Bar+La+Paz+Santa+Marta',
};

export const waLink = (text) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV_IDS = ['inicio', 'concepto', 'carta', 'casas', 'galeria', 'ciudad', 'reservas'];

const un = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=68`;
const IDS = {
  hero: ['photo-1414235077428-338989a2e8c0', 'photo-1517248135467-4c7edcad34c4'],
  concept: ['photo-1559339352-11d035aa65de', 'photo-1466978913421-dad2ebd01d17'],
  arepas: ['photo-1565299585323-38d6b0865b47', 'photo-1551782450-a2132b4ba21d'],
  cafe: ['photo-1495474472287-4d71bcdd2085', 'photo-1447933601403-0c6688de566e'],
  barra: ['photo-1514362545857-3bc16c4c7d1b', 'photo-1470337458703-46ad1756a187'],
  compartir: ['photo-1555939594-58d7cb561ad1', 'photo-1504674900247-0877df9cc836'],
  patio: ['photo-1517248135467-4c7edcad34c4', 'photo-1552566626-52f8b828add9'],
  noche: ['photo-1429554513019-6c61c19ffb7e', 'photo-1470337458703-46ad1756a187'],
  detalle: ['photo-1572116469696-31de0f17cc34', 'photo-1544148103-0773bf10d330'],
  city: ['photo-1583531352515-8884af319dc1', 'photo-1518509562904-e7ef99cdcc86'],
  centro: ['photo-1568402102990-bc541580b59f', 'photo-1560493676-04071c5f467b'],
  paz: ['photo-1559329007-40df8a9345d8', 'photo-1514933651103-005eec06c04b'],
};
const KEYWORDS = {
  hero: 'restaurant,night', concept: 'restaurant,interior', arepas: 'arepa,food', cafe: 'coffee,cafe',
  barra: 'cocktail,bar', compartir: 'food,table', patio: 'patio,lights', noche: 'bar,night',
  detalle: 'restaurant,detail', city: 'santa marta,colombia', centro: 'colonial,street', paz: 'caribbean,street',
};
export const pic = (key, w = 1200) => [
  ...IDS[key].map((id) => un(id, w)),
  `https://loremflickr.com/${w}/${Math.round(w * 0.8)}/${KEYWORDS[key]}?lock=${Object.keys(IDS).indexOf(key) + 21}`,
];
