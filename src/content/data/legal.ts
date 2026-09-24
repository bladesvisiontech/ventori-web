import { legalSchema } from '@/content/schema'
import { parseContent } from './parse'
import { fillTokens } from './tokens'
import json from './legal.json'

export const LEGAL = fillTokens(parseContent('legal.json', legalSchema, json))
