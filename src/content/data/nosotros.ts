import { nosotrosSchema } from '@/content/schema'
import { parseContent } from './parse'
import { fillTokens } from './tokens'
import json from './nosotros.json'

export const NOSOTROS = fillTokens(parseContent('nosotros.json', nosotrosSchema, json))
