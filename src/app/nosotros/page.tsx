import type { Metadata } from 'next'
import { AboutFull } from '@/components/sections/AboutFull'
import { AboutSplit } from '@/components/sections/AboutSplit'
import { Commitment } from '@/components/sections/Commitment'
import { CtaBand } from '@/components/sections/CtaBand'
import { MissionVision } from '@/components/sections/MissionVision'
import { WhyUs } from '@/components/sections/WhyUs'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/ui/PageHero'
import { PAGES } from '@/content/pages'
import { ROUTES } from '@/lib/constants'
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: PAGES.about.metaTitle,
  description: PAGES.about.description,
  path: ROUTES.about,
})

/**
 * `<AboutSplit>` abre como el mismo bloque que antes vivía en la home —hoy sin
 * su CTA, que apuntaba aquí mismo— y `<AboutFull>` sostiene el argumento
 * completo justo debajo, sin repetir tema.
 *
 * `<WhyUs>` (terracota) se cuela entre las dos secciones sobre papel para que
 * no queden tres bloques papel seguidos: dos ya es lo máximo que tolera la
 * alternancia de tonos de `<Section>`.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={PAGES.about.eyebrow}
        lines={PAGES.about.titleLines}
        lead={PAGES.about.lead}
      />
      <AboutSplit index={0} />
      <AboutFull index={1} />
      <WhyUs index={2} />
      <MissionVision index={3} />
      <Commitment index={4} />
      <CtaBand index={5} />
      <JsonLd data={buildBreadcrumbJsonLd(PAGES.about.metaTitle, ROUTES.about)} />
    </>
  )
}
