import type { z } from 'zod'
import type { proyectosSchema } from '@/content/schema'
import { fillTokens } from './tokens'
import json from './proyectos.json'

/* Validado al compilar (src/content/validate.ts); aquí solo se tipa, para no enviar zod al navegador. */
export const PROYECTOS = fillTokens(json as unknown as z.infer<typeof proyectosSchema>)
