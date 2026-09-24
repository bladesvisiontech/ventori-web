import { GLOBAL } from './global'

/**
 * Marcadores que los textos pueden usar para citar datos de la empresa sin
 * repetirlos: cambiar el nombre o el NIT en "Sitio" los actualiza en todas partes.
 */
const TOKENS: Record<string, string> = {
  empresa: GLOBAL.site.name,
  razonSocial: GLOBAL.site.legalName,
  responsable: [GLOBAL.site.legalName, GLOBAL.site.nit ? `NIT ${GLOBAL.site.nit}` : null, 'Colombia']
    .filter(Boolean)
    .join(' · '),
  canalContacto: GLOBAL.contact.email
    ? `el correo ${GLOBAL.contact.email} o el formulario de la página de contacto (/contacto)`
    : 'el formulario de la página de contacto (/contacto)',
}

export function fillTokens<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (match, key: string) => TOKENS[key] ?? match) as T
  }
  if (Array.isArray(value)) return value.map(fillTokens) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillTokens(item)])) as T
  }
  return value
}
