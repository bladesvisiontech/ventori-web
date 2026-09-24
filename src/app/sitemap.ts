import type { MetadataRoute } from 'next'
import { CONCESSION_PROJECTS } from '@/content/projects-map'
import { ROUTES, SITE } from '@/lib/constants'

/** Prioridad relativa por ruta; la home encabeza y contacto la sigue. */
const PRIORITIES: Record<string, number> = {
  [ROUTES.home]: 1,
  [ROUTES.services]: 0.9,
  [ROUTES.about]: 0.8,
  [ROUTES.sectors]: 0.8,
  [ROUTES.projects]: 0.8,
  [ROUTES.contact]: 0.9,
  [ROUTES.privacy]: 0.2,
  [ROUTES.terms]: 0.2,
  [ROUTES.cookies]: 0.2,
}

const LEGAL_ROUTES = new Set<string>([ROUTES.privacy, ROUTES.terms, ROUTES.cookies])

const absolute = (path: string) => new URL(path, SITE.url).toString()

/** Las fotos de proyecto se declaran en su página para que entren en la búsqueda de imágenes. */
const IMAGES: Record<string, string[]> = {
  [ROUTES.projects]: CONCESSION_PROJECTS.flatMap((project) => project.images ?? []).map(absolute),
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return Object.values(ROUTES).map((route) => ({
    url: absolute(route),
    lastModified,
    changeFrequency: LEGAL_ROUTES.has(route) ? 'yearly' : 'monthly',
    priority: PRIORITIES[route] ?? 0.5,
    ...(IMAGES[route] ? { images: IMAGES[route] } : {}),
  }))
}
