import type { z } from 'zod'
import type { serviciosSchema } from '@/content/schema'
import { fillTokens } from './tokens'
import json from './servicios.json'

/* Validado al compilar (src/content/validate.ts); aquí solo se tipa, para no enviar zod al navegador. */
export const SERVICIOS = fillTokens(json as unknown as z.infer<typeof serviciosSchema>)
