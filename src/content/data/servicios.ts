import { serviciosSchema } from '@/content/schema'
import { parseContent } from './parse'
import { fillTokens } from './tokens'
import json from './servicios.json'

export const SERVICIOS = fillTokens(parseContent('servicios.json', serviciosSchema, json))
