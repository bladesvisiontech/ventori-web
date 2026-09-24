import type { Metadata } from 'next'
import { CtaBand } from '@/components/sections/CtaBand'
import { MarqueeBand } from '@/components/sections/MarqueeBand'
import { ProcessSequence } from '@/components/sections/ProcessSequence'
import { ServicesDetail } from '@/components/sections/ServicesDetail'
import { ServicesIndex } from '@/components/sections/ServicesIndex'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/ui/PageHero'
import { PAGES } from '@/content/pages'
import { ROUTES } from '@/lib/constants'
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: PAGES.services.metaTitle,
  description: PAGES.services.description,
  path: ROUTES.services,
})

/**
 * `<ServicesIndex>` abre como el mismo bloque que antes vivía en la home —hoy
 * sin su CTA, que apuntaba aquí mismo— y cada fila baja directo al bloque de
 * `<ServicesDetail>` del mismo servicio, más abajo en esta página.
 *
 * `<MarqueeBand>` separa las dos secciones densas de servicios, el mismo papel
 * de ritmo que cumplía en la home.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={PAGES.services.eyebrow}
        lines={PAGES.services.titleLines}
        lead={PAGES.services.lead}
      />
      <ServicesIndex index={0} />
      <MarqueeBand />
      <ServicesDetail />
      <ProcessSequence index={1} />
      <CtaBand index={2} />
      <JsonLd data={buildBreadcrumbJsonLd(PAGES.services.metaTitle, ROUTES.services)} />
    </>
  )
}
