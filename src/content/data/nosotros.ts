import type { z } from 'zod'
import type { nosotrosSchema } from '@/content/schema'
import { fillTokens } from './tokens'
import json from './nosotros.json'

/* Validado al compilar (src/content/validate.ts); aquí solo se tipa, para no enviar zod al navegador. */
export const NOSOTROS = fillTokens(json as unknown as z.infer<typeof nosotrosSchema>)
