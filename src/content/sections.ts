import type { HeadlineLine } from '@/types/content'

interface SectionCopy {
  /** Nombre corto, en monoespaciada, junto al índice. */
  eyebrow: string
  /**
   * El corte de línea es una decisión editorial: `<Headline>` revela línea a
   * línea y el orden en que aparecen construye la jerarquía. Se declara aquí,
   * no se calcula del ancho disponible.
   */
  lines: readonly HeadlineLine[]
  intro?: string
}

/**
 * Cabeceras de las secciones de la home, en el orden en que aparecen.
 *
 * El índice numerado que ve el usuario sale de la posición en la página, no de
 * este archivo: así reordenar una sección no obliga a renumerar el contenido.
 */
export const HOME_SECTIONS = {
  projects: {
    eyebrow: 'Cobertura',
    lines: ['Nuestros', { text: 'proyectos', accent: true }],
    intro:
      'Ejecutamos proyectos de concesión e interventoría del servicio de alumbrado público en varios departamentos del país, con contratos vigentes a 25 y 30 años.',
  },
  sectors: {
    eyebrow: 'Sectores',
    lines: ['Dónde', { text: 'trabajamos', accent: true }],
    intro:
      'Atendemos proyectos de infraestructura y equipamiento en el sector público y privado, con el rigor documental y técnico que exige cada uno.',
  },
  about: {
    eyebrow: 'Quiénes somos',
    lines: ['Soluciones técnicas', 'integrales para la', { text: 'infraestructura', accent: true }],
    intro:
      'Trabajamos con altos estándares de calidad, eficiencia e innovación, acompañando a nuestros clientes en cada etapa del proyecto.',
  },
  process: {
    eyebrow: 'Cómo trabajamos',
    lines: ['Los tres momentos', { text: 'críticos del proyecto', accent: true }],
    intro:
      'Cada etapa tiene sus propios riesgos. Estar en las tres es lo que permite que las decisiones tempranas no se paguen caro al final.',
  },
  services: {
    eyebrow: 'Índice',
    lines: ['Qué hacemos', { text: 'en cada etapa', accent: true }],
    intro:
      'Los nueve servicios de un vistazo. Elige uno para bajar a su alcance detallado, más abajo en esta página.',
  },
  whyUs: {
    eyebrow: 'Por qué elegirnos',
    lines: ['Lo que sostiene', 'cada entrega'],
    intro:
      'No es una lista de buenas intenciones: es lo que verifica un auditor cuando revisa el expediente de un proyecto nuestro.',
  },
} as const satisfies Record<string, SectionCopy>

/**
 * Términos de la banda que desfila entre bloques.
 *
 * Todos aparecen como texto real en otras secciones, así que la banda va
 * `aria-hidden` sin retirar información a quien usa lector de pantalla.
 */
export const MARQUEE_TERMS = [
  'Interventoría integral',
  'Gerencia de proyectos',
  'Estudios y diseños',
  'Supervisión de obra',
  'Gestión ambiental y social',
  'Estructuración',
  'Asesoría técnica',
] as const
