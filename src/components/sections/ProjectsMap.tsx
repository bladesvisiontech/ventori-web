import { ProjectExplorer } from '@/components/sections/ProjectExplorer'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { CONCESSION_PROJECTS, HAS_CONCESSION_PROJECTS } from '@/content/projects-map'
import { HOME_SECTIONS } from '@/content/sections'

/**
 * Cobertura de proyectos, justo debajo del hero.
 *
 * Reemplaza en la home a las nueve secciones que antes bajaban en cascada: la
 * home queda en dos piezas —hero y esta— y el resto del argumento de empresa
 * vive en sus internas correspondientes.
 *
 * Va sobre papel, no en navy: el hero ya abre oscuro con vídeo, y encadenar un
 * segundo bloque oscuro justo debajo es la home entera sin un solo respiro
 * claro. El mapa y las tarjetas oscuras quedan como piezas de contraste sobre
 * el fondo claro, no al revés.
 *
 * No se renderiza si no hay proyectos cargados, por la misma razón que
 * `<StatsBar>`: no se inventan cifras de una empresa real.
 */
export function ProjectsMap({ index }: { index: number }) {
  if (!HAS_CONCESSION_PROJECTS) return null

  const copy = HOME_SECTIONS.projects

  return (
    <Section tone="paper" grid>
      <Container width="wide">
        <ProjectExplorer projects={CONCESSION_PROJECTS}>
          <SectionHead
            index={index}
            eyebrow={copy.eyebrow}
            lines={copy.lines}
            intro={copy.intro}
            tone="light"
          />
        </ProjectExplorer>
      </Container>
    </Section>
  )
}
