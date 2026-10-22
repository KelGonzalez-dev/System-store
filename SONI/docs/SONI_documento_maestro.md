# SONI --- Documento maestro de visión, diseño y desarrollo

## Asistente personal inteligente para Android

**Versión:** 1.0\
**Plataforma inicial:** Android\
**Lenguaje principal:** Kotlin\
**IDE:** Android Studio\
**Presupuesto inicial:** 0 COP; priorizar herramientas gratuitas y
soluciones locales\
**Nombre del proyecto:** SONI\
**Tipo de producto:** agente personal de IA capaz de interpretar órdenes
y ejecutar tareas autorizadas en el teléfono

------------------------------------------------------------------------

# 1. Propósito del documento

Este documento define la visión, los requisitos, la arquitectura, el
diseño visual, las medidas de seguridad y el plan de implementación de
SONI. Puede utilizarse como especificación para desarrollar el proyecto
manualmente en Android Studio o como **prompt maestro** para una
herramienta de asistencia a la programación.

La instrucción central es construir una aplicación Android funcional,
modular, segura y ampliable. SONI no debe limitarse a responder
preguntas: cuando el sistema operativo y las aplicaciones lo permitan,
debe ejecutar acciones reales mediante herramientas de software
claramente definidas.

No se debe afirmar que una función está implementada hasta que exista
código funcional y se haya probado en un dispositivo o emulador. Si una
acción está limitada por Android, una aplicación externa o una política
de servicio, se debe explicar la limitación y ofrecer la alternativa más
práctica.

# 2. Visión del producto

SONI será un asistente personal de voz con una interfaz futurista,
oscura y elegante. El usuario podrá hablarle de manera natural, pedirle
información, crear recordatorios, localizar contactos, iniciar llamadas,
preparar mensajes, controlar música, buscar información en internet,
consultar rutas y automatizar flujos compatibles con aplicaciones
instaladas.

La experiencia deseada es:

1.  El usuario dice «SONI» o utiliza el método de activación disponible.
2.  SONI escucha y transcribe la orden.
3.  El motor interpreta la intención y determina qué herramienta
    necesita.
4.  La herramienta comprueba permisos, parámetros y riesgos.
5.  SONI ejecuta la acción si está autorizada y técnicamente disponible.
6.  El asistente comunica el resultado con voz y texto.
7.  Si ocurre un error, explica qué pasó y propone un siguiente paso
    concreto.

**Principio de diseño:** la IA interpreta y planifica; el código de la
aplicación ejecuta las operaciones. No se debe delegar una acción
delicada únicamente a texto generado por un modelo.

# 3. Objetivos

## 3.1 Objetivos principales

-   Interacción por voz en español.
-   Respuestas habladas y escritas.
-   Comandos básicos sin depender de una API comercial.
-   Recordatorios y tareas programadas.
-   Contactos, alias personales y llamadas.
-   Mensajería mediante interfaces autorizadas.
-   Reproducción y controles de música compatibles con Spotify.
-   Búsquedas web, lectura de páginas públicas y resúmenes.
-   Apertura de aplicaciones y automatización gradual.
-   Consultas de fecha, hora, cálculos y clima.
-   Ubicación y rutas mediante servicios compatibles.
-   Memoria local de preferencias y relaciones definidas por el usuario.
-   Bóveda cifrada para datos privados, si se implementa de forma
    segura.
-   Arquitectura modular que permita agregar herramientas en el futuro.
-   Coste inicial de desarrollo de cero pesos, usando herramientas
    gratuitas siempre que sea viable.

## 3.2 Lo que no debe prometerse

SONI no puede controlar literalmente todas las aplicaciones ni saltarse
las restricciones del sistema operativo. No puede ejecutarse cuando el
teléfono está completamente apagado. La activación permanente por
palabra clave, el acceso al micrófono en segundo plano, las llamadas,
las respuestas a llamadas, los mensajes y la automatización de
aplicaciones dependen de la versión de Android, los permisos, las
aplicaciones instaladas y sus interfaces.

No se debe prometer IA ilimitada, acceso gratuito ilimitado a servicios
externos ni funcionamiento perfecto sin internet. Deben indicarse
claramente las funciones locales y las que requieren conectividad.

# 4. Plataforma y tecnologías

## 4.1 Base técnica

-   **Android Studio:** entorno principal de desarrollo.
-   **Kotlin:** lenguaje principal.
-   **Jetpack Compose:** interfaz moderna declarativa.
-   **MVVM:** separación entre interfaz, estado y lógica.
-   **Coroutines y Flow:** operaciones asíncronas y observación de
    estado.
-   **Room sobre SQLite:** base de datos local.
-   **DataStore:** preferencias no sensibles.
-   **Android Keystore:** protección de claves criptográficas.
-   **SpeechRecognizer:** reconocimiento de voz cuando el servicio del
    dispositivo lo permita.
-   **TextToSpeech:** respuestas habladas.
-   **AlarmManager y/o WorkManager:** recordatorios y tareas,
    seleccionando la herramienta apropiada para cada necesidad.
-   **Contacts Provider:** lectura o escritura de contactos con permiso.
-   **Intents de Android:** apertura de aplicaciones, marcador, mensajes
    y navegación cuando sean compatibles.
-   **Android Location APIs:** ubicación con consentimiento.
-   **Custom Tabs o navegador instalado:** apertura de páginas y
    búsquedas.
-   **AccessibilityService:** automatización avanzada solo cuando sea
    necesaria, transparente, autorizada y conforme a las políticas
    aplicables.
-   **Pruebas unitarias e instrumentadas:** validación del motor y de
    las funciones del dispositivo.

Las versiones de Gradle, Kotlin, Android Gradle Plugin y bibliotecas
deben elegirse compatibles entre sí en el momento de crear el proyecto.
No fijar versiones antiguas sin comprobar su compatibilidad.

## 4.2 Estrategia de IA

Primera etapa: motor de intenciones local basado en reglas, comandos y
herramientas explícitas. Así, hora, fecha, recordatorios, alias y
acciones básicas no necesitan una API de IA.

Etapa posterior: incorporar una interfaz `AIProvider` intercambiable.
Puede conectarse a un modelo local compatible o a un servicio externo
gratuito con límites, cuando el usuario lo decida. Las claves de API no
deben incluirse en el repositorio ni en el APK. No enviar contactos,
contraseñas, mensajes privados o datos personales a un proveedor externo
sin consentimiento explícito.

## 4.3 Política de costes

Priorizar software libre, SDK oficiales y funciones locales. Antes de
integrar mapas, IA, reconocimiento de voz o búsquedas, revisar si el
servicio tiene cuotas, registro, límites, términos o costes. No utilizar
una tarjeta de pago ni activar facturación por defecto.

# 5. Diseño visual de la interfaz

## 5.1 Dirección artística

Crear una interfaz futurista premium inspirada en paneles de asistencia
tecnológica y hologramas, sin copiar marcas, logotipos ni interfaces
protegidas. Debe sentirse limpia, elegante, legible y práctica, no
recargada.

### Paleta de colores

-   Fondo principal: azul marino casi negro, por ejemplo `#070B16`.
-   Superficie de tarjetas: `#10182A`.
-   Superficie secundaria: `#151F35`.
-   Violeta eléctrico principal: `#8B5CF6`.
-   Azul luminoso secundario: `#38BDF8`.
-   Acento opcional lavanda: `#C4B5FD`.
-   Texto principal: `#F4F7FF`.
-   Texto secundario: `#9AA8C7`.
-   Estado correcto: verde suave `#34D399`.
-   Advertencia: ámbar `#FBBF24`.
-   Error: rojo `#FB7185`.

Usar gradientes azul-violeta de manera moderada. El resplandor debe
destacar el núcleo de SONI, el estado de escucha y acciones importantes,
sin perjudicar la legibilidad ni la batería.

### Formas y composición

-   Tarjetas con esquinas redondeadas de 16--24 dp.
-   Márgenes amplios y jerarquía tipográfica clara.
-   Iconografía consistente, preferentemente Material Symbols.
-   Animaciones suaves, breves y respetuosas con la opción de reducir
    movimiento.
-   Contraste suficiente para leer texto en exteriores y con brillo
    bajo.
-   Adaptación a diferentes tamaños de pantalla y a accesibilidad del
    sistema.
-   Evitar elementos decorativos que parezcan botones si no ejecutan
    acciones.

## 5.2 Pantalla principal

Diseñar una pantalla inicial con:

1.  **Barra superior:** logotipo tipográfico SONI, estado del asistente
    y acceso a ajustes.
2.  **Núcleo visual central:** esfera u orbe abstracto azul y violeta.
    Puede tener animaciones ligeras para los estados inactivo,
    escuchando, procesando y hablando.
3.  **Estado textual:** «En espera», «Te escucho», «Procesando» o
    «Acción completada».
4.  **Botón de micrófono:** claramente visible, con estados accesibles.
5.  **Campo de texto alternativo:** para escribir comandos cuando no se
    pueda usar la voz.
6.  **Conversación reciente:** órdenes y resultados, con indicación
    clara de qué acción se ejecutó.
7.  **Accesos rápidos opcionales:** Recordatorios, Contactos, Música,
    Buscar y Rutas.
8.  **Indicador de privacidad:** mostrar de forma comprensible si el
    micrófono está activo o si se está usando un servicio remoto.

No mostrar un falso indicador de escucha permanente. La interfaz debe
reflejar el estado real del servicio.

## 5.3 Pantallas adicionales

### Conversación

-   Historial de mensajes del usuario y SONI.
-   Indicador de actividad y errores.
-   Acciones sugeridas cuando una orden no se entienda.
-   Botón para detener una acción cuando sea posible.

### Recordatorios

-   Lista de recordatorios próximos, vencidos y completados.
-   Crear, editar, posponer y eliminar.
-   Fecha, hora, repetición y estado.
-   Permitir revisar las alarmas programadas.

### Contactos y relaciones

-   Alias como «mamá», «papá», «hermano», «profesora» o términos
    personalizados.
-   Mostrar el contacto y número asociados antes de confirmar cambios.
-   Resolver coincidencias ambiguas con una pregunta breve.
-   No inferir relaciones personales solo por el nombre.

### Privacidad y seguridad

-   Permisos concedidos y su finalidad.
-   Gestión de memoria y alias.
-   Bóveda de credenciales si se implementa.
-   Bloqueo de la bóveda mediante autenticación del dispositivo.
-   Exportación y eliminación segura de datos locales.
-   Opción de desactivar la memoria o el procesamiento remoto.

### Automatizaciones

-   Lista de flujos creados por el usuario.
-   Aplicación involucrada, pasos, permisos y resultado esperado.
-   Activación/desactivación individual.
-   Registro de ejecución y errores, sin registrar secretos
    innecesarios.

### Ajustes

-   Método de activación.
-   Idioma y voz.
-   Volumen de respuestas.
-   Aplicación de mapas preferida.
-   Opciones de privacidad.
-   Gestión de herramientas e integraciones.
-   Diagnóstico del estado del sistema.

# 6. Arquitectura de software

Separar la aplicación por responsabilidades. Evitar una `MainActivity`
gigantesca y evitar mezclar la lógica de contactos, voz, recordatorios y
red en la interfaz.

Estructura sugerida:

``` text
SONI/
├── app/
│   └── src/main/
│       ├── AndroidManifest.xml
│       └── java/com/soni/assistant/
│           ├── MainActivity.kt
│           ├── app/
│           │   ├── SoniApplication.kt
│           │   └── Navigation.kt
│           ├── core/
│           │   ├── SoniEngine.kt
│           │   ├── IntentParser.kt
│           │   ├── Action.kt
│           │   ├── ActionResult.kt
│           │   ├── ToolRegistry.kt
│           │   └── PermissionManager.kt
│           ├── voice/
│           │   ├── SpeechInput.kt
│           │   ├── SpeechOutput.kt
│           │   └── WakeWordManager.kt
│           ├── tools/
│           │   ├── TimeTool.kt
│           │   ├── CalculatorTool.kt
│           │   ├── ContactsTool.kt
│           │   ├── CallsTool.kt
│           │   ├── RemindersTool.kt
│           │   ├── MessagingTool.kt
│           │   ├── MusicTool.kt
│           │   ├── WebSearchTool.kt
│           │   ├── BrowserTool.kt
│           │   ├── MapsTool.kt
│           │   └── NotificationsTool.kt
│           ├── data/
│           │   ├── database/SoniDatabase.kt
│           │   ├── database/ReminderEntity.kt
│           │   ├── database/ContactAliasEntity.kt
│           │   ├── database/MemoryEntity.kt
│           │   ├── repository/SoniRepository.kt
│           │   └── preferences/SoniPreferences.kt
│           ├── security/
│           │   ├── SecureVault.kt
│           │   └── CryptoManager.kt
│           ├── automation/
│           │   ├── AutomationPlan.kt
│           │   └── AccessibilityAutomationService.kt
│           └── ui/
│               ├── theme/Color.kt
│               ├── theme/Theme.kt
│               ├── theme/Type.kt
│               ├── home/HomeScreen.kt
│               ├── chat/ChatScreen.kt
│               ├── reminders/RemindersScreen.kt
│               ├── contacts/ContactAliasesScreen.kt
│               ├── privacy/PrivacyScreen.kt
│               ├── automation/AutomationScreen.kt
│               └── settings/SettingsScreen.kt
└── README.md
```

No crear todos los archivos vacíos desde el primer día. Implementar una
fase, compilar, probar y después incorporar la siguiente.

## 6.1 Flujo de una orden

1.  `SpeechInput` obtiene una transcripción o la persona escribe el
    comando.
2.  `SoniEngine` normaliza la entrada y determina el contexto.
3.  `IntentParser` identifica una intención conocida o solicita ayuda al
    proveedor de IA configurado.
4.  `ToolRegistry` encuentra la herramienta adecuada.
5.  La herramienta valida parámetros, permisos y nivel de riesgo.
6.  Si necesita autorización, la solicita a través de una interfaz
    clara.
7.  Ejecuta la operación y devuelve un `ActionResult`.
8.  La interfaz muestra el resultado y `SpeechOutput` lo pronuncia.
9.  Si falla, devuelve un error comprensible y no finge haber completado
    la tarea.

Definir estados de ejecución como `Pending`, `NeedsPermission`,
`NeedsConfirmation`, `Running`, `Success` y `Failed`.

## 6.2 Contrato de herramientas

Cada herramienta debe tener: - Nombre único. - Descripción. - Parámetros
tipados y validados. - Permisos requeridos. - Nivel de riesgo. - Método
de ejecución. - Resultado estructurado. - Errores recuperables y
mensajes comprensibles.

No ejecutar texto arbitrario como código. El modelo de IA no debe poder
inventar nombres de herramientas ni saltarse sus validaciones.

# 7. Funciones detalladas

## 7.1 Activación y voz

Primera versión: - Botón para hablar. - Reconocimiento en español. -
Texto transcrito visible. - Respuesta hablada con `TextToSpeech`. -
Manejo de errores, ausencia de micrófono, permiso denegado y
cancelación. - Liberación de recursos al cerrar la pantalla o servicio.

Fase avanzada: - Evaluar un detector local de palabra clave «SONI». -
Medir consumo de batería y memoria. - Estudiar los mecanismos de
asistente predeterminado de Android. - Usar servicios en primer plano
solo cuando sea apropiado y cumpliendo las restricciones actuales. -
Mostrar indicadores reales y controles para detener la escucha.

No asumir que `SpeechRecognizer` es adecuado para escucha continua. La
activación en segundo plano debe tratarse como un proyecto técnico
separado y probarse en varios dispositivos.

## 7.2 Cálculos, fecha y hora

-   Fecha y hora locales del dispositivo.
-   Zona horaria correcta.
-   Operaciones matemáticas con un parser seguro.
-   Rechazar expresiones inválidas o excesivamente complejas.
-   No usar `eval` ni ejecutar expresiones como código.
-   Conversión de unidades en una fase posterior.
-   Clima mediante fuente compatible, aclarando si no hay conexión.

## 7.3 Recordatorios

Ejemplos: - «SONI, recuérdame estudiar a las ocho». - «Recuérdame llamar
a mi mamá dentro de dos horas». - «Recuérdame pagar esto todos los
meses». - «¿Qué tengo pendiente mañana?».

Requisitos: - Interpretar fecha y hora; si hay ambigüedad importante,
preguntar. - Guardar el recordatorio en Room antes de confirmar. -
Programar la notificación con el mecanismo adecuado. - Gestionar
permisos de notificaciones y alarmas exactas cuando correspondan. -
Reprogramar tras reinicio si es necesario. - Posponer, completar, editar
y eliminar. - Evitar duplicados. - Explicar si Android no permite
programar una alarma exacta.

## 7.4 Contactos y alias

Permitir que el usuario defina explícitamente que «mamá» corresponde a
un contacto concreto. Guardar el alias y un identificador estable del
contacto, junto con el número normalizado cuando sea necesario.

Flujo: 1. Usuario: «SONI, llama a mamá». 2. Buscar el alias. 3. Resolver
el contacto y el número. 4. Si existe una única coincidencia válida,
continuar según los permisos configurados. 5. Si hay varias
coincidencias o un dato obsoleto, preguntar. 6. Mostrar o comunicar el
resultado.

No depender exclusivamente de coincidencias aproximadas del nombre. No
llamar a un número ambiguo sin resolver la ambigüedad.

Para guardar contactos, pedir número y nombre y mostrar una revisión
antes de escribir. Solicitar el permiso de contactos solo cuando se
utilice la función.

## 7.5 Llamadas

-   Usar el marcador mediante `ACTION_DIAL` como alternativa de menor
    privilegio.
-   Usar `ACTION_CALL` solo si la función directa está justificada y el
    usuario ha concedido el permiso necesario.
-   No asumir que una llamada se inició hasta recibir un resultado
    verificable.
-   Las llamadas entrantes, contestar o rechazar requieren una
    integración compatible con Android y, en algunos casos, roles
    especiales o APIs restringidas.
-   No intentar eludir el bloqueo de pantalla ni las restricciones del
    sistema.

## 7.6 Mensajería y notificaciones

-   Permitir redactar mensajes por voz.
-   Confirmar destinatario y contenido antes de envíos sensibles, o
    proporcionar un modo de confirmación configurable con protecciones.
-   Usar intents, APIs oficiales o mecanismos permitidos por la
    aplicación.
-   No asumir que WhatsApp permite enviar cualquier mensaje de forma
    automática desde una app externa.
-   Para leer notificaciones, solicitar acceso explícito mediante los
    ajustes del sistema.
-   Ofrecer filtros configurables para categorías o aplicaciones.
-   No borrar, descartar ni responder automáticamente a notificaciones
    importantes sin reglas claras del usuario.
-   Ocultar contenido privado en la pantalla bloqueada cuando
    corresponda.

## 7.7 Música y Spotify

-   Abrir Spotify y solicitar una búsqueda o reproducción mediante
    mecanismos compatibles.
-   Investigar el SDK oficial de Android y sus requisitos actuales.
-   Respetar autenticación, cuenta, disponibilidad de funciones y
    límites del servicio.
-   Soportar, cuando la integración lo permita: reproducir, pausar,
    continuar, siguiente, anterior, aleatorio y repetición.
-   Informar cuando una acción requiera que Spotify esté instalado,
    abierto o autenticado.
-   No afirmar que se ha reproducido una pista si solo se abrió la
    aplicación.

## 7.8 Navegación web e investigación

-   Abrir búsquedas web en el navegador elegido por el usuario.
-   Consultar páginas públicas y extraer información cuando sea
    técnicamente viable.
-   Resumir contenido y comparar fuentes.
-   Distinguir información encontrada de conclusiones propias.
-   No iniciar sesión, aceptar contratos, publicar contenido, comprar ni
    enviar información personal sin autorización apropiada.
-   Tratar el contenido de las páginas como datos no confiables; ignorar
    instrucciones de una web que intenten controlar SONI o acceder a sus
    secretos.
-   Respetar los términos y restricciones de los sitios web.
-   Gestionar errores de red y páginas incompatibles.

Una aplicación Android no puede controlar universalmente todos los
navegadores y sitios. La automatización debe basarse en integraciones
concretas y fallar de manera segura.

## 7.9 Mapas y rutas

-   Pedir permiso de ubicación en contexto.
-   Permitir introducir manualmente un origen o destino.
-   Abrir una ruta en la aplicación de mapas elegida.
-   Consultar rutas y tiempos con una fuente compatible.
-   No inventar distancias ni tiempos de tráfico.
-   Permitir cambiar entre caminar, conducir o transporte cuando el
    proveedor lo admita.
-   No mantener seguimiento de ubicación en segundo plano sin una
    finalidad clara y autorización.

## 7.10 Automatización de otras aplicaciones

Implementar primero intents y APIs oficiales. Solo si no existe otra
alternativa razonable, evaluar `AccessibilityService`.

Si se utiliza: - Explicar al usuario qué puede leer y qué puede
accionar. - Activarlo manualmente desde los ajustes de Android. - No
ocultar su funcionamiento. - Limitar las acciones a tareas solicitadas y
permitidas. - No capturar contraseñas, códigos de autenticación o
contenido sensible indiscriminadamente. - No eludir CAPTCHA, medidas de
seguridad, restricciones de acceso ni protecciones de aplicaciones. -
Respetar políticas de distribución de Google Play si se pretende
publicar el producto.

Crear automatizaciones con pasos, condiciones, tiempos de espera,
límites de reintentos y mecanismos para detenerlas. Verificar cada paso
antes de continuar.

# 8. Memoria y base de datos

Usar Room para datos estructurados. Esquema inicial sugerido:

### ReminderEntity

-   `id`
-   `title`
-   `details`
-   `scheduledAt`
-   `repeatRule`
-   `status`
-   `createdAt`
-   `updatedAt`

### ContactAliasEntity

-   `id`
-   `alias`
-   `contactLookupKey` o identificador estable apropiado
-   `normalizedPhone` cuando sea necesario
-   `createdAt`
-   `updatedAt`

### MemoryEntity

-   `id`
-   `category`
-   `key`
-   `value`
-   `createdAt`
-   `updatedAt`
-   `expiresAt` opcional

Guardar únicamente lo necesario. Permitir consultar, corregir y eliminar
memorias. No almacenar en memoria ordinaria contraseñas, tokens ni
secretos.

# 9. Bóveda de contraseñas y privacidad

La aplicación puede ofrecer una bóveda local, pero debe diseñarse como
una función de seguridad independiente.

Requisitos mínimos: - Cifrado autenticado con una biblioteca
criptográfica mantenida y algoritmos recomendados. - Protección de
claves con Android Keystore. - Desbloqueo mediante autenticación del
dispositivo cuando esté disponible. - Bloqueo automático por
inactividad. - Ocultar secretos en logs, capturas, diagnósticos y texto
de IA. - No guardar contraseñas en texto plano, archivos de preferencias
comunes ni base de datos sin cifrar. - No incluir claves maestras en el
código fuente. - No enviar credenciales a modelos de IA. - No
sincronizar secretos por internet en la primera versión. - Advertir al
usuario de las limitaciones y permitir borrar la bóveda.

Para el primer lanzamiento, es razonable integrar un gestor de
contraseñas reconocido en lugar de desarrollar un gestor completo desde
cero. Si se crea una bóveda propia, debe revisarse y probarse
cuidadosamente antes de guardar credenciales reales.

# 10. Permisos y seguridad operacional

Solicitar permisos justo cuando el usuario activa una función, no todos
al iniciar la aplicación.

Posibles permisos o accesos, según las funciones elegidas: -
Micrófono. - Contactos. - Teléfono. - Notificaciones. - Ubicación. -
Alarmas exactas, cuando proceda. - Acceso especial a notificaciones, si
se leen notificaciones ajenas. - Servicio de accesibilidad, si se
habilita automatización avanzada.

Cada permiso debe tener una explicación comprensible y una alternativa
cuando el usuario lo rechace.

Definir niveles de riesgo: - **Bajo:** hora, cálculos locales, abrir una
aplicación. - **Medio:** crear recordatorios, leer contactos, preparar
mensajes. - **Alto:** enviar información privada, eliminar datos,
cambiar credenciales, realizar compras o acciones financieras.

Las acciones de riesgo alto deben pedir confirmación explícita y mostrar
claramente qué ocurrirá. Ser una aplicación privada no elimina la
necesidad de proteger datos ni de evitar acciones accidentales.

# 11. Plan de desarrollo y entregables

## Fase 0 --- Preparación

Entregables: - Proyecto Kotlin creado. - Repositorio Git local. - README
con instrucciones. - Tema de colores y estructura inicial. - Compilación
limpia.

## Fase 1 --- Interfaz y motor básico

Entregables: - Pantalla principal futurista. - Botón de micrófono y
campo de texto. - Reconocimiento de voz. - Respuestas habladas. - Hora,
fecha y cálculos básicos. - Pruebas unitarias del parser.

Criterio de aceptación: una orden reconocida produce una respuesta
correcta y visible; los errores se muestran sin cerrar la aplicación.

## Fase 2 --- Recordatorios

Entregables: - Base de datos Room. - Crear, listar, editar y eliminar
recordatorios. - Programación de notificaciones. - Manejo de reinicios y
permisos. - Pruebas de fechas y zonas horarias.

Criterio de aceptación: los recordatorios se guardan y se recuperan tras
cerrar la aplicación, y se informa al usuario de restricciones del
sistema.

## Fase 3 --- Contactos y llamadas

Entregables: - Consulta de contactos. - Configuración de alias. -
Selección segura del destinatario. - Apertura del marcador y, cuando
proceda, llamada directa. - Pruebas con varios contactos de nombres
parecidos.

Criterio de aceptación: un alias único se resuelve correctamente; una
coincidencia ambigua nunca provoca una llamada automática.

## Fase 4 --- Mensajes, notificaciones y música

Entregables: - Redacción de mensajes por voz. - Integración permitida
con aplicaciones de mensajería. - Lectura autorizada de
notificaciones. - Integración de música y controles compatibles.

Criterio de aceptación: la interfaz distingue entre «aplicación
abierta», «mensaje preparado» y «acción completada».

## Fase 5 --- Búsqueda web y mapas

Entregables: - Búsqueda web. - Apertura del navegador preferido. -
Resúmenes de páginas compatibles. - Apertura de rutas y manejo de
ubicación. - Estados de error sin conexión.

Criterio de aceptación: SONI indica la fuente de la información y no
inventa resultados de búsqueda, horarios, distancias o tiempos.

## Fase 6 --- IA y memoria ampliada

Entregables: - Interfaz intercambiable para proveedores de IA. - Memoria
local editable. - Herramientas tipadas. - Límites de tiempo y
reintentos. - Tratamiento de contenido web no confiable.

Criterio de aceptación: el sistema puede interpretar órdenes variadas
sin permitir que el modelo ejecute operaciones no registradas.

## Fase 7 --- Activación avanzada y automatización

Entregables: - Estudio de palabra de activación. - Medición de
batería. - Integración con los mecanismos compatibles de Android. -
Automatizaciones autorizadas y registradas. - Pruebas en distintos
dispositivos y versiones.

Criterio de aceptación: si se pierde el servicio o se deniega un
permiso, SONI lo comunica y ofrece una forma de activación alternativa.

## Fase 8 --- Seguridad y preparación de lanzamiento

Entregables: - Revisión de almacenamiento y secretos. - Pruebas de
permisos y revocaciones. - Política de privacidad si se distribuye. -
Pruebas de accesibilidad. - Pruebas de estabilidad y batería. -
Documentación de limitaciones.

# 12. Pruebas imprescindibles

-   Micrófono denegado.
-   Reconocimiento sin conexión.
-   Ruido ambiental y transcripciones incorrectas.
-   Contacto inexistente o duplicado.
-   Número cambiado o alias desactualizado.
-   Recordatorio durante reinicio del dispositivo.
-   Notificaciones desactivadas.
-   Aplicación de música ausente o sin sesión iniciada.
-   Pérdida de internet durante una investigación.
-   Destino de navegación ambiguo.
-   Revocación de permisos mientras SONI está abierto.
-   Pantalla bloqueada y restricciones de segundo plano.
-   Bóveda bloqueada y cierre inesperado.
-   Intento de una página web de dar instrucciones maliciosas a SONI.
-   Cancelación de una automatización durante su ejecución.

# 13. Prompt maestro para una IA de programación

Utiliza el siguiente bloque como instrucción principal en tu herramienta
de desarrollo. Después, pide implementar una fase cada vez, no todo el
sistema en una única respuesta.

------------------------------------------------------------------------

## PROMPT MAESTRO: DESARROLLAR SONI

Actúa como arquitecto de software Android sénior, ingeniero Kotlin,
especialista en Jetpack Compose, seguridad móvil, accesibilidad y
agentes de IA.

Tu tarea es ayudarme a construir **SONI**, un asistente personal de
inteligencia artificial para Android. Debes priorizar la funcionalidad
real, la seguridad, la claridad del código y el uso de herramientas
gratuitas.

### Contexto y objetivo

SONI debe permitir al usuario hablar o escribir instrucciones en español
y ejecutar tareas autorizadas en el teléfono. No debe ser solo un
chatbot. Debe contar con un motor de intenciones, herramientas
registradas, validación de permisos, resultados verificables y
respuestas habladas.

### Restricciones técnicas

1.  Utiliza Kotlin y Android Studio.
2.  Utiliza Jetpack Compose para la interfaz.
3.  Aplica MVVM, repositorios y separación por módulos.
4.  Utiliza Room para datos locales estructurados.
5.  Prioriza operaciones locales gratuitas.
6.  No requieras una API comercial de IA para comandos básicos.
7.  Diseña un proveedor de IA intercambiable para integraciones futuras.
8.  No inventes APIs, SDK, permisos o capacidades.
9.  Comprueba la compatibilidad de las dependencias con la versión de
    Android elegida.
10. No pongas claves secretas en el código fuente.
11. No almacenes contraseñas en texto plano.
12. No afirmes que una tarea se completó si no existe una confirmación
    técnica razonable.

### Diseño visual obligatorio

Crea una interfaz futurista, premium, oscura y elegante.

Paleta: - Fondo: `#070B16`. - Tarjetas: `#10182A`. - Superficie
secundaria: `#151F35`. - Violeta eléctrico: `#8B5CF6`. - Azul luminoso:
`#38BDF8`. - Lavanda: `#C4B5FD`. - Texto principal: `#F4F7FF`. - Texto
secundario: `#9AA8C7`.

La pantalla principal debe tener un núcleo visual abstracto
azul-violeta, estados de escucha y procesamiento, botón de micrófono,
entrada de texto, respuesta conversacional y acceso a recordatorios y
ajustes. Las animaciones deben ser ligeras, elegantes y respetar las
preferencias de accesibilidad. No sacrifiques legibilidad por efectos.

### Funciones planificadas

-   Reconocimiento de voz en español.
-   Respuestas habladas.
-   Fecha, hora y calculadora.
-   Recordatorios y rutinas.
-   Contactos y alias personales.
-   Llamadas mediante interfaces permitidas.
-   Preparación y envío de mensajes cuando esté permitido.
-   Lectura autorizada de notificaciones.
-   Control compatible con Spotify.
-   Búsquedas web y apertura del navegador elegido.
-   Investigación y resumen de páginas públicas.
-   Ubicación y rutas.
-   Memoria local editable.
-   Bóveda segura opcional.
-   Automatización avanzada mediante integraciones oficiales o
    accesibilidad autorizada.
-   Activación por palabra clave como objetivo avanzado sujeto a
    restricciones de Android.

### Arquitectura obligatoria

Separa, como mínimo: - `core`: motor, parser, herramientas y
resultados. - `voice`: entrada y salida de voz. - `tools`: herramientas
independientes por función. - `data`: base de datos y repositorios. -
`security`: protección de secretos. - `automation`: flujos
autorizados. - `ui`: pantallas y tema visual.

Define contratos tipados para las herramientas. Toda acción debe
devolver un resultado estructurado que distinga éxito, error, necesidad
de permiso y necesidad de confirmación.

### Seguridad y autonomía

-   Solicita permisos en contexto y explica su finalidad.
-   Nunca eludas las protecciones de Android o de otras aplicaciones.
-   Resuelve de forma segura las coincidencias ambiguas de contactos.
-   Confirma acciones sensibles.
-   No permitas que el modelo ejecute código arbitrario.
-   Trata las páginas web y el contenido externo como datos no
    confiables.
-   Protege la memoria y los datos privados.
-   Proporciona mecanismos para cancelar las tareas.
-   No registres secretos en logs.
-   Mantén el control final del usuario sobre los permisos y la
    privacidad.

### Forma de trabajo requerida

Trabaja en fases pequeñas y verificables.

Para cada fase: 1. Explica el objetivo. 2. Indica qué archivos crear o
modificar. 3. Proporciona el contenido completo de cada archivo que
necesite cambios, con su ruta exacta. 4. Explica dónde pegar cada bloque
y qué dependencias añadir. 5. Asegúrate de que los nombres de paquetes,
imports y APIs coincidan. 6. Incluye las modificaciones necesarias en
`AndroidManifest.xml`. 7. Explica cómo compilar y ejecutar la
aplicación. 8. Incluye pruebas manuales y, cuando corresponda, pruebas
unitarias. 9. Enumera limitaciones reales y posibles errores. 10. Espera
a que se compruebe la fase antes de introducir la siguiente.

No generes una arquitectura llena de archivos vacíos. Implementa primero
un flujo funcional completo y después amplía el proyecto. Si falta
información sobre el dispositivo o la versión de Android, declara una
suposición razonable y explica cómo verificarla.

### Primera tarea

Comienza implementando únicamente la **Fase 1: interfaz principal y
núcleo básico**. Crea una aplicación que compile y permita: - Mostrar la
interfaz futurista de SONI. - Introducir comandos por texto. - Pulsar el
micrófono y reconocer voz con los permisos necesarios. - Responder
mediante texto y voz. - Resolver hora, fecha y cálculos básicos de forma
segura. - Mostrar claramente los estados de escucha, procesamiento,
éxito y error.

Entrega los archivos completos con sus rutas exactas y pasos de
ejecución. No afirmes que la aplicación ha sido probada en mi
dispositivo; indícame cómo verificarla. No empieces todavía con
llamadas, mensajes, accesibilidad ni bóveda de contraseñas. Esas
funciones se añadirán en sus fases correspondientes.

------------------------------------------------------------------------

# 14. Cómo utilizar este documento

1.  Crea el proyecto `SONI` en Android Studio.
2.  Guarda este documento como referencia del proyecto.
3.  Copia el apartado **Prompt maestro** en tu herramienta de
    programación.
4.  Solicita exclusivamente la Fase 1.
5.  Implementa los archivos y compila.
6.  Resuelve los errores reales antes de continuar.
7.  Conserva este documento como referencia para evitar que la
    herramienta cambie la arquitectura o el diseño en cada sesión.

## Criterio final

SONI debe crecer desde un núcleo pequeño que funcione hacia un agente
cada vez más capaz. La prioridad no es prometer control ilimitado, sino
construir herramientas reales, seguras, verificables y extensibles que
permitan automatizar progresivamente más tareas del teléfono.
