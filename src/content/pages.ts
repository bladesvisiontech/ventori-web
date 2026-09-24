import { CONTACTO } from '@/content/data/contacto'
import { GLOBAL } from '@/content/data/global'
import { HOME } from '@/content/data/home'
import { NOSOTROS } from '@/content/data/nosotros'
import { PROYECTOS } from '@/content/data/proyectos'
import { SECTORES } from '@/content/data/sectores'
import { SERVICIOS } from '@/content/data/servicios'

/**
 * Metadata y encabezado de cada página. Una sola entrada por ruta: la consumen
 * `<PageHero />` y `buildMetadata()`, de modo que el título visible y el del
 * `<title>` no puedan desincronizarse.
 */
export const PAGES = {
  home: HOME.seo,
  about: { ...NOSOTROS.seo, ...NOSOTROS.hero },
  services: { ...SERVICIOS.seo, ...SERVICIOS.hero },
  sectors: { ...SECTORES.seo, ...SECTORES.hero },
  projects: PROYECTOS.seo,
  contact: { ...CONTACTO.seo, ...CONTACTO.hero },
}

/** Páginas de sistema: ruta inexistente y fallo inesperado. */
export const SYSTEM_PAGES = GLOBAL.systemPages
