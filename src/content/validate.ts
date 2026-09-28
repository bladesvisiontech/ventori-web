import type { z } from 'zod'
import contacto from './data/contacto.json'
import globalJson from './data/global.json'
import home from './data/home.json'
import legal from './data/legal.json'
import nosotros from './data/nosotros.json'
import proyectos from './data/proyectos.json'
import sectores from './data/sectores.json'
import servicios from './data/servicios.json'
import {
  contactoSchema,
  globalSchema,
  homeSchema,
  legalSchema,
  nosotrosSchema,
  proyectosSchema,
  sectoresSchema,
  serviciosSchema,
} from './schema'

const FILES: [string, z.ZodType, unknown][] = [
  ['global.json', globalSchema, globalJson],
  ['home.json', homeSchema, home],
  ['nosotros.json', nosotrosSchema, nosotros],
  ['servicios.json', serviciosSchema, servicios],
  ['sectores.json', sectoresSchema, sectores],
  ['proyectos.json', proyectosSchema, proyectos],
  ['contacto.json', contactoSchema, contacto],
  ['legal.json', legalSchema, legal],
]

/**
 * Valida todo el contenido editable. Se llama desde next.config.ts, así que un
 * JSON inválido (p. ej. guardado a mano) detiene el build con el campo exacto
 * y Vercel mantiene publicada la versión anterior.
 */
export function validateContent() {
  const problems = FILES.flatMap(([file, schema, data]) => {
    const result = schema.safeParse(data)
    return result.success
      ? []
      : result.error.issues.map((issue) => `  · ${file} → ${issue.path.join('.')}: ${issue.message}`)
  })
  if (problems.length) throw new Error(`Contenido inválido en src/content/data:\n${problems.join('\n')}`)
}
