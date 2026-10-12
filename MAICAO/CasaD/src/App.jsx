import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useInView,
  useReducedMotion,
} from 'framer-motion'

const FUENTES_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap'

const WHATSAPP_NUMERO = '573000000000'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}`

const ESTILOS = `
  html { scroll-behavior: auto; }
  .casa-d-app { font-family: 'Manrope', system-ui, sans-serif; }
  .casa-d-app .font-serif { font-family: 'Fraunces', Georgia, serif; }
  @keyframes cd-flotar { 0%, 100% { transform: translateY(0) rotateZ(0deg); } 50% { transform: translateY(-14px) rotateZ(1.5deg); } }
  .cd-flotar { animation: cd-flotar 7s ease-in-out infinite; }
  .cd-scroller { scrollbar-width: none; -ms-overflow-style: none; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; }
  .cd-scroller::-webkit-scrollbar { display: none; }
  .cd-snap { scroll-snap-align: center; }
  .cd-columnas { column-gap: 1.5rem; }
  .cd-columnas > * { break-inside: avoid; margin-bottom: 1.5rem; }
  .casa-d-app ::selection { background: #E8C177; color: #2B1B10; }
  .cd-cv { content-visibility: auto; contain-intrinsic-size: 1px 900px; }
  .cd-3d { transform-style: preserve-3d; }
  @media (prefers-reduced-motion: reduce) {
    .cd-flotar { animation: none !important; }
    html { scroll-behavior: auto !important; }
  }
`

const GALERIA = [
  {
    id: 1,
    titulo: 'Sombrero Guajira',
    categoria: 'Sombrero',
    descripcion: 'Ala tejida a mano con fibra natural y remate en hilos dorados.',
    img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=75',
    alto: 'h-80',
  },
  {
    id: 2,
    titulo: 'Manta Horizonte',
    categoria: 'Manta',
    descripcion: 'Franjas cálidas inspiradas en el atardecer sobre el desierto guajiro.',
    img: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=75',
    alto: 'h-96',
  },
  {
    id: 3,
    titulo: 'Cuadro Kanas',
    categoria: 'Cuadro artesanal',
    descripcion: 'Patrón geométrico tradicional enmarcado para decorar cualquier espacio.',
    img: 'https://images.unsplash.com/photo-1509909756405-be0199881695?auto=format&fit=crop&w=900&q=75',
    alto: 'h-72',
  },
  {
    id: 4,
    titulo: 'Chinchorro Maicao',
    categoria: 'Chinchorro',
    descripcion: 'Tejido amplio en algodón, pensado para el descanso en familia.',
    img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=75',
    alto: 'h-96',
  },
  {
    id: 5,
    titulo: 'Set Pulseras Wayuu',
    categoria: 'Accesorio',
    descripcion: 'Hilos trenzados en tonos crema, bronce y oro para combinar entre sí.',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=75',
    alto: 'h-64',
  },
  {
    id: 6,
    titulo: 'Sombrero Dorado',
    categoria: 'Sombrero',
    descripcion: 'Edición limitada con cinta bordada y detalles en hilo metalizado.',
    img: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=900&q=75',
    alto: 'h-72',
  },
  {
    id: 7,
    titulo: 'Faja Ancestral',
    categoria: 'Faja',
    descripcion: 'Cinturón tejido con los símbolos que representan camino y protección.',
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=75',
    alto: 'h-64',
  },
  {
    id: 8,
    titulo: 'Manta Ceremonial',
    categoria: 'Manta',
    descripcion: 'Pieza gruesa tejida para ocasiones especiales, con flecos trenzados.',
    img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=75',
    alto: 'h-96',
  },
  {
    id: 9,
    titulo: 'Cuadro Sol y Camino',
    categoria: 'Cuadro artesanal',
    descripcion: 'Arte mural tejido a telar, ideal como pieza central de un espacio.',
    img: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?auto=format&fit=crop&w=900&q=75',
    alto: 'h-96',
  },
]

const CATEGORIAS = ['Todo', 'Sombrero', 'Manta', 'Cuadro artesanal', 'Chinchorro', 'Accesorio', 'Faja']

const CATALOGO = [
  {
    numero: '01',
    titulo: 'Kanas Solar',
    tecnica: 'Cuadro artesanal · telar vertical',
    img: 'https://images.unsplash.com/photo-1509909756405-be0199881695?auto=format&fit=crop&w=900&q=75',
  },
  {
    numero: '02',
    titulo: 'Iishoshi Dorado',
    tecnica: 'Manta ceremonial · algodón crudo',
    img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=75',
  },
  {
    numero: '03',
    titulo: 'Wale Kerü',
    tecnica: 'Sombrero edición limitada',
    img: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=900&q=75',
  },
  {
    numero: '04',
    titulo: 'Camino y Protección',
    tecnica: 'Faja tejida · símbolos ancestrales',
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=75',
  },
  {
    numero: '05',
    titulo: 'Atardecer Guajiro',
    tecnica: 'Manta horizonte · franjas cálidas',
    img: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=75',
  },
]

const HISTORIA = [
  {
    numero: '01',
    titulo: 'Cuatro generaciones de manos',
    texto: 'Cada pieza Casa D nace en los telares de familias Wayuu de La Guajira, donde el oficio se hereda de abuela a nieta.',
    img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1100&q=75',
  },
  {
    numero: '02',
    titulo: 'El hilo se vuelve símbolo',
    texto: 'Cada patrón geométrico representa un elemento del territorio: el sol, el camino, la lluvia. Nada es decorativo, todo se lee.',
    img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1100&q=75',
  },
  {
    numero: '03',
    titulo: 'Semanas, no minutos',
    texto: 'Un sombrero, una manta o un cuadro pueden tomar semanas de tejido continuo. Preferimos la lentitud que le da valor real a la pieza.',
    img: 'https://images.unsplash.com/photo-1610030469668-8e9f5c1eaf34?auto=format&fit=crop&w=1100&q=75',
  },
  {
    numero: '04',
    titulo: 'De Maicao para tu historia',
    texto: 'Cuando la pieza llega a tus manos, ya trae un recorrido: el desierto, la sombra de una enramada y muchas horas de conversación.',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=75',
  },
]

const STATS = [
  { valor: 4, sufijo: '+', etiqueta: 'Años creando' },
  { valor: 55, sufijo: '', etiqueta: 'Piezas únicas' },
  { valor: 100, sufijo: '%', etiqueta: 'Hecho a mano' },
  { valor: 12, sufijo: '', etiqueta: 'Familias artesanas' },
]

const VALORES = [
  {
    marca: '✦',
    titulo: 'Tradición renovada',
    texto: 'Cada pieza cuenta una historia Wayuu con una mirada actual, sin perder su origen.',
  },
  {
    marca: '✿',
    titulo: 'Aura femenina',
    texto: 'Líneas suaves, dorados delicados y blanco brillante pensados para acompañarte todos los días.',
  },
  {
    marca: '⚬',
    titulo: 'Experiencia cercana',
    texto: 'Atención directa por WhatsApp, envíos rastreados y piezas fotografiadas antes de salir de Maicao.',
  },
]

const TESTIMONIO = {
  texto:
    'Mi sombrero llegó envuelto con tanto cuidado que sentí que me contaban su historia antes de abrirlo. Es la pieza que más elogios recibe.',
  autor: 'Valeria M.',
  rol: 'Cliente en Valledupar',
}

const NAV_LINKS = [
  { href: '#historia', etiqueta: 'Historia' },
  { href: '#catalogo', etiqueta: 'Catálogo' },
  { href: '#galeria', etiqueta: 'Galería' },
  { href: '#valores', etiqueta: 'Valores' },
  { href: '#contacto', etiqueta: 'Contacto' },
]

function facilitarSalidaExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function desplazarSuave(destinoY, duracion = 700) {
  const inicioY = window.scrollY
  const distancia = destinoY - inicioY
  const inicioTiempo = performance.now()

  function cuadro(ahora) {
    const transcurrido = ahora - inicioTiempo
    const progreso = Math.min(transcurrido / duracion, 1)
    window.scrollTo(0, inicioY + distancia * facilitarSalidaExpo(progreso))
    if (progreso < 1) requestAnimationFrame(cuadro)
  }
  requestAnimationFrame(cuadro)
}

function useNavegacionRapida() {
  useEffect(() => {
    function alHacerClic(evento) {
      const enlace = evento.target.closest('a[href^="#"]')
      if (!enlace) return
      const destino = enlace.getAttribute('href')
      if (!destino || destino.length < 2) return
      const elemento = document.querySelector(destino)
      if (!elemento) return
      evento.preventDefault()
      const topeSuperior = elemento.getBoundingClientRect().top + window.scrollY - 84
      desplazarSuave(Math.max(topeSuperior, 0), 650)
      window.history.pushState(null, '', destino)
    }
    document.addEventListener('click', alHacerClic)
    return () => document.removeEventListener('click', alHacerClic)
  }, [])
}

function Contador({ hasta, sufijo = '', duracion = 1.4 }) {
  const ref = useRef(null)
  const enVista = useInView(ref, { once: true, margin: '-100px' })
  const [valor, setValor] = useState(0)
  const reduceMovimiento = useReducedMotion()

  useEffect(() => {
    if (!enVista) return
    if (reduceMovimiento) {
      setValor(hasta)
      return
    }
    let inicio = null
    let cuadro
    const paso = (marca) => {
      if (inicio === null) inicio = marca
      const progreso = Math.min((marca - inicio) / (duracion * 1000), 1)
      const facilitado = 1 - Math.pow(1 - progreso, 3)
      setValor(Math.floor(facilitado * hasta))
      if (progreso < 1) cuadro = requestAnimationFrame(paso)
    }
    cuadro = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(cuadro)
  }, [enVista, hasta, duracion, reduceMovimiento])

  return (
    <span ref={ref}>
      {valor}
      {sufijo}
    </span>
  )
}

function AnilloProgreso() {
  const { scrollYProgress } = useScroll()
  const progreso = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.25 })
  const circunferencia = 2 * Math.PI * 26
  const desfase = useTransform(progreso, (v) => circunferencia * (1 - v))

  return (
    <div className="fixed bottom-6 right-6 z-[60] hidden h-16 w-16 items-center justify-center sm:flex">
      <svg viewBox="0 0 60 60" className="absolute h-16 w-16 -rotate-90">
        <circle cx="30" cy="30" r="26" fill="none" stroke="#3B2412" strokeOpacity="0.15" strokeWidth="1.5" />
        <motion.circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="#C4933F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          style={{ strokeDashoffset: desfase }}
        />
      </svg>
      <span className="font-serif text-[11px] tracking-[0.15em] text-[#3B2412]">CD</span>
    </div>
  )
}

function BrilloCursor() {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const xSuave = useSpring(x, { stiffness: 220, damping: 22, mass: 0.3 })
  const ySuave = useSpring(y, { stiffness: 220, damping: 22, mass: 0.3 })
  const reduceMovimiento = useReducedMotion()

  useEffect(() => {
    if (reduceMovimiento) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const mover = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', mover)
    return () => window.removeEventListener('pointermove', mover)
  }, [x, y, reduceMovimiento])

  if (reduceMovimiento) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45] hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(232,193,119,0.16),transparent_70%)] sm:block"
      style={{ x: xSuave, y: ySuave, translateX: '-50%', translateY: '-50%' }}
    />
  )
}

function BotonMagnetico({ href, children, className, target, rel, onClick }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xSuave = useSpring(x, { stiffness: 320, damping: 18, mass: 0.35 })
  const ySuave = useSpring(y, { stiffness: 320, damping: 18, mass: 0.35 })
  const reduceMovimiento = useReducedMotion()

  function mover(evento) {
    if (reduceMovimiento || !ref.current) return
    const caja = ref.current.getBoundingClientRect()
    x.set((evento.clientX - caja.left - caja.width / 2) * 0.28)
    y.set((evento.clientY - caja.top - caja.height / 2) * 0.35)
  }
  function salir() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={mover}
      onMouseLeave={salir}
      whileTap={{ scale: 0.94 }}
      style={{ x: xSuave, y: ySuave }}
      className={className}
    >
      {children}
    </motion.a>
  )
}

function MenuMovil({ abierto, cerrar }) {
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 bg-[#1C1108]/70 backdrop-blur-sm md:hidden"
          onClick={cerrar}
        >
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-b-[32px] bg-[#FBF3E4] px-8 pb-10 pt-28 shadow-2xl"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((enlace, i) => (
                <motion.a
                  key={enlace.href}
                  href={enlace.href}
                  onClick={cerrar}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  className="border-b border-[#3B2412]/10 py-4 font-serif text-2xl text-[#2B1B10]"
                >
                  {enlace.etiqueta}
                </motion.a>
              ))}
            </nav>
            <BotonMagnetico
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#3B2412] px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#FBF3E4]"
            >
              Escríbenos por WhatsApp
            </BotonMagnetico>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Navegacion() {
  const [conFondo, setConFondo] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setConFondo(v > 40))

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          conFondo
            ? 'bg-[#FBF3E4]/95 shadow-[0_10px_40px_rgba(59,36,18,0.08)] sm:backdrop-blur-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
          <a href="#inicio" className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border font-serif text-sm tracking-wide transition-colors duration-300 ${
                conFondo ? 'border-[#A9752F]/50 text-[#2B1B10]' : 'border-[#D9AE68]/50 text-[#FBF3E4]'
              }`}
            >
              CD
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className={`font-serif text-base tracking-[0.05em] transition-colors duration-300 ${conFondo ? 'text-[#2B1B10]' : 'text-[#FBF3E4]'}`}>
                Casa D
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8925A]">Maicao · Guajira</span>
            </span>
          </a>

          <nav className={`hidden items-center gap-8 text-sm transition-colors duration-300 md:flex ${conFondo ? 'text-[#5B4630]' : 'text-[#E7DCC8]'}`}>
            {NAV_LINKS.map((enlace) => (
              <a key={enlace.href} href={enlace.href} className="relative py-1 transition-colors duration-200 hover:text-[#A9752F]">
                {enlace.etiqueta}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <BotonMagnetico
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-[#E8C177] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#241505] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(232,193,119,0.4)] sm:inline-flex"
            >
              Escríbenos
            </BotonMagnetico>
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border transition-colors duration-300 md:hidden ${
                conFondo ? 'border-[#3B2412]/30' : 'border-[#D9AE68]/50'
              }`}
            >
              <span className={`h-[1.5px] w-4 ${conFondo ? 'bg-[#2B1B10]' : 'bg-[#FBF3E4]'}`} />
              <span className={`h-[1.5px] w-4 ${conFondo ? 'bg-[#2B1B10]' : 'bg-[#FBF3E4]'}`} />
            </button>
          </div>
        </div>
      </header>
      <MenuMovil abierto={menuAbierto} cerrar={() => setMenuAbierto(false)} />
    </>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yRapido = useSpring(useTransform(scrollYProgress, [0, 1], [0, 160]), { stiffness: 260, damping: 34 })
  const yLento = useSpring(useTransform(scrollYProgress, [0, 1], [0, 60]), { stiffness: 260, damping: 34 })
  const opacidad = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const rotXSuave = useSpring(rotX, { stiffness: 200, damping: 20 })
  const rotYSuave = useSpring(rotY, { stiffness: 200, damping: 20 })
  const reduceMovimiento = useReducedMotion()

  function inclinar(evento) {
    if (reduceMovimiento) return
    const caja = evento.currentTarget.getBoundingClientRect()
    const px = (evento.clientX - caja.left) / caja.width - 0.5
    const py = (evento.clientY - caja.top) / caja.height - 0.5
    rotX.set(py * -14)
    rotY.set(px * 14)
  }
  function restablecer() {
    rotX.set(0)
    rotY.set(0)
  }

  return (
    <section id="inicio" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#1C1108]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '26px 26px' }}
      />
      <motion.div
        style={{ y: yRapido }}
        className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(217,174,104,0.35),transparent_65%)] blur-2xl will-change-transform sm:h-[520px] sm:w-[520px] sm:blur-3xl"
      />
      <motion.div
        style={{ y: yLento }}
        className="pointer-events-none absolute -left-40 bottom-0 hidden h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(169,117,47,0.25),transparent_65%)] blur-3xl will-change-transform sm:block"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 px-6 pt-28 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-16">
        <motion.div
          style={{ opacity: opacidad }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-3 rounded-full border border-[#D9AE68]/30 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#E8C177]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8C177]" />
            Edición Maicao · Colección 2026
          </span>

          <h1 className="mt-8 font-serif text-6xl leading-[0.95] tracking-tight text-[#FBF3E4] sm:text-7xl lg:text-8xl">
            Tejido que
            <br />
            <span className="bg-gradient-to-r from-[#E8C177] via-[#D9AE68] to-[#A9752F] bg-clip-text italic text-transparent">
              se vuelve oro
            </span>
          </h1>

          <p className="mt-8 max-w-md text-base leading-8 text-[#CBB89A] sm:text-lg">
            Casa D transforma la tradición Wayuu de La Guajira en piezas atemporales: sombreros, mantas, cuadros y
            accesorios que cruzan cuatro generaciones de manos antes de llegar a las tuyas.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <BotonMagnetico
              href="#catalogo"
              className="group inline-flex items-center gap-3 rounded-full bg-[#E8C177] px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#241505] transition-shadow duration-200 hover:shadow-[0_20px_45px_rgba(232,193,119,0.35)]"
            >
              Ver el catálogo
              <span className="transition group-hover:translate-x-1">→</span>
            </BotonMagnetico>
            <a
              href="#historia"
              className="text-sm uppercase tracking-[0.15em] text-[#E7DCC8] underline decoration-[#A9752F] underline-offset-8 transition-colors duration-200 hover:text-[#E8C177]"
            >
              Conoce la historia
            </a>
          </div>
        </motion.div>

        <motion.div
          style={{ scale: escala, perspective: 900 }}
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          onMouseMove={inclinar}
          onMouseLeave={restablecer}
          className="relative mx-auto aspect-square w-full max-w-md cd-3d"
        >
          <motion.div style={{ rotateX: rotXSuave, rotateY: rotYSuave }} className="relative h-full w-full cd-3d">
            <div className="absolute inset-0 rounded-full border border-[#D9AE68]/25" />
            <div className="absolute inset-6 rounded-full border border-[#D9AE68]/15" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-10 rounded-full border border-dashed border-[#D9AE68]/30"
            />
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(40px)' }}>
              <img
                src="https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=78"
                alt="Manta tejida a mano Casa D"
                loading="eager"
                decoding="async"
                className="cd-flotar h-[78%] w-[78%] rounded-full object-cover shadow-[0_40px_90px_rgba(0,0,0,0.5)]"
              />
            </div>
            <span
              style={{ transform: 'translateX(-50%) translateZ(60px)' }}
              className="absolute -top-2 left-1/2 rounded-full bg-[#FBF3E4] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3B2412] shadow-lg"
            >
              100% hecho a mano
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[#D9AE68]"
      >
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="10" r="2.5" fill="currentColor" />
        </svg>
      </motion.div>
    </section>
  )
}

function PasoImagen({ paso, indice, total, progreso }) {
  const inicio = indice / total
  const fin = (indice + 1) / total
  const opacidad = useTransform(progreso, [inicio, inicio + 0.06, fin - 0.06, fin], [0, 1, 1, 0])
  const y = useTransform(progreso, [inicio, fin], [40, -40])

  return (
    <motion.div style={{ opacity: opacidad, y }} className="absolute inset-0">
      <img
        src={paso.img}
        alt={paso.titulo}
        loading="lazy"
        decoding="async"
        className="h-full w-full rounded-[32px] object-cover shadow-[0_35px_70px_rgba(59,36,18,0.18)] will-change-transform"
      />
    </motion.div>
  )
}

function PasoTexto({ paso, indice, total, progreso }) {
  const inicio = indice / total
  const fin = (indice + 1) / total
  const opacidad = useTransform(progreso, [inicio, inicio + 0.06, fin - 0.06, fin], [0, 1, 1, 0])
  const x = useTransform(progreso, [inicio, fin], [30, -30])

  return (
    <motion.div style={{ opacity: opacidad, x }} className="absolute inset-0 flex flex-col justify-center">
      <span className="font-serif text-6xl text-[#E8C177]">{paso.numero}</span>
      <h3 className="mt-4 font-serif text-3xl text-[#2B1B10] sm:text-4xl">{paso.titulo}</h3>
      <p className="mt-4 max-w-md text-base leading-7 text-[#6B5638]">{paso.texto}</p>
    </motion.div>
  )
}

function Historia() {
  const ref = useRef(null)
  const total = HISTORIA.length
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section id="historia" ref={ref} className="relative bg-[#FBF3E4]" style={{ height: `${total * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
          <div className="relative h-[320px] sm:h-[420px]">
            {HISTORIA.map((paso, i) => (
              <PasoImagen key={paso.numero} paso={paso} indice={i} total={total} progreso={scrollYProgress} />
            ))}
          </div>
          <div className="relative h-[280px] sm:h-[360px]">
            {HISTORIA.map((paso, i) => (
              <PasoTexto key={paso.numero} paso={paso} indice={i} total={total} progreso={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TarjetaCoverflow({ pieza, indice, total, progreso, ancho, esCatalogo }) {
  const centro = total > 1 ? indice / (total - 1) : 0
  const rango = 1 / Math.max(total - 1, 1)
  const distancia = useTransform(progreso, (p) => Math.min(Math.abs(p - centro) / rango, 1.3))
  const escala = useTransform(distancia, [0, 1, 1.3], [1, 0.86, 0.8])
  const rotY = useTransform(progreso, (p) => Math.max(Math.min((p - centro) / rango, 1.3), -1.3) * -22)
  const opacidad = useTransform(distancia, [0, 1.3], [1, 0.45])
  const elevacion = useTransform(distancia, [0, 1], [0, 18])

  return (
    <motion.div
      style={{ scale: escala, rotateY: rotY, opacity: opacidad, y: elevacion, width: ancho }}
      className="cd-snap cd-3d relative shrink-0"
    >
      <div
        className={`group relative overflow-hidden rounded-[26px] border ${
          esCatalogo ? 'border-[#D9AE68]/20' : 'border-[#D9AE68]/15'
        }`}
      >
        <img
          src={pieza.img}
          alt={pieza.titulo}
          loading="lazy"
          decoding="async"
          className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1108] via-transparent to-transparent" />
        {esCatalogo ? (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="font-serif text-4xl text-[#E8C177]/80">{pieza.numero}</span>
            <h3 className="mt-1 font-serif text-2xl text-[#FBF3E4]">{pieza.titulo}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#D9AE68]">{pieza.tecnica}</p>
          </div>
        ) : (
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D9AE68]">{pieza.categoria}</p>
            <h3 className="mt-2 font-serif text-2xl text-[#FBF3E4]">{pieza.titulo}</h3>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CarruselCoverflow({ items, esCatalogo }) {
  const contenedorRef = useRef(null)
  const { scrollXProgress } = useScroll({ container: contenedorRef })
  const [ancho, setAncho] = useState(320)
  const total = items.length

  useEffect(() => {
    function medir() {
      setAncho(window.innerWidth < 640 ? 240 : 320)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  function desplazar(direccion) {
    const el = contenedorRef.current
    if (!el) return
    el.scrollBy({ left: direccion * (ancho + 32), behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={contenedorRef}
        className="cd-scroller flex gap-8 overflow-x-auto px-[12vw] py-10 sm:px-[28vw]"
        style={{ perspective: 1400 }}
      >
        {items.map((pieza, i) => (
          <TarjetaCoverflow
            key={pieza.id ?? pieza.numero}
            pieza={pieza}
            indice={i}
            total={total}
            progreso={scrollXProgress}
            ancho={ancho}
            esCatalogo={esCatalogo}
          />
        ))}
      </div>

      <div className="mx-auto mt-2 flex max-w-7xl items-center justify-between px-6 sm:px-10">
        <div className="h-[2px] w-32 overflow-hidden rounded-full bg-[#3B2412]/15 sm:w-48">
          <motion.div style={{ scaleX: scrollXProgress, originX: 0 }} className="h-full w-full bg-[#E8C177]" />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => desplazar(-1)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3B2412]/15 text-[#3B2412] transition duration-200 hover:-translate-x-0.5 hover:border-[#A9752F] hover:text-[#A9752F]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => desplazar(1)}
            aria-label="Siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3B2412]/15 text-[#3B2412] transition duration-200 hover:translate-x-0.5 hover:border-[#A9752F] hover:text-[#A9752F]"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

function Catalogo() {
  return (
    <section id="catalogo" className="cd-cv bg-[#2B1B10] py-24">
      <div className="mx-auto mb-4 max-w-7xl px-6 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D9AE68]">Catálogo</p>
        <h2 className="mt-3 max-w-lg font-serif text-4xl text-[#FBF3E4] sm:text-5xl">Cinco piezas, cinco historias</h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-[#CBB89A]">
          Una selección breve y curada, pensada para mirarse de cerca. Desliza o usa las flechas para recorrerla.
        </p>
      </div>
      <CarruselCoverflow items={CATALOGO} esCatalogo />
    </section>
  )
}

function GaleriaHorizontal() {
  return (
    <section className="cd-cv bg-[#1C1108] py-24">
      <div className="mx-auto mb-4 max-w-7xl px-6 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D9AE68]">Piezas destacadas</p>
        <h2 className="mt-3 font-serif text-4xl text-[#FBF3E4] sm:text-5xl">Un desfile de texturas doradas</h2>
      </div>
      <CarruselCoverflow items={GALERIA.slice(0, 7)} esCatalogo={false} />
    </section>
  )
}

function TarjetaGaleria({ pieza, indice }) {
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const rotXSuave = useSpring(rotX, { stiffness: 260, damping: 22, mass: 0.4 })
  const rotYSuave = useSpring(rotY, { stiffness: 260, damping: 22, mass: 0.4 })

  function mover(evento) {
    const caja = evento.currentTarget.getBoundingClientRect()
    const px = (evento.clientX - caja.left) / caja.width - 0.5
    const py = (evento.clientY - caja.top) / caja.height - 0.5
    rotX.set(py * -10)
    rotY.set(px * 10)
  }
  function salir() {
    rotX.set(0)
    rotY.set(0)
  }

  return (
    <motion.article
      layout
      onMouseMove={mover}
      onMouseLeave={salir}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (indice % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
      className={`group relative overflow-hidden rounded-[28px] border border-[#3B2412]/10 bg-white shadow-[0_20px_45px_rgba(59,36,18,0.1)] ${pieza.alto}`}
    >
      <motion.div
        style={{ rotateX: rotXSuave, rotateY: rotYSuave }}
        className="relative h-full w-full cd-3d will-change-transform"
      >
        <img
          src={pieza.img}
          alt={pieza.titulo}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B10]/85 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-6 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#E8C177]">{pieza.categoria}</p>
          <h3 className="mt-1 font-serif text-xl text-[#FBF3E4]">{pieza.titulo}</h3>
          <p className="mt-1 text-sm leading-6 text-[#E7DCC8]">{pieza.descripcion}</p>
        </div>
      </motion.div>
    </motion.article>
  )
}

function Galeria() {
  const [categoria, setCategoria] = useState('Todo')
  const piezas = categoria === 'Todo' ? GALERIA : GALERIA.filter((p) => p.categoria === categoria)

  return (
    <section id="galeria" className="cd-cv bg-[#FBF3E4] px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A9752F]">Galería completa</p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl text-[#2B1B10] sm:text-5xl">
              Cada pieza, un relato tejido a mano
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#6B5638]">
            Imágenes de referencia de nuestras líneas de trabajo. Muy pronto podrás explorar el catálogo completo y
            hacer tu pedido directo por WhatsApp.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition duration-200 ${
                categoria === c
                  ? 'border-[#3B2412] bg-[#3B2412] text-[#FBF3E4]'
                  : 'border-[#3B2412]/20 text-[#6B5638] hover:border-[#A9752F] hover:text-[#A9752F]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="cd-columnas mt-10 columns-1 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {piezas.map((pieza, i) => (
              <TarjetaGaleria key={pieza.id} pieza={pieza} indice={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function Estadisticas() {
  return (
    <section className="bg-[#1C1108] px-6 py-24 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.etiqueta} className="text-center">
            <p className="font-serif text-5xl text-[#E8C177] sm:text-6xl">
              <Contador hasta={s.valor} sufijo={s.sufijo} />
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#CBB89A]">{s.etiqueta}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Autenticidad() {
  return (
    <section className="bg-[#1C1108] px-6 pb-24 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#D9AE68]/40 will-change-transform"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8C177] text-center font-serif text-[10px] uppercase tracking-widest text-[#241505]">
            Auténtico
          </span>
        </motion.div>
        <p className="max-w-lg text-sm leading-7 text-[#CBB89A]">
          Cada pieza Casa D incluye un sello de autenticidad y la firma de la artesana que la tejió: tu forma de saber
          que lo que llevas tiene nombre, origen y una historia real detrás.
        </p>
      </div>
    </section>
  )
}

function Valores() {
  return (
    <section id="valores" className="cd-cv bg-[#F3E4C8] px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#A9752F]">Por qué Casa D</p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl text-[#2B1B10] sm:text-5xl">
          Diseño emocional con raíz ancestral
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {VALORES.map((v, i) => (
            <motion.div
              key={v.titulo}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-[28px] border border-[#3B2412]/10 bg-[#FBF3E4] p-8 transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(59,36,18,0.12)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B2412] text-lg text-[#E8C177]">
                {v.marca}
              </span>
              <h3 className="mt-6 font-serif text-2xl text-[#2B1B10]">{v.titulo}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B5638]">{v.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonio() {
  return (
    <section className="relative overflow-hidden bg-[#2B1B10] px-6 py-28 text-center sm:px-10">
      <span className="font-serif text-8xl text-[#E8C177]/20">&ldquo;</span>
      <motion.blockquote
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto -mt-10 max-w-3xl font-serif text-2xl italic leading-relaxed text-[#FBF3E4] sm:text-3xl"
      >
        &ldquo;{TESTIMONIO.texto}&rdquo;
      </motion.blockquote>
      <p className="mt-8 text-sm uppercase tracking-[0.25em] text-[#D9AE68]">
        {TESTIMONIO.autor} · {TESTIMONIO.rol}
      </p>
    </section>
  )
}

function CTA() {
  return (
    <section id="contacto" className="cd-cv bg-[#FBF3E4] px-6 py-28 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 rounded-[40px] border border-[#3B2412]/10 bg-gradient-to-br from-[#F3E4C8] to-[#FBF3E4] p-12 text-center shadow-[0_35px_80px_rgba(59,36,18,0.12)] sm:p-16">
        <p className="text-xs uppercase tracking-[0.3em] text-[#A9752F]">Haz tu pedido</p>
        <h2 className="max-w-xl font-serif text-4xl text-[#2B1B10] sm:text-5xl">
          Escríbenos y elige la pieza que va a acompañarte
        </h2>
        <p className="max-w-md text-sm leading-7 text-[#6B5638]">
          Respondemos por WhatsApp con disponibilidad, precios y envíos desde Maicao a toda Colombia.
        </p>
        <BotonMagnetico
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-full bg-[#3B2412] px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#FBF3E4] transition-shadow duration-200 hover:shadow-[0_20px_45px_rgba(59,36,18,0.35)]"
        >
          Hablar por WhatsApp →
        </BotonMagnetico>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#1C1108] px-6 py-14 text-[#CBB89A] sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9AE68]/40 font-serif text-sm text-[#E8C177]">
            CD
          </span>
          <div>
            <p className="font-serif text-lg text-[#FBF3E4]">Casa D</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8B6529]">Artesanías Wayuu · Maicao</p>
          </div>
        </div>
        <p className="text-xs text-[#8B7355]">
          © {new Date().getFullYear()} Casa D. Tejido con orgullo en La Guajira, Colombia.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  useNavegacionRapida()

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FUENTES_URL
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="casa-d-app relative bg-[#FBF3E4] text-[#2B1B10]">
      <style>{ESTILOS}</style>
      <BrilloCursor />
      <AnilloProgreso />
      <Navegacion />
      <Hero />
      <Historia />
      <Catalogo />
      <GaleriaHorizontal />
      <Galeria />
      <Estadisticas />
      <Autenticidad />
      <Valores />
      <Testimonio />
      <CTA />
      <Footer />
    </div>
  )
}