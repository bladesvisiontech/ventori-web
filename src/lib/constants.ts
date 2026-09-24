/**
 * Fuente única de verdad para identidad, rutas y datos de contacto.
 * Ningún valor de negocio debe escribirse directamente en un componente.
 */

export const SITE = {
  /** Nombre de marca tal como aparece en el logotipo oficial. */
  name: 'Grupo Ventori',
  legalName: 'Grupo Ventori S.A.S.',
  /** PENDIENTE DEL CLIENTE. La política de privacidad lo muestra solo cuando tenga dato. */
  nit: '',
  tagline: 'Ingeniería, consultoría e interventoría',
  description:
    'Empresa colombiana especializada en ingeniería, consultoría e interventoría, enfocada en soluciones técnicas integrales para proyectos de infraestructura pública y privada.',
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
  { label: 'Nosotros', href: ROUTES.about },
  { label: 'Servicios', href: ROUTES.services },
  { label: 'Sectores', href: ROUTES.sectors },
  { label: 'Proyectos', href: ROUTES.projects },
  { label: 'Contacto', href: ROUTES.contact },
] as const

/**
 * Rutas cuyo header arranca transparente, sobre la fotografía oscura del hero.
 * En el resto las páginas abren sobre crema y el header va sólido desde el
 * principio: transparente dejaría el menú blanco sobre fondo claro.
 */
export const TRANSPARENT_HEADER_ROUTES: readonly string[] = [ROUTES.home]

/** Enlaces legales del pie de página. */
export const LEGAL_LINKS = [
  { label: 'Política de privacidad', href: ROUTES.privacy },
  { label: 'Términos y condiciones', href: ROUTES.terms },
  { label: 'Política de cookies', href: ROUTES.cookies },
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
  menu: { label: 'Menú', open: 'Abrir menú', close: 'Cerrar menú' },
  call: { label: 'Llamar' },
  cta: { label: 'Contacto', href: ROUTES.contact },
} as const

/**
 * Datos de contacto.
 *
 * PENDIENTE DEL CLIENTE: correo, teléfono, dirección y ciudad llegaron en blanco
 * en el brief. Mientras estén vacíos, la UI omite la fila correspondiente en vez
 * de mostrar un campo vacío — ver `getContactChannels()`.
 */
export const CONTACT = {
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  city: '',
  schedule: {
    days: 'Lunes a viernes',
    hours: '7:30 a.m. – 5:30 p.m.',
  },
} as const

export const SOCIAL = {
  linkedin: '',
} as const

/** Devuelve solo los canales de contacto que ya tienen dato cargado. */
export function getContactChannels() {
  return [
    {
      id: 'email',
      label: 'Correo electrónico',
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      id: 'phone',
      label: 'Teléfono',
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, '')}`,
    },
    { id: 'address', label: 'Dirección', value: CONTACT.address, href: null },
    { id: 'city', label: 'Ciudad', value: CONTACT.city, href: null },
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
export const CONTACT_SUBJECTS = [
  { value: 'interventoria', label: 'Interventoría' },
  { value: 'consultoria', label: 'Consultoría en ingeniería' },
  { value: 'gerencia', label: 'Gerencia de proyectos' },
  { value: 'estudios', label: 'Estudios y diseños' },
  { value: 'otro', label: 'Otro' },
] as const

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
  success: 'Gracias por escribirnos. Un miembro del equipo se pondrá en contacto contigo.',
  /* Solo remite al correo cuando hay uno publicado al que escribir. */
  error: CONTACT.email
    ? `No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos a ${CONTACT.email}.`
    : 'No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.',
  rateLimited:
    'Recibimos varios envíos desde esta conexión. Espera un momento antes de volver a intentar.',
} as const

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
