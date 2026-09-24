import type { PROYECTOS } from '@/content/data/proyectos'
import type { NOSOTROS } from '@/content/data/nosotros'
import type { SECTORES } from '@/content/data/sectores'
import type { SERVICIOS } from '@/content/data/servicios'

export type { HeadlineLine, IconName, MediaImage, MediaVideo } from '@/content/schema'

export type Service = (typeof SERVICIOS.services)[number]
export type Sector = (typeof SECTORES.sectors)[number]
export type Pillar = (typeof SERVICIOS.process.pillars)[number]
export type Differentiator = (typeof NOSOTROS.whyUs.items)[number]
export type Stat = (typeof PROYECTOS.stats)[number]

/** Posición en `COLOMBIA_MAP_VIEWBOX` y límite del municipio: geometría, no contenido. */
export interface ProjectGeometry {
  point: { x: number; y: number }
  callout: { x: number; y: number }
  boundaryPath: string
}

/** Proyecto de alumbrado público: datos del contrato (CMS) + su geometría en el mapa. */
export type ConcessionProject = (typeof PROYECTOS.projects)[number] & Partial<ProjectGeometry>
