import { HOME } from '@/content/data/home'
import { NOSOTROS } from '@/content/data/nosotros'
import { SECTORES } from '@/content/data/sectores'
import { SERVICIOS } from '@/content/data/servicios'

/**
 * Cabeceras de sección. El índice numerado que ve el usuario sale de la
 * posición en la página, no de aquí.
 */
export const HOME_SECTIONS = {
  projects: HOME.projects,
  sectors: SECTORES.mosaic,
  about: NOSOTROS.about.section,
  process: SERVICIOS.process.section,
  services: SERVICIOS.index,
  whyUs: NOSOTROS.whyUs.section,
}

/**
 * Términos de la banda que desfila entre bloques. Todos aparecen como texto real
 * en otras secciones, así que la banda va `aria-hidden`.
 */
export const MARQUEE_TERMS = SERVICIOS.marquee
