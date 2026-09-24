import { sectoresSchema } from '@/content/schema'
import { parseContent } from './parse'
import { fillTokens } from './tokens'
import json from './sectores.json'

export const SECTORES = fillTokens(parseContent('sectores.json', sectoresSchema, json))
