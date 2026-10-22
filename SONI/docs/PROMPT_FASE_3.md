# SONI · Fase 3 — Prompt maestro para Claude Code

Pega este documento en Claude Code, dentro del proyecto Android de SONI. Guárdalo también en `docs/PROMPT_FASE_3.md`. Pídele que implemente **una sub-fase cada vez**, que compile y que te muestre las pruebas antes de pasar a la siguiente. No le pidas todo de golpe: es la regla del documento maestro y evita que el proyecto se rompa.

---

## 0. Instrucción para Claude Code

Actúa como arquitecto Android sénior, ingeniero Kotlin y especialista en Jetpack Compose, seguridad móvil, accesibilidad y agentes. Vas a ampliar SONI, un asistente personal para Android que ya tiene las Fases 1 y 2 funcionando. Antes de tocar nada, lee `docs/SONI_documento_maestro.md` y respeta su arquitectura (motor + herramientas registradas + resultados tipados), su paleta de colores y sus reglas de seguridad.

Reglas que no debes romper en ninguna sub-fase:

- **No inventes APIs, SDK, permisos ni capacidades.** Si algo no es posible en la versión de Android del dispositivo, dilo y ofrece la alternativa más práctica.
- **No afirmes que una acción se completó sin una confirmación técnica real.** Distingue siempre «app abierta», «mensaje preparado» y «acción completada».
- **Cada acción pasa por una herramienta registrada** con nombre único, parámetros tipados, permisos declarados y nivel de riesgo. El motor nunca ejecuta texto como código.
- **Las acciones de riesgo alto piden confirmación explícita** y muestran exactamente qué va a ocurrir.
- **Pide los permisos en contexto**, cuando se usa la función, no todos al arrancar.
- **No registres secretos en logs.** No envíes contactos, ubicación ni datos personales a ningún servicio externo sin consentimiento.
- Trabaja en pasos pequeños: objetivo, archivos a crear o modificar con su ruta exacta, cambios en `AndroidManifest.xml`, dependencias, cómo compilar, pruebas manuales y limitaciones reales. Espera mi visto bueno entre pasos.
- Entre cada sub-fase: `./gradlew assembleDebug` y `./gradlew testDebugUnitTest` deben pasar.

Empieza confirmándome en qué estado están las Fases 1 y 2 en el proyecto actual (qué herramientas hay registradas en `ToolRegistry`, qué entidades Room existen) y proponme el orden de las sub-fases de abajo. Luego implementa la **Sub-fase 3.1**.

---

## 1. Qué incluye la Fase 3 (visión general)

La Fase 3 convierte a SONI de un asistente de preguntas en un asistente que **ejecuta acciones reales en el teléfono**: abrir y controlar apps, gestionar contactos, usar cámara, archivos y ubicación, responder desde segundo plano con la palabra «SONI», y resolver cálculos y conversiones mucho más completos. Todo con mejor estética y un icono nuevo.

Se entrega en **nueve sub-fases**, cada una compilable y probada por separado.

---

## 2. Realidades de Android que debes respetar

Dímelas con claridad en la app, no las escondas:

- **Micrófono «siempre activo».** Se logra con un *servicio en primer plano* y una *notificación permanente* («SONI está escuchando»). La palabra «SONI» la detecta un motor local (Vosk) sin internet. Desde Android 14 el servicio de micrófono debe iniciarse con la app abierta o tras reiniciar el teléfono. Consume batería; hay que poder apagarlo con un interruptor y un botón en la notificación.
- **Temperatura del ambiente.** Casi ningún teléfono tiene sensor de temperatura ambiente (`TYPE_AMBIENT_TEMPERATURE`); el de muchos modelos mide la temperatura interna, no la del aire. SONI debe: usar ese sensor **solo si existe**, y si no, dar la temperatura **exterior por geolocalización** con una API de clima gratuita, dejando claro de dónde sale el dato. Debe exponer también la temperatura de la batería, que sí está disponible siempre.
- **Automatizar otras apps** (pulsar botones dentro de WhatsApp, etc.) requiere un *servicio de accesibilidad*, que el usuario activa a mano en los ajustes de Android. Es frágil: se rompe cuando la app cambia. Úsalo solo cuando no haya intent ni API oficial, como último recurso.
- **Controlar la música** (Spotify y otros) se hace con `MediaController`/`MediaSession` y con el permiso de acceso a notificaciones, sin depender del SDK de Spotify. Requiere que la app de música esté abierta y con sesión activa.
- **Editar contactos, cámara, ubicación, archivos** son permisos normales que tú concederás. SONI los pide en contexto.
- **«Acceso a todo» no significa saltarse protecciones.** SONI nunca elude el bloqueo de pantalla, la huella, apps bancarias que bloquean accesibilidad, ni CAPTCHA. Eso lo dice el documento maestro y debe cumplirse.

---

## 3. Estética e icono (Sub-fase 3.9, pero tenla presente desde el inicio)

Mantén la identidad del documento maestro (fondo `#070B16`, violeta `#8B5CF6`, azul `#38BDF8`, lavanda `#C4B5FD`) y súbele el nivel:

- **Núcleo vivo.** El orbe reacciona de verdad: late con el volumen real del micrófono al escuchar, gira más rápido al procesar y pulsa al hablar. Añade un estado «en segundo plano» (orbe tenue) cuando SONI escucha la palabra clave con la app cerrada.
- **Profundidad sobria.** Capas de vidrio esmerilado (blur) sobre el fondo, bordes finos luminosos, sombras suaves. Nada recargado; una sola cosa llamativa por pantalla (el núcleo).
- **Tipografía con jerarquía clara.** Un tamaño de display para el estado, cuerpo legible para la conversación. Respeta el tamaño de fuente del sistema.
- **Movimiento con criterio.** Una animación de entrada al abrir, transiciones al cambiar de estado. Respeta «reducir movimiento» del sistema (ya implementado en Fase 1; consérvalo).
- **Barra de acciones rápidas** rediseñada: Recordatorios, Contactos, Música, Cámara, Ubicación, Ajustes, cada una con su icono y estado.
- **Tarjetas de resultado ricas.** Cuando SONI hace algo (crea un contacto, abre una ruta, controla música), muestra una tarjeta con lo que pasó y un botón para deshacer o abrir, no solo texto.
- **Icono nuevo.** Diseña un icono adaptable (`foreground` + `background` vectoriales) con el orbe azul-violeta sobre fondo oscuro, más la versión monocroma para Android 13+ (icono temático). Entrégalo como vectores, sin copiar marcas.
- **Modo claro opcional** (no obligatorio): si lo haces, deriva la paleta del mismo sistema de colores.

---

## 4. Sub-fases en orden

### Sub-fase 3.1 — Base de acciones y motor ampliado
Objetivo: dejar lista la «columna vertebral» para muchas herramientas nuevas.
- Amplía el `IntentParser` o introduce un sistema de intenciones por herramienta (cada herramienta declara sus patrones) para que agregar funciones no infle un solo archivo.
- Añade al flujo del motor la comprobación real de **permisos** y **nivel de riesgo** antes de ejecutar (ya definidos en el contrato de herramientas). Riesgo alto → pide confirmación en la interfaz.
- Añade un **registro de acciones** (qué se ejecutó, cuándo, con qué resultado), visible en la app y borrable, sin guardar secretos.
- Pruebas: una acción de riesgo alto simulada exige confirmación; una denegada por permiso devuelve `NeedsPermission` y no se ejecuta.

### Sub-fase 3.2 — Cálculos y conversiones avanzados
Objetivo: una calculadora de verdad, sin `eval`.
- Amplía `SafeCalculator`: funciones (`raíz`, `seno`, `coseno`, `tangente`, `log`, `ln`), constantes (`pi`, `e`), porcentajes encadenados, paréntesis anidados, módulo y factorial con límites.
- **Conversión de unidades**: longitud, peso, temperatura (°C/°F/K), tiempo, datos, velocidad, moneda (con API de tasas gratuita y aviso si no hay internet).
- Entiende todo dicho en palabras y en español («raíz cuadrada de dos mil veinticinco», «cuántos kilómetros son diez millas»).
- Pruebas unitarias para cada tipo de operación y para expresiones inválidas.

### Sub-fase 3.3 — Información y sensores del dispositivo
Objetivo: SONI «conoce» el teléfono.
- Herramienta de **estado del dispositivo**: batería (nivel, si carga, temperatura), almacenamiento libre, memoria, red (wifi/datos, sin exponer contraseñas), brillo, volumen, modelo y versión de Android.
- **Sensores**: temperatura ambiente solo si el sensor existe; si no, lo explica. Luz, si está disponible.
- Acciones: linterna, cambiar volumen y brillo (riesgo bajo), activar/desactivar wifi o datos según lo permita la versión de Android (y si no lo permite, abrir el ajuste correspondiente).
- Pruebas: en un dispositivo sin sensor de ambiente, la herramienta responde con la alternativa y no se cae.

### Sub-fase 3.4 — Apps, música y multimedia
Objetivo: abrir y controlar apps instaladas.
- **Abrir cualquier app por su nombre** («abre WhatsApp»), resolviendo el nombre contra las apps instaladas (`PackageManager`, con el elemento `<queries>` correcto en el manifiesto). Si hay varias coincidencias, preguntar.
- **Control de música** con `MediaController`/`MediaSessionManager` (permiso de acceso a notificaciones): reproducir, pausar, siguiente, anterior, subir/bajar volumen, saber qué suena. Funciona con Spotify y otros reproductores. Para pedir una canción concreta en Spotify, abrir la app con el intent de búsqueda y aclarar que la reproducción depende de la cuenta.
- Pruebas: distinguir «Spotify abierto» de «reproducción iniciada»; si no hay reproductor con sesión, avisar.

### Sub-fase 3.5 — Contactos (crear, leer, actualizar, borrar) y comunicación
Objetivo: gestión completa de contactos, con seguridad.
- Leer, **crear, actualizar y eliminar** contactos (permiso de contactos). Toda escritura muestra una revisión antes de confirmar; borrar es riesgo alto y pide confirmación.
- Alias ya existentes de Fase 1/3 reutilizados; resolver ambigüedades preguntando, nunca adivinando.
- Llamadas con `ACTION_DIAL` por defecto; `ACTION_CALL` solo con permiso y confirmación. SMS con confirmación de destinatario y texto.
- Mensajería por apps (WhatsApp, etc.) mediante intents oficiales; aviso de que el envío automático total no está garantizado desde fuera de la app.
- Pruebas: dos contactos de nombre parecido nunca disparan una llamada automática; una creación de contacto muestra revisión y se puede cancelar.

### Sub-fase 3.6 — Cámara y archivos
Objetivo: SONI usa cámara y gestiona archivos, con acceso que tú concederás.
- **Cámara**: tomar foto o grabar vídeo (permiso de cámara), con `FileProvider` para guardar y compartir. Opcional: abrir la cámara en modo foto/vídeo/selfie por voz.
- **Archivos**: buscar, abrir, mover, copiar, renombrar y compartir archivos del almacenamiento accesible. En Android moderno usa el Storage Access Framework o `MediaStore`; para acceso amplio evalúa `MANAGE_EXTERNAL_STORAGE` y advierte que Google Play lo restringe (no afecta a una app de uso personal instalada por ti).
- Toda eliminación de archivos es riesgo alto y pide confirmación mostrando la ruta.
- Pruebas: tomar una foto devuelve una ruta verificable; borrar un archivo exige confirmación.

### Sub-fase 3.7 — Ubicación, mapas y clima
Objetivo: SONI sabe dónde está y lo usa.
- **Geolocalización** (permiso de ubicación en contexto): ubicación actual, dirección aproximada (geocoding), abrir rutas en la app de mapas elegida, lugares cercanos.
- **Clima** por ubicación con API gratuita; indica la fuente y no inventa datos. Combínalo con la temperatura del dispositivo de la Sub-fase 3.3 para responder «¿qué temperatura hace?» de forma honesta (exterior vs. batería vs. sensor).
- Sin seguimiento en segundo plano salvo una finalidad clara que el usuario active.
- Pruebas: sin conexión, el clima falla con mensaje claro; la ubicación se puede introducir a mano.

### Sub-fase 3.8 — Segundo plano y palabra de activación «SONI»
Objetivo: SONI responde con la app cerrada.
- **Servicio en primer plano** con notificación permanente, controles para pausar/detener la escucha, y un interruptor en Ajustes.
- **Palabra clave «SONI»** con detección local (Vosk, modelo en español, sin internet). Al detectarla, SONI pasa a escuchar la orden completa.
- Arranque del servicio al encender el teléfono (`BOOT_COMPLETED`) si el usuario lo activó.
- **Baldosa de Ajustes rápidos** (Quick Settings tile) y **widget** para activar SONI al instante.
- Medición de consumo de batería y aviso honesto. Indicadores reales de cuándo el micrófono está activo.
- Pruebas: con la app cerrada, decir «SONI» la despierta; apagar el servicio detiene de verdad el micrófono; tras reiniciar, el servicio vuelve solo si estaba activado.

### Sub-fase 3.9 — Rediseño estético e icono
Objetivo: aplicar todo lo de la sección 3.
- Implementa el nuevo núcleo, las capas de vidrio, las tarjetas de resultado, la barra de accesos rápidos y el icono adaptable + temático.
- Revisa accesibilidad (TalkBack, contraste, tamaños de fuente, reducir movimiento) y rendimiento (que las animaciones no disparen la batería).
- Pruebas manuales de aspecto en teléfono y captura para comparar.

---

## 5. Automatización avanzada (opcional, después de 3.9)
Si tras la Fase 3 quieres que SONI accione cosas dentro de otras apps (p. ej. enviar un WhatsApp escrito por voz sin abrir la app), esto va en una fase propia con `AccessibilityService`, activado a mano, transparente, con pasos verificables y posibilidad de cancelar, y respetando que no se usa para apps que lo bloquean. Pídemelo aparte cuando llegues ahí.

---

## 6. Primera tarea concreta para Claude Code

Implementa **solo la Sub-fase 3.1**. Entrégame los archivos completos con su ruta exacta, los cambios de `AndroidManifest.xml` y de Gradle, cómo compilar y probar, y las limitaciones reales. No empieces cámara, segundo plano ni accesibilidad todavía. No afirmes que probaste en mi teléfono; indícame cómo verificarlo. Cuando yo confirme que la 3.1 funciona, seguimos con la 3.2.
