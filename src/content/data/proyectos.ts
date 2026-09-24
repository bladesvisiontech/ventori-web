import { proyectosSchema } from '@/content/schema'
import { parseContent } from './parse'
import { fillTokens } from './tokens'
import json from './proyectos.json'

export const PROYECTOS = fillTokens(parseContent('proyectos.json', proyectosSchema, json))
