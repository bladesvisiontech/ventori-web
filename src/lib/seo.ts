import type { Metadata } from 'next'
import { CONCESSION_PROJECTS } from '@/content/projects-map'
import { CONTACT, ROUTES, SITE, SOCIAL } from '@/lib/constants'

interface BuildMetadataInput {
  title: string
  description: string
  /** Ruta relativa, p. ej. `ROUTES.services`. */
  path: string
}

/** Metadata consistente para todas las páginas: canonical, Open Graph y Twitter. */
export function buildMetadata({ title, description, path }: BuildMetadataInput): Metadata {
  const url = new URL(path, SITE.url).toString()
  /* El `<title>` recibe la marca por la plantilla del layout; Open Graph no la hereda. */
  const socialTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`
  const image = {
    url: '/opengraph-image',
    width: 1200,
    height: 630,
    alt: `${SITE.name} · ${SITE.tagline}`,
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image],
    },
  }
}

/** JSON-LD de organización. Solo incluye los campos que ya tienen dato cargado. */
export function buildOrganizationJsonLd() {
  const sameAs = [SOCIAL.linkedin].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    logo: new URL('/icon-512.png', SITE.url).toString(),
    image: new URL('/opengraph-image', SITE.url).toString(),
    areaServed: { '@type': 'Country', name: 'Colombia' },
    ...(CONTACT.email ? { email: CONTACT.email } : {}),
    ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
    ...(CONTACT.address || CONTACT.city
      ? {
          address: {
            '@type': 'PostalAddress',
            addressCountry: SITE.country,
            ...(CONTACT.address ? { streetAddress: CONTACT.address } : {}),
            ...(CONTACT.city ? { addressLocality: CONTACT.city } : {}),
          },
        }
      : {}),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:30',
      closes: '17:30',
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: new URL(ROUTES.contact, SITE.url).toString(),
      availableLanguage: ['Spanish'],
    },
  }
}

/**
 * Serializa JSON-LD para `<script type="application/ld+json">`. Escapa `<` para
 * que ningún valor pueda cerrar la etiqueta y colar marcado.
 */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Rastro de migas de una página interna, para los resultados de búsqueda. */
export function buildBreadcrumbJsonLd(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: new URL(ROUTES.home, SITE.url).toString() },
      { '@type': 'ListItem', position: 2, name, item: new URL(path, SITE.url).toString() },
    ],
  }
}

/** Proyectos de alumbrado público como lista de obras con su ubicación. */
export function buildProjectsJsonLd() {
  const pageUrl = new URL(ROUTES.projects, SITE.url).toString()

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Proyectos de ${SITE.name}`,
    url: pageUrl,
    itemListElement: CONCESSION_PROJECTS.map((project, position) => ({
      '@type': 'ListItem',
      position: position + 1,
      item: {
        '@type': 'Project',
        name: `Alumbrado público de ${project.name}`,
        description: project.object,
        url: `${pageUrl}#${project.id}`,
        ...(project.images?.[0]
          ? { image: new URL(project.images[0], SITE.url).toString() }
          : {}),
        location: {
          '@type': 'Place',
          name: project.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: project.name,
            addressRegion: project.department,
            addressCountry: SITE.country,
          },
        },
      },
    })),
  }
}
