import type { Metadata } from 'next'
import { CtaBand } from '@/components/sections/CtaBand'
import { ProjectsGrid } from '@/components/sections/ProjectsGrid'
import { StatsBar } from '@/components/sections/StatsBar'
import { PageHero } from '@/components/ui/PageHero'
import { PAGES } from '@/content/pages'
import { ROUTES } from '@/lib/constants'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: PAGES.projects.metaTitle,
  description: PAGES.projects.description,
  path: ROUTES.projects,
})

/**
 * `<StatsBar>` bajó aquí desde la home: no se renderiza mientras el cliente no
 * entregue cifras (ver `content/stats.ts`), y las cifras de una empresa
 * —proyectos ejecutados, municipios atendidos— encajan mejor junto a los casos
 * que en una home que ahora abre directo con la cobertura de proyectos.
 */
export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow={PAGES.projects.eyebrow}
        lines={PAGES.projects.titleLines}
        lead={PAGES.projects.lead}
      />
      <ProjectsGrid />
      <StatsBar />
      <CtaBand index={0} />
    </>
  )
}
