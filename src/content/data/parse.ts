import type { z } from 'zod'

/** Valida un JSON de contenido; si no cumple el esquema, el build falla con el campo exacto. */
export function parseContent<T extends z.ZodType>(file: string, schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `  · ${issue.path.join('.')}: ${issue.message}`)
    throw new Error(`Contenido inválido en src/content/data/${file}:\n${issues.join('\n')}`)
  }
  return result.data
}
