import type { z } from 'zod'
import type { sectoresSchema } from '@/content/schema'
import { fillTokens } from './tokens'
import json from './sectores.json'

/* Validado al compilar (src/content/validate.ts); aquí solo se tipa, para no enviar zod al navegador. */
export const SECTORES = fillTokens(json as unknown as z.infer<typeof sectoresSchema>)
