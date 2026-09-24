import type { Metadata } from 'next'
import { CtaBand } from '@/components/sections/CtaBand'
import { ProjectExplorer } from '@/components/sections/ProjectExplorer'
import { ProjectRecords } from '@/components/sections/ProjectRecords'
import { StatsBar } from '@/components/sections/StatsBar'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { PAGES } from '@/content/pages'
import { CONCESSION_PROJECTS, PROJECTS_PAGE } from '@/content/projects-map'
import { ROUTES } from '@/lib/constants'
import { buildBreadcrumbJsonLd, buildMetadata, buildProjectsJsonLd } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: PAGES.projects.metaTitle,
  description: PAGES.projects.description,
  path: ROUTES.projects,
})

export default function ProjectsPage() {
  return (
    <>
      {/* Sin hero: la página abre en el mapa. El relleno superior reserva el header fijo. */}
      <Section
        cms="proyectos:map"
        tone="paper"
        grid
        className="pt-(--header-height) sm:pt-[calc(var(--header-height)+1rem)] lg:pt-(--header-height-lg)"
      >
        <Container width="wide">
          <ProjectExplorer projects={CONCESSION_PROJECTS}>
            <SectionHead
              index={0}
              eyebrow={PROJECTS_PAGE.map.eyebrow}
              lines={PROJECTS_PAGE.map.lines}
              intro={PROJECTS_PAGE.map.intro}
              tone="light"
              as="h1"
              cms="proyectos:map"
              trigger="mount"
            />
          </ProjectExplorer>
        </Container>
      </Section>

      <ProjectRecords index={1} />
      <StatsBar />
      <CtaBand index={2} />

      <JsonLd
        data={[buildProjectsJsonLd(), buildBreadcrumbJsonLd(PAGES.projects.metaTitle, ROUTES.projects)]}
      />
    </>
  )
}
