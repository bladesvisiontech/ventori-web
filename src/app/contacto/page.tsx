import type { Metadata } from 'next'
import { ContactPanel } from '@/components/sections/ContactPanel'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/ui/PageHero'
import { PAGES } from '@/content/pages'
import { ROUTES } from '@/lib/constants'
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: PAGES.contact.metaTitle,
  description: PAGES.contact.description,
  path: ROUTES.contact,
})

/**
 * Contacto cierra sin `<CtaBand />`: el usuario ya está en el sitio donde esa
 * banda lo mandaría, y repetirla aquí solo alarga la página.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        cms="contacto:hero"
        eyebrow={PAGES.contact.eyebrow}
        lines={PAGES.contact.titleLines}
        lead={PAGES.contact.lead}
      />
      <ContactPanel />
      <JsonLd data={buildBreadcrumbJsonLd(PAGES.contact.metaTitle, ROUTES.contact)} />
    </>
  )
}
