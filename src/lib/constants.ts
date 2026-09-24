import { CONTACTO } from '@/content/data/contacto'
import { GLOBAL } from '@/content/data/global'

/**
 * Fuente única de verdad para identidad, rutas y datos de contacto.
 * Los textos y datos de empresa vienen de `src/content/data/*.json` (editables
 * desde el CMS); aquí solo queda lo que es código: rutas, límites y motion.
 */

export const SITE = {
  ...GLOBAL.site,
  locale: 'es_CO',
  lang: 'es',
  country: 'CO',
  /**
   * Base para canonical, Open Graph, sitemap y robots.
   *
   * Se define explícitamente con `NEXT_PUBLIC_SITE_URL` cuando haya dominio
   * propio. Si no está, Vercel expone la URL de producción del proyecto, así
   * que el despliegue queda correcto sin configuración manual.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'),
} as const

export const ROUTES = {
  home: '/',
  about: '/nosotros',
  services: '/servicios',
  sectors: '/sectores',
  projects: '/proyectos',
  contact: '/contacto',
  privacy: '/politica-de-privacidad',
  terms: '/terminos-y-condiciones',
  cookies: '/politica-de-cookies',
} as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]

/** Navegación principal. El orden aquí es el orden en header, menú móvil y footer. */
export const NAV_LINKS = [
  { label: GLOBAL.nav.links.about, href: ROUTES.about, cms: 'global:nav.links.about' },
  { label: GLOBAL.nav.links.services, href: ROUTES.services, cms: 'global:nav.links.services' },
  { label: GLOBAL.nav.links.sectors, href: ROUTES.sectors, cms: 'global:nav.links.sectors' },
  { label: GLOBAL.nav.links.projects, href: ROUTES.projects, cms: 'global:nav.links.projects' },
  { label: GLOBAL.nav.links.contact, href: ROUTES.contact, cms: 'global:nav.links.contact' },
] as const

export const HEADER_CTA = GLOBAL.nav.headerCta

/**
 * Rutas cuyo header arranca transparente, sobre la fotografía oscura del hero.
 * En el resto las páginas abren sobre crema y el header va sólido desde el
 * principio: transparente dejaría el menú blanco sobre fondo claro.
 */
export const TRANSPARENT_HEADER_ROUTES: readonly string[] = [ROUTES.home]

/** Enlaces legales del pie de página. */
export const LEGAL_LINKS = [
  { label: GLOBAL.nav.legalLinks.privacy, href: ROUTES.privacy, cms: 'global:nav.legalLinks.privacy' },
  { label: GLOBAL.nav.legalLinks.terms, href: ROUTES.terms, cms: 'global:nav.legalLinks.terms' },
  { label: GLOBAL.nav.legalLinks.cookies, href: ROUTES.cookies, cms: 'global:nav.legalLinks.cookies' },
] as const

/**
 * Barra de acciones fija al pie, solo en móvil.
 *
 * En una pantalla de teléfono el pulgar llega al borde inferior y no a la
 * esquina superior derecha, que es donde vivía el botón de menú. Las dos
 * acciones que importan —abrir el menú y contactar— bajan ahí.
 *
 * `call` solo aparece cuando `CONTACT.phone` tenga dato: un botón de llamar sin
 * número al que llamar es peor que no tenerlo.
 */
export const MOBILE_BAR = {
  label: 'Acciones rápidas',
  menu: {
    label: GLOBAL.ui.mobileBar.menu,
    open: GLOBAL.ui.mobileBar.openMenu,
    close: GLOBAL.ui.mobileBar.closeMenu,
  },
  call: { label: GLOBAL.ui.mobileBar.call },
  cta: { label: GLOBAL.ui.mobileBar.cta, href: ROUTES.contact },
} as const

/** Datos de contacto. Los vacíos se omiten en la UI en vez de mostrarse en blanco. */
export const CONTACT = GLOBAL.contact

export const SOCIAL = GLOBAL.social

/** Textos de interfaz compartidos (salto al contenido, pie, páginas de sistema). */
export const UI_TEXT = { ...GLOBAL.ui, footer: GLOBAL.footer }

/** Devuelve solo los canales de contacto que ya tienen dato cargado. */
export function getContactChannels() {
  return [
    {
      id: 'email',
      label: CONTACTO.panel.channelLabels.email,
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      id: 'phone',
      label: CONTACTO.panel.channelLabels.phone,
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, '')}`,
    },
    { id: 'address', label: CONTACTO.panel.channelLabels.address, value: CONTACT.address, href: null },
    { id: 'city', label: CONTACTO.panel.channelLabels.city, value: CONTACT.city, href: null },
  ].filter((channel) => channel.value.length > 0)
}

/** Límites del formulario de contacto, compartidos entre cliente y servidor. */
export const CONTACT_FORM = {
  minNameLength: 2,
  maxNameLength: 80,
  maxEmailLength: 120,
  minPhoneLength: 7,
  maxPhoneLength: 20,
  maxOrganizationLength: 120,
  minMessageLength: 20,
  maxMessageLength: 2000,
} as const

/** Asuntos disponibles en el formulario. El `value` es lo que viaja al servidor. */
export const CONTACT_SUBJECTS = CONTACTO.form.subjects

export const CONTACT_SUBJECT_VALUES = CONTACT_SUBJECTS.map((subject) => subject.value)

/** Estados del envío del formulario. */
export const FORM_STATUS = {
  idle: 'idle',
  submitting: 'submitting',
  success: 'success',
  error: 'error',
} as const

export type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS]

export const FORM_MESSAGES = {
  success: CONTACTO.form.messages.success,
  /* Solo remite al correo cuando hay uno publicado al que escribir. */
  error: CONTACT.email
    ? CONTACTO.form.messages.errorWithEmail.replace('{correo}', CONTACT.email)
    : CONTACTO.form.messages.error,
  rateLimited: CONTACTO.form.messages.rateLimited,
}

/**
 * Parámetros del sistema de movimiento. Las primitivas de `components/motion/`
 * son las únicas que los consumen; ninguna sección anima por su cuenta.
 *
 * Un único juego de curvas y duraciones para todo el sitio: es lo que hace que
 * secciones distintas se sientan parte del mismo objeto en vez de una colección
 * de efectos sueltos.
 */
export const MOTION = {
  /** Curva de entrada. Salida rápida al principio y asentamiento largo. */
  ease: [0.16, 1, 0.3, 1],
  /** Curva simétrica, para lo que va y vuelve (menús, crossfades). */
  easeInOut: [0.65, 0, 0.35, 1],

  duration: {
    /** Micro-interacciones: hover, press, cambios de estado. */
    fast: 0.2,
    /** Entradas estándar de bloque. */
    base: 0.65,
    /** Revelados de titular, que necesitan aire para leerse como intención. */
    slow: 0.9,
  },

  /**
   * Las salidas duran ~65 % de la entrada: una interfaz que se va despacio se
   * siente lenta, aunque entre rápido.
   */
  exitRatio: 0.65,

  /** Desplazamiento de entrada, en píxeles. */
  distance: 28,

  /** Retardo entre hermanos de una lista o retícula. */
  stagger: 0.07,
  /** Retardo entre líneas de un titular enmascarado. */
  staggerLines: 0.08,


  /** Duración del conteo de cifras, en milisegundos. */
  counterDuration: 1900,

  /**
   * Muelle del cursor y de los elementos que siguen al scroll. Amortiguado
   * alto y rigidez baja: acompaña sin rebotar, que en una marca de ingeniería
   * lee como imprecisión.
   */
  spring: { stiffness: 90, damping: 26, mass: 0.6 },

  /** Recorrido del parallax de una imagen, en porcentaje de su alto. */
  parallax: 12,
} as const
