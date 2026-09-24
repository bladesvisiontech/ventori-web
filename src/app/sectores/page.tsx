import type { Metadata } from 'next'
import { CtaBand } from '@/components/sections/CtaBand'
import { SectorsGrid } from '@/components/sections/SectorsGrid'
import { SectorsMosaic } from '@/components/sections/SectorsMosaic'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/ui/PageHero'
import { PAGES } from '@/content/pages'
import { ROUTES } from '@/lib/constants'
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: PAGES.sectors.metaTitle,
  description: PAGES.sectors.description,
  path: ROUTES.sectors,
})

/**
 * `<SectorsMosaic>` abre como el mismo bloque que antes vivía en la home —hoy
 * sin su CTA, que apuntaba aquí mismo— y cada pieza baja directo al bloque de
 * `<SectorsGrid>` del mismo sector, más abajo en esta página.
 */
export default function SectorsPage() {
  return (
    <>
      <PageHero
        cms="sectores:hero"
        eyebrow={PAGES.sectors.eyebrow}
        lines={PAGES.sectors.titleLines}
        lead={PAGES.sectors.lead}
      />
      <SectorsMosaic index={0} />
      <SectorsGrid />
      <CtaBand index={1} />
      <JsonLd data={buildBreadcrumbJsonLd(PAGES.sectors.metaTitle, ROUTES.sectors)} />
    </>
  )
}
