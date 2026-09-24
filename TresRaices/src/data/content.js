/* ============================================================
   TODO EL CONTENIDO EDITABLE VIVE AQUÍ (textos, contacto, imágenes)
   ============================================================ */

export const BRAND = {
  name: 'Tres Raíces',
  type: 'Cooperativa Agroecológica',
  legal: 'Precooperativa Multiactiva Agroecológica Raíces de la Sierra Nevada',
  sigla: 'COOAGRORAICES',
  territory: 'Sierra Nevada de Santa Marta · Cesar y Magdalena',
};

export const CONTACT = {
  whatsapp: '573001234567', // solo números, con indicativo del país
  phone: '+57 300 123 4567',
  email: 'info@tresraices.co',
  place: 'Valledupar, Cesar, Colombia',
  instagram: '#',
  facebook: '#',
  youtube: '#',
};

export const waLink = (text = 'Hola Tres Raíces, quiero más información.') =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'quienes-somos', label: 'Quiénes somos' },
  { id: 'productos', label: 'Productos' },
  { id: 'planta', label: 'Nuestra planta' },
  { id: 'productores', label: 'Productores' },
  { id: 'sostenibilidad', label: 'Sostenibilidad' },
  { id: 'contacto', label: 'Contacto' },
];

/* ---------- Imágenes ----------
   Cada foto tiene varias opciones: si una no carga, se prueba la siguiente
   y, si ninguna carga, se muestra un fondo verde (la página nunca se rompe).
   Para cambiar una foto, reemplaza el ID de Unsplash o pon una URL completa. */
const un = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=68`;
const IDS = {
  hero: ['photo-1506905925346-21bda4d32df4', 'photo-1464822759023-fed622ff2c3b'],
  cafe: ['photo-1447933601403-0c6688de566e', 'photo-1495474472287-4d71bcdd2085'],
  cacao: ['photo-1548907040-4baa42d10919', 'photo-1481391319762-47dff72954d9'],
  cana: ['photo-1596040033229-a9821ebd058d', 'photo-1500382017468-9049fed747ef'],
  farmer: ['photo-1592982537447-7440770cbfc9', 'photo-1500937386664-56d1dfef3854'],
  plant: ['photo-1442512595331-e89e73853f31', 'photo-1447933601403-0c6688de566e'],
  hands: ['photo-1416879595882-3373a0480b5b', 'photo-1500382017468-9049fed747ef'],
  mountains: ['photo-1464822759023-fed622ff2c3b', 'photo-1506905925346-21bda4d32df4'],
  fields: ['photo-1500382017468-9049fed747ef', 'photo-1574943320219-553eb213f72d'],
};
/* Último respaldo: foto por palabras clave (siempre devuelve algo relacionado) */
const KEYWORDS = {
  hero: 'mountain,forest', cafe: 'coffee,plantation', cacao: 'cacao,cocoa', cana: 'sugarcane,field',
  farmer: 'farmer,coffee', plant: 'coffee,beans', hands: 'seedling,hands', mountains: 'mountains,green', fields: 'farm,agriculture',
};
export const pic = (key, w = 1200) => [
  ...IDS[key].map((id) => un(id, w)),
  `https://loremflickr.com/${w}/${Math.round(w * 0.8)}/${KEYWORDS[key]}?lock=${Object.keys(IDS).indexOf(key) + 11}`,
];

/* ---------- Pantalla de carga: datos curiosos (se elige uno al azar por categoría) ---------- */
export const FACTS = [
  {
    key: 'cafe',
    label: 'Café',
    color: '#c90e1e',
    items: [
      '¿Sabías que el café es la semilla de una cereza roja? Cada fruto suele guardar dos granos.',
      '¿Sabías que un cafeto puede dar cosechas durante décadas si se cuida la tierra que lo sostiene?',
      '¿Sabías que las mejores cerezas de café se recogen a mano, una a una, cuando están rojas y maduras?',
      '¿Sabías que el café cultivado bajo sombra ayuda a proteger las aves y los suelos de la montaña?',
    ],
  },
  {
    key: 'cacao',
    label: 'Cacao',
    color: '#df8b10',
    items: [
      '¿Sabías que el chocolate nace de las semillas del cacao, que se fermentan y se secan antes de tostarse?',
      '¿Sabías que el cacao florece directamente en el tronco y en las ramas gruesas del árbol?',
      '¿Sabías que cada mazorca de cacao guarda decenas de semillas cubiertas de una pulpa blanca y dulce?',
      '¿Sabías que el cacao crece a la sombra de árboles más altos, en climas cálidos y húmedos?',
    ],
  },
  {
    key: 'cana',
    label: 'Caña',
    color: '#75a32a',
    items: [
      '¿Sabías que la panela se hace solo con jugo de caña, cocinado y moldeado, sin refinar?',
      '¿Sabías que la caña es un pasto gigante que puede superar los tres metros de altura?',
      '¿Sabías que Colombia es de los países que más panela consume por persona en el mundo?',
      '¿Sabías que la panela conserva parte de los minerales de la caña que el azúcar refinado pierde?',
    ],
  },
];

/* ---------- Secciones ---------- */
export const PILLARS = [
  { icon: 'sprout', title: 'Misión', text: 'Transformar la producción agropecuaria en bienestar para las familias campesinas, con calidad, comercio justo y respeto por el medio ambiente.' },
  { icon: 'mountain', title: 'Visión', text: 'Ser una cooperativa líder en la producción y comercialización de café, cacao y caña, reconocida por su calidad, sostenibilidad y aporte al desarrollo del territorio.' },
  { icon: 'handshake', title: 'Valores', text: 'Compromiso, honestidad, solidaridad, respeto, equidad y amor por la tierra.' },
  { icon: 'leaf', title: 'Nuestro territorio', text: 'Sierra Nevada de Santa Marta, Cesar y Magdalena, Colombia.' },
];

export const PRODUCTS = [
  {
    id: 'cafe',
    icon: 'coffee',
    title: 'Café',
    text: 'Café de alta calidad, cultivado en armonía con la naturaleza.',
    border: 'border-berry',
    btn: 'bg-berry text-white hover:bg-berry-dark',
    dot: 'bg-berry',
  },
  {
    id: 'cacao',
    icon: 'cacao',
    title: 'Cacao',
    text: 'Desde la compra del cacao en baba hasta productos terminados.',
    border: 'border-gold',
    btn: 'bg-gold text-ink hover:bg-gold-light',
    dot: 'bg-gold',
  },
  {
    id: 'cana',
    icon: 'cane',
    title: 'Caña / Panela',
    text: 'Panela 100% natural, con el sabor de nuestra tierra.',
    border: 'border-lime',
    btn: 'bg-lime text-ink hover:bg-fern hover:text-white',
    dot: 'bg-lime',
  },
];

export const ABOUT = {
  title: 'Más que productos, sembramos futuro',
  text: 'En Tres Raíces unimos a pequeños productores, fortalecemos sus familias y promovemos un modelo de producción sostenible que protege el medio ambiente y conserva la cultura campesina e indígena.',
  features: [
    { icon: 'sprout', title: 'Agricultura sostenible' },
    { icon: 'users', title: 'Apoyo a productores locales' },
    { icon: 'globe', title: 'Comercio justo y trazabilidad' },
  ],
};

export const PLANT = {
  title: 'Nuestra planta',
  text: 'Desde la compra del cacao en baba hasta productos terminados: un proceso cuidadoso que respeta el trabajo del campo.',
  steps: [
    { title: 'Recepción', text: 'Recibimos la cosecha de las familias productoras y registramos su origen.' },
    { title: 'Beneficio', text: 'Café, cacao en baba y caña se procesan con cuidado para conservar su sabor.' },
    { title: 'Transformación', text: 'Del grano y del jugo a productos terminados: café, cacao y panela.' },
    { title: 'Empaque y trazabilidad', text: 'Cada lote sale identificado, listo para llegar al mundo.' },
  ],
};

export const PRODUCERS = {
  title: 'Productores de la Sierra',
  text: 'Somos una cooperativa que nace de la fuerza de nuestra gente. Trabajamos de la mano con familias campesinas para que su cosecha tenga valor, futuro y nombre propio.',
  items: [
    { icon: 'users', title: 'Familias fortalecidas', text: 'El bienestar del campo es el centro de nuestro trabajo.' },
    { icon: 'globe', title: 'Comercio justo', text: 'Cada lote es trazable, del cultivo a tu mesa.' },
    { icon: 'leaf', title: 'Cultura campesina e indígena', text: 'Conservamos los saberes de la Sierra Nevada.' },
  ],
};

export const SUSTAIN = {
  title: 'Raíces que alimentan el futuro',
  cards: [
    { icon: 'sprout', title: 'Agroecología', text: 'Cultivamos en armonía con la naturaleza que nos rodea.' },
    { icon: 'drop', title: 'Agua y montaña', text: 'Cuidamos la Sierra Nevada, fuente de vida de nuestro territorio.' },
    { icon: 'globe', title: 'Comercio justo', text: 'Un precio digno y trazabilidad para cada productor.' },
  ],
};

export const SLOGANS = {
  hero: 'La Sierra Nevada nos da la vida, nuestras raíces la transforman.',
  foot: 'Raíces que alimentan el futuro',
};
