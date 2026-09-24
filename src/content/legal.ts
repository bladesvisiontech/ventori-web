import { LEGAL } from '@/content/data/legal'

export type { LegalDocument, LegalSection } from '@/content/schema'

/**
 * Política de privacidad (Ley 1581 de 2012), términos y política de cookies.
 * Los textos se editan desde el CMS; `{responsable}`, `{razonSocial}`,
 * `{empresa}` y `{canalContacto}` se rellenan con los datos de "Sitio".
 */
export const PRIVACY_POLICY = LEGAL.privacy
export const TERMS = LEGAL.terms
export const COOKIES_POLICY = LEGAL.cookies
export const LEGAL_UPDATED_LABEL = LEGAL.updatedLabel
