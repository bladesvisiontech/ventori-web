/**
 * Marcas para la vista previa del CMS. No cambian nada para los visitantes:
 * solo el puente de vista previa (`<CmsPreviewBridge>`), que se activa dentro
 * del iframe del CMS, las usa para resaltar la sección que se edita y aplicar
 * en vivo los textos y fotos que se están escribiendo.
 *
 * El valor es "<archivo>:<ruta en el JSON>", p. ej. "home:hero.subheadline".
 */
export type CmsFile =
  | 'home'
  | 'nosotros'
  | 'servicios'
  | 'sectores'
  | 'proyectos'
  | 'contacto'
  | 'legal'
  | 'global'

/** Texto, línea de titular o foto editable. */
export const cmsField = (key: string | undefined) => (key ? { 'data-cms': key } : {})

/** Bloque que corresponde a una sección del editor. */
export const cmsSection = (key: string | undefined) => (key ? { 'data-cms-section': key } : {})

export const cmsKey = (file: CmsFile, path: string) => `${file}:${path}`
