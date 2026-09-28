import type { z } from 'zod'
import type { globalSchema } from '@/content/schema'
import json from './global.json'

/* Validado al compilar (src/content/validate.ts); aquí solo se tipa, para no enviar zod al navegador. */
export const GLOBAL = json as unknown as z.infer<typeof globalSchema>
