# 🎒 Guajira Bags - Tienda Digital de Mochilas Wayuu

> **Artesanía Wayuu de lujo. Mochilas tejidas a mano con elegancia y tradición.**

Una experiencia digital premium para explorar, seleccionar y comprar mochilas artesanales de La Guajira directamente a través de WhatsApp.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características Principales

- 🎨 **Diseño Premium Minimalista** - Paleta dorada, rosa perla y beige
- 📦 **Catálogo Completo** - 15+ mochilas en 5 categorías
- 🔍 **Búsqueda en Tiempo Real** - Filtrado instantáneo por nombre y categoría
- 🛒 **Carrito Persistente** - Los productos se guardan automáticamente
- 💬 **Integración WhatsApp** - Pedidos directos sin backend
- 📱 **Totalmente Responsivo** - Funciona en desktop, tablet y móvil
- 🎬 **Animaciones Suaves** - Experiencia fluida y elegante
- 🖼️ **Galería Premium** - Masonry layout con hover effects

## 🚀 Inicio Rápido

### 1. Clonar o descargar el proyecto
```bash
cd guajira-bag
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar en desarrollo
```bash
npm start
```

Se abrirá automáticamente en `http://localhost:3000`

### 4. Compilar para producción
```bash
npm run build
```

**Lee `INICIO_RAPIDO.md` para una guía paso a paso completa.**

## 📋 Funcionalidades

### 🏠 Home
- Hero section con propuesta de valor
- Historia de Guajira Bags
- Galería de imágenes
- Información de contacto

### 🛍️ Catálogo
- Grid responsivo de mochilas
- Busca por nombre o descripción
- Filtra por categoría
- Agrega al carrito con un clic

### 🎯 Categorías
- Mochilas Wayuu
- Mochilas Kankuamas
- Mini Bags
- Contemporáneas
- Premium

### 🛒 Carrito
- Agrega/elimina productos
- Ajusta cantidades
- Calcula total automático
- Sincroniza con LocalStorage

### 💬 Pedidos por WhatsApp
- Formulario simple: nombre y ciudad
- Genera mensaje automático
- Abre WhatsApp directamente
- ¡Sin backend requerido!

## 🎨 Paleta de Colores

```
├─ Principal:      #C9A55C (Dorado elegante)
├─ Secundario:     #E4C98D (Dorado suave)
├─ Acento:         #F5D7DA (Rosa perla)
├─ Apoyo:          #F7F2EC (Beige claro)
├─ Fondo:          #FFFFFF (Blanco puro)
├─ Texto:          #1A1A1A (Negro oscuro)
└─ Secundario:     #666666 (Gris)
```

## 📱 Tecnologías

- **React** 18.2 - Interfaz de usuario
- **Lucide React** - Iconos profesionales
- **Framer Motion** - Animaciones suaves
- **React Router** - Navegación
- **LocalStorage** - Persistencia de datos
- **Tailwind CSS** - Estilos avanzados

## 📁 Estructura del Proyecto

```
guajira-bag/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── data.js              # Productos y configuración
│   ├── index.css            # Estilos globales
│   ├── index.js             # Punto de entrada
│   └── MenuPage.jsx         # Deprecado
├── public/
│   ├── images/              # 🖼️ Tus imágenes aquí
│   └── index.html           # Template HTML
├── build/                   # Salida compilada (after npm run build)
├── package.json             # Dependencias
├── INICIO_RAPIDO.md         # Guía rápida
└── README_GUAJIRA_BAGS.md   # Documentación completa
```

## ⚙️ Configuración

### Cambiar número de WhatsApp

Edita `src/data.js`:
```javascript
export const WA_NUMBER = "573016507487"; // Tu número aquí
```

### Personalizar productos

En `src/data.js`, modifica el objeto `PRODUCTS`:
```javascript
{
  id: "mw01",
  slug: "mochila-wayuu-premium-oro",
  name: "Tu Mochila",
  desc: "Descripción corta",
  price: 450000,
  category: "Mochilas Wayuu",
  image: "/images/tu-mochila.jpg"
}
```

### Agregar imágenes

1. Coloca archivos en `public/images/`
2. Referencia en `data.js`: `image: "/images/nombre.jpg"`

## 🌐 Despliegue

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
npm run build
# Sube la carpeta 'build' a tu repo
```

## 📊 Datos de Ejemplo

El proyecto incluye 15 mochilas de ejemplo con:
- Nombres atractivos
- Descripciones detalladas
- Precios realistas (COP)
- 5 categorías diferentes

## 🔧 Personalización Avanzada

### Cambiar colores de marca
Edita `:root` en `src/index.css`:
```css
:root {
  --primary: #C9A55C;
  --secondary: #E4C98D;
  /* etc... */
}
```

### Modificar fuentes
En `src/App.jsx` y `index.css`:
```css
fontFamily: "'Playfair Display', serif"  /* Títulos */
fontFamily: "'Cormorant Garamond', serif" /* Body */
```

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| npm start no funciona | `rm -r node_modules && npm install` |
| Imágenes no cargan | Verifica rutas en `data.js` |
| Carrito no persiste | Habilita LocalStorage en navegador |
| WhatsApp no abre | Verifica número en `data.js` (sin +) |
| Build fallido | `npm audit fix` y reintenta |

## 📈 Performance

- **Tamaño compilado**: 52.75 KB (gzip)
- **CSS**: 643 B
- **Optimizado** para móviles
- **Carga rápida** con assets estáticos

## 📄 Documentación Completa

Lee `README_GUAJIRA_BAGS.md` para documentación detallada:
- Características avanzadas
- API de datos
- Componentes
- Estilos
- Despliegue

## 📞 Soporte

**Ubicación**: Riohacha, La Guajira, Colombia  
**WhatsApp**: +57 301 6507487  
**Email**: info@guairabags.com

## 📝 Licencia

© 2024 Guajira Bags. Todos los derechos reservados.

## 🙏 Créditos

Desarrollo de tienda digital para artesanía Wayuu y Kankuama.
Preservando tradición con tecnología moderna.

---

**Hecho con ❤️ para la artesanía de La Guajira**

[Inicio Rápido](./INICIO_RAPIDO.md) • [Documentación](./README_GUAJIRA_BAGS.md)
