import type { z } from 'zod'
import type { contactoSchema } from '@/content/schema'
import { fillTokens } from './tokens'
import json from './contacto.json'

/* Validado al compilar (src/content/validate.ts); aquí solo se tipa, para no enviar zod al navegador. */
export const CONTACTO = fillTokens(json as unknown as z.infer<typeof contactoSchema>)
