# Cafetomás · Café de Especialidad — sitio web

React 18 + Vite + Tailwind. Dos páginas: `index.html` (inicio) y `carta.html` (carta completa).

## Uso
    npm install
    npm start          # http://localhost:3000   (carta: /carta.html)
    npm run build      # genera build/ lista para subir a cualquier hosting
    npm run serve      # previsualiza build/

## Qué completar
| Qué | Dónde |
| --- | --- |
| **WhatsApp** (si queda vacío, los botones llevan a su Linktree) | `src/i18n.jsx` → `WHATSAPP` |
| **Dirección de la tienda** | `src/i18n.jsx` → `ADDRESS` |
| Productos, precios y fotos (ES/EN) | `src/data.js` → `MENU` |
| Recetas de la calculadora del Coffee Lab | `src/data.js` → `METHODS` |
| Galería | `src/data.js` → `GALLERY` |
| Textos y módulos de la escuela (español / inglés) | `src/i18n.jsx` → `DICT` |

Los productos y precios son de REFERENCIA (excepto nombres vistos en su Instagram como Pumpkin Nevado Coffee
y el Módulo Barismo Básico Kids): reemplázalos por los reales.

## Fotos
`public/images/local/` tiene fotos reales de su Instagram (baja resolución). Reemplázalas por las originales con el mismo nombre.

## Piezas
- `components/Loader.jsx` — "Extracción perfecta": taza vista desde arriba que se llena de espresso, latte art en tulipán
  que se convierte en el símbolo de Cafetomás, anillo "Maestría en café" girando, temporizador de barista (25 s) y báscula
  (18 g → 36 g). Sale con dos olas de color que revelan la página.
- `components/Brand.jsx` + `lib/logoPath.js` — su logo vectorizado de la imagen original.
- `components/Journey.jsx` — "Del grano a la taza": 6 pasos con un grano 3D que gira y cambia de color al hacer scroll.
- `components/Lab.jsx` — calculadora de recetas (V60, Chemex, AeroPress, prensa, espresso, cold brew).
- `components/School.jsx` — Escuela de Barismo: módulos que se voltean en 3D.
- `components/Gallery.jsx` — prisma 3D de seis caras que gira con el scroll.
