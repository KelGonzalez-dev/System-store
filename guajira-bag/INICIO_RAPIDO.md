# 🚀 GUÍA RÁPIDA DE INICIO - GUAJIRA BAGS

## ¡Bienvenido! Aquí está todo lo que necesitas saber para empezar.

### 1️⃣ INSTALAR DEPENDENCIAS

```bash
npm install
```

### 2️⃣ INICIAR EN DESARROLLO

```bash
npm start
```

Se abrirá `http://localhost:3000` automáticamente.

### 3️⃣ PRIMEROS PASOS

#### A. Ver el catálogo completo
- La app está lista con 15 mochilas de ejemplo
- Categorías: Wayuu, Kankuama, Mini Bags, Contemporáneas, Premium

#### B. Probar el carrito
1. Haz clic en "Ver Catálogo"
2. Busca un producto
3. Haz clic en "+ Agregar al carrito"
4. Se abre automáticamente el carrito en la esquina inferior derecha

#### C. Hacer un pedido de prueba
1. Agrega productos al carrito
2. Haz clic en "Realizar Pedido"
3. Completa nombre y ciudad
4. Haz clic en "Enviar por WhatsApp"
5. ¡Se abrirá WhatsApp automáticamente! 📱

### 4️⃣ CAMBIAR INFORMACIÓN

#### Número de WhatsApp
Edita en `src/data.js`:
```javascript
export const WA_NUMBER = "573016507487"; // Reemplaza aquí
```

#### Datos de productos
En `src/data.js`, encontrarás el objeto `PRODUCTS` con todas las mochilas. 
Puedes:
- Cambiar nombres
- Cambiar precios
- Cambiar descripciones
- Agregar nuevos productos

Ejemplo:
```javascript
{
  id: "mw01",
  slug: "mi-mochila",
  name: "Mi Mochila Premium",
  desc: "Descripción corta",
  price: 450000,
  image: "/images/mochila.jpg",
  category: "Mochilas Wayuu",
  details: "Descripción larga",
  images: ["/images/mochila.jpg"]
}
```

### 5️⃣ AGREGAR IMÁGENES

1. Crea carpeta `public/images/` (ya existe)
2. Coloca tus imágenes JPG/PNG allí
3. Actualiza las rutas en `src/data.js`

Ejemplo:
```javascript
image: "/images/mochila-wayuu-1.jpg"
```

### 6️⃣ NAVEGAR LA INTERFAZ

| Sección | Ruta | Contenido |
|---------|------|----------|
| Home | / | Hero, historia, footer |
| Catálogo | /catalogo | Grid de productos, búsqueda |
| Galería | /galeria | Imágenes de productos |
| Contacto | /contacto | Info y redes sociales |

### 7️⃣ COLORES DE LA MARCA

```css
Dorado principal:    #C9A55C
Rosa perla:          #F5D7DA
Beige claro:         #F7F2EC
Blanco:              #FFFFFF
Texto oscuro:        #1A1A1A
```

Localiza en `src/index.css` para personalizarlos.

### 8️⃣ CONSTRUIR PARA PRODUCCIÓN

```bash
npm run build
```

Genera carpeta `build/` lista para desplegar.

### 9️⃣ DESPLEGAR A LA WEB

**Opción A: Vercel (Recomendado)**
```bash
npm install -g vercel
vercel
```

**Opción B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Opción C: GitHub Pages**
1. Sube el proyecto a GitHub
2. Copia carpeta `build` a GitHub Pages
3. ¡Listo! ✨

### 🔟 SOLUCIONAR PROBLEMAS

**"npm start no funciona"**
```bash
rm -r node_modules package-lock.json
npm install
npm start
```

**"Las imágenes no se muestran"**
- Verifica que están en `public/images/`
- Verifica las rutas en `data.js`

**"El carrito no se guarda"**
- Abre DevTools (F12)
- Ve a Application > LocalStorage
- Debe haber una entrada `guajira_cart`

### 📧 ESTRUCTURA DE ARCHIVOS IMPORTANTE

```
guajira-bag/
├── src/
│   ├── App.jsx          ← MAIN (toda la lógica)
│   ├── data.js          ← PRODUCTOS Y CONFIGURACIÓN
│   ├── index.css        ← ESTILOS Y COLORES
│   └── index.js         ← Punto de entrada
├── public/
│   └── images/          ← TOCA AQUÍ para agregar fotos
├── package.json         ← Dependencias
└── build/               ← Se crea al compilar
```

### 🎯 PRÓXIMOS PASOS

1. ✅ Personaliza los colores en `index.css`
2. ✅ Agrega tus imágenes en `public/images/`
3. ✅ Actualiza productos en `src/data.js`
4. ✅ Cambia el número de WhatsApp
5. ✅ Prueba todo en localhost
6. ✅ Compila con `npm run build`
7. ✅ Deploya a Vercel/Netlify

### 💡 TIPS PROFESIONALES

- **Optimizar imágenes**: Usa herramientas como TinyPNG antes de subir
- **SEO**: Edita `public/index.html` para meta tags
- **Mobile**: Prueba en dispositivos móviles con DevTools
- **Performance**: El build actual es de solo 52KB ⚡

### 🆘 ¿NECESITAS AYUDA?

1. Lee `README_GUAJIRA_BAGS.md` para documentación completa
2. Revisa `src/App.jsx` - está bien comentado
3. Consulta `src/data.js` para entender la estructura

---

**¡Felicidades! Ya tienes Guajira Bags funcionando. 🎉**

Próximo paso: `npm start` y comienza a explorar.
