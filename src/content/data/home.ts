import { homeSchema } from '@/content/schema'
import { parseContent } from './parse'
import { fillTokens } from './tokens'
import json from './home.json'

export const HOME = fillTokens(parseContent('home.json', homeSchema, json))
