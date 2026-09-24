import { globalSchema } from '@/content/schema'
import { parseContent } from './parse'
import globalJson from './global.json'

export const GLOBAL = parseContent('global.json', globalSchema, globalJson)
