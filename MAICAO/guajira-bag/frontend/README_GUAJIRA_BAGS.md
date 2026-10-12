# 🎒 Guajira Bags - Tienda de Mochilas Wayuu

Una experiencia premium digital para explorar, seleccionar y comprar mochilas Wayuu y Kankuamas artesanales de La Guajira.

## 📋 Características

✨ **Identidad Visual Premium**
- Paleta de colores elegante (dorado #C9A55C, rosa perla, beige)
- Diseño minimalista y artesanal
- Animaciones suaves con Framer Motion
- Experiencia totalmente responsiva

📱 **Funcionalidades**
- Catálogo completo de mochilas por categorías
- Búsqueda y filtrado en tiempo real
- Carrito de compras persistente (LocalStorage)
- Integración directa con WhatsApp para pedidos
- Galería de productos con hover effects
- Información de contacto y ubicación

🎯 **Categorías de Productos**
- Mochilas Wayuu
- Mochilas Kankuamas
- Mini Bags
- Contemporáneas
- Premium

## 🚀 Instalación

```bash
npm install
npm start
```

## 🏗️ Estructura del Proyecto

```
src/
├── App.jsx          # Componente principal (navegación, páginas, carrito)
├── data.js          # Datos de productos, galería, configuración
├── index.css        # Estilos globales y paleta de colores
├── index.js         # Punto de entrada de React
├── MenuPage.jsx     # Deprecado (mantenido por compatibilidad)
└── ReservationPage.jsx  # Deprecado (mantenido por compatibilidad)

public/
├── images/          # Carpeta para imágenes de mochilas
└── index.html       # Template HTML
```

## 🎨 Paleta de Colores

```
--primary: #C9A55C        (Dorado elegante)
--secondary: #E4C98D      (Dorado suave)
--accent: #F5D7DA         (Rosa perla)
--support: #F7F2EC        (Beige claro)
--bg-primary: #FFFFFF     (Blanco puro)
--text-primary: #1A1A1A   (Texto principal)
--text-secondary: #666666 (Texto secundario)
```

## 📦 Agregar Imágenes

1. Coloca las imágenes en `public/images/`
2. Actualiza las rutas en `src/data.js`:

```javascript
{
  id: "mw01",
  slug: "mochila-wayuu-premium-oro",
  name: "Mochila Wayuu Premium Oro",
  image: "/images/mochila-wayuu-1.jpg",
  images: ["/images/mochila-wayuu-1.jpg"]
}
```

## 🛒 Sistema de Carrito

- **Almacenamiento**: LocalStorage (`guajira_cart`)
- **Persistencia**: Automática al agregar/modificar productos
- **Precio**: Formato de moneda COP automático
- **Integración WhatsApp**: Generación de mensaje automática

## 📞 Configuración de WhatsApp

Edita el número en `src/data.js`:

```javascript
export const WA_NUMBER = "573016507487"; // Reemplaza con tu número
```

## 🎯 Páginas Principales

### Home
- Hero section con propuesta de valor
- Historias de artesanía
- Galería de productos
- Información de contacto

### Catálogo (/catalogo)
- Grid responsivo de productos
- Búsqueda en tiempo real
- Filtrado por categoría
- Agregar al carrito

### Galería (/galeria)
- Galería Masonry
- Auto-scroll cada 5 segundos
- Hover effects

### Contacto (/contacto)
- Información de ubicación
- Links a redes sociales
- Botones de WhatsApp directo

## 🔧 Personalización

### Cambiar nombre de la tienda
Edita `App.jsx` - línea del logo:
```jsx
Guajira <span>Bags</span>
```

### Agregar nuevas categorías
En `src/data.js`, agrega una nueva clave en `PRODUCTS`:
```javascript
"Mi Categoría": {
  icon: "👜",
  items: [...]
}
```

### Modificar precios y productos
Edita directamente `src/data.js` en el objeto `PRODUCTS`.

## 📱 Responsive Design

- Mobile-first approach
- Grid auto-fit para productos
- Navegación adaptativa
- Touch-friendly buttons

## 🚀 Despliegue

### Opción 1: Vercel
```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Opción 3: GitHub Pages
```bash
npm run build
# Sube la carpeta 'build' a tu repositorio
```

## 🔐 Datos de Configuración

- **Email**: info@guairabags.com (editable en Contact)
- **WhatsApp**: +57 301 6507487
- **Ubicación**: Riohacha, La Guajira, Colombia
- **Soporte**: LocalStorage para carrito

## 🎬 Animaciones

- Fade-in al entrar en viewport
- Hover effects en tarjetas
- Smooth transitions
- Pulse animation en botón flotante

## 📚 Dependencias

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.383.0",
  "framer-motion": "^10.16.4",
  "react-router-dom": "^6.14.0"
}
```

## 🐛 Troubleshooting

**El carrito no se guarda**
- Verifica que LocalStorage está habilitado en el navegador

**Las imágenes no cargan**
- Asegúrate de que las rutas en `data.js` coinciden con los archivos en `public/images/`
- Verifica que los nombres de archivo no tienen espacios ni caracteres especiales

**WhatsApp no abre**
- Verifica que el número en `data.js` esté en formato correcto: `573016507487`
- Asegúrate de incluir el código de país sin `+`

## 📄 Licencia

© 2024 Guajira Bags. Todos los derechos reservados.

## 👩‍💼 Soporte

Para consultas sobre modificaciones o despliegue, contacta a través de WhatsApp o email.

---

**Hecho con ❤️ para la artesanía Wayuu y Kankuama**
