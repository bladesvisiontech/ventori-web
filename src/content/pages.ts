import { SITE } from '@/lib/constants'
import type { HeadlineLine } from '@/types/content'

/**
 * Copy del encabezado y metadata de cada página.
 *
 * Una sola entrada por ruta: la consumen tanto `<PageHero />` como
 * `buildMetadata()`, de modo que el título que ve el usuario y el que va al
 * `<title>` no puedan desincronizarse.
 *
 * `titleLines` es el mismo título partido en las líneas con las que debe
 * revelarse; `title` se conserva como cadena única para los usos donde el corte
 * no aplica.
 */
export const PAGES = {
  home: {
    title: `${SITE.name} · ${SITE.tagline}`,
    metaTitle: `${SITE.name} | ${SITE.tagline} en Colombia`,
    description: SITE.description,
  },
  about: {
    eyebrow: 'Nosotros',
    title: 'Ingeniería con responsabilidad sobre el resultado',
    titleLines: [
      'Ingeniería con',
      'responsabilidad',
      { text: 'sobre el resultado', accent: true },
    ] as const satisfies readonly HeadlineLine[],
    lead: 'Somos una empresa colombiana de ingeniería, consultoría e interventoría. Acompañamos proyectos de infraestructura pública y privada en todas sus etapas.',
    metaTitle: 'Nosotros',
    description: `Conoce a ${SITE.name}: misión, visión y compromiso de una empresa colombiana de ingeniería, consultoría e interventoría para proyectos de infraestructura.`,
  },
  services: {
    eyebrow: 'Servicios',
    title: 'Nueve frentes de trabajo, un solo responsable',
    titleLines: [
      'Nueve frentes de',
      'trabajo, un solo',
      { text: 'responsable', accent: true },
    ] as const satisfies readonly HeadlineLine[],
    lead: 'Cubrimos el ciclo completo del proyecto: estructuración, diseño, ejecución, control y cierre. Cada servicio puede contratarse por separado o como parte de un alcance integral.',
    metaTitle: 'Servicios',
    description:
      'Gerencia de proyectos, interventoría integral, consultoría en ingeniería, estudios y diseños, supervisión de obras, gestión ambiental y social, y asesoría técnica.',
  },
  sectors: {
    eyebrow: 'Sectores',
    title: 'Dónde trabajamos',
    titleLines: [
      'Dónde',
      { text: 'trabajamos', accent: true },
    ] as const satisfies readonly HeadlineLine[],
    lead: 'Atendemos proyectos de infraestructura y equipamiento en el sector público y privado, con el rigor documental y técnico que exige cada uno.',
    metaTitle: 'Sectores',
    description:
      'Infraestructura vial, obras civiles, equipamientos públicos, urbanismo y desarrollo territorial para entidades públicas y empresas privadas.',
  },
  projects: {
    metaTitle: 'Proyectos',
    description: `Proyectos de concesión e interventoría de alumbrado público de ${SITE.name} en Timbío, El Tambo, Chitagá y Mutiscua: contratos, vigencia, luminarias y registro fotográfico.`,
  },
  contact: {
    eyebrow: 'Contacto',
    title: 'Cuéntanos qué necesitas resolver',
    titleLines: [
      'Cuéntanos qué',
      { text: 'necesitas resolver', accent: true },
    ] as const satisfies readonly HeadlineLine[],
    lead: 'Escríbenos con el contexto del proyecto y la etapa en la que se encuentra. Te respondemos con una propuesta de alcance concreta.',
    metaTitle: 'Contacto',
    description: `Contacta al equipo de ${SITE.name} para proyectos de ingeniería, consultoría e interventoría en Colombia. Atención de lunes a viernes.`,
  },
} as const

/** Páginas de sistema: ruta inexistente y fallo inesperado. */
export const SYSTEM_PAGES = {
  notFound: {
    eyebrow: 'Error 404',
    titleLines: ['Esta página', { text: 'no existe', accent: true }] as const satisfies readonly HeadlineLine[],
    lead: 'Es posible que la dirección haya cambiado o que el enlace esté mal escrito.',
    metaTitle: 'Página no encontrada',
    primaryCta: 'Ir al inicio',
    secondaryCta: 'Contactarnos',
  },
  error: {
    eyebrow: 'Error',
    title: 'Algo salió mal',
    lead: 'No pudimos cargar esta página. Intenta de nuevo en unos segundos.',
    retry: 'Intentar de nuevo',
    home: 'Ir al inicio',
  },
} as const
