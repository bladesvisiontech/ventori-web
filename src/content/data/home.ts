import type { z } from 'zod'
import type { homeSchema } from '@/content/schema'
import { fillTokens } from './tokens'
import json from './home.json'

/* Validado al compilar (src/content/validate.ts); aquí solo se tipa, para no enviar zod al navegador. */
export const HOME = fillTokens(json as unknown as z.infer<typeof homeSchema>)
