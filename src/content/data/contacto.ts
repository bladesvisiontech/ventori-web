import { contactoSchema } from '@/content/schema'
import { parseContent } from './parse'
import { fillTokens } from './tokens'
import json from './contacto.json'

export const CONTACTO = fillTokens(parseContent('contacto.json', contactoSchema, json))
