import Image from 'next/image'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { PAGES } from '@/content/pages'
import { HAS_PROJECTS, PROJECTS } from '@/content/projects'
import { ROUTES } from '@/lib/constants'
import { formatIndex } from '@/lib/utils'

/**
 * Portafolio de proyectos.
 *
 * `PROJECTS` está vacío a la espera del cliente y esta sección resuelve los dos
 * escenarios sin que haya que tocarla después: mientras no haya casos muestra un
 * estado vacío honesto —explica que la sección se está preparando y ofrece el
 * contacto—, y en cuanto se llene el arreglo pasa sola a la retícula.
 *
 * Un estado vacío que finge no existir, o una retícula con proyectos inventados,
 * es lo que hace que un sitio corporativo pierda credibilidad en la primera
 * reunión con el cliente final.
 */
export function ProjectsGrid() {
  if (!HAS_PROJECTS) {
    return (
      <Section tone="navy" grid>
        <Container width="prose">
          <Reveal>
            <div className="bevel border-navy-800 bg-navy-900 p-10 text-center sm:p-14">
              <h2 className="stretch-display text-display-sm font-semibold text-white">
                {PAGES.projects.empty.title}
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-navy-100">
                {PAGES.projects.empty.text}
              </p>
              <div className="mt-10 flex justify-center">
                <ShinyButton href={ROUTES.contact}>Escríbenos</ShinyButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    )
  }

  return (
    <Section tone="navy" grid>
      <Container width="wide">
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, position) => (
            <StaggerItem key={project.id}>
              <article className="group h-full">
                <div className="relative aspect-4/3 overflow-hidden bevel">
                  <Image
                    src={project.image}
                    alt={`${project.title}. ${project.scope}.`}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                  />
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <span className="font-mono text-label tabular text-terracota-500">
                    {formatIndex(position)}
                  </span>
                  <span className="font-mono text-label tabular uppercase text-navy-200">
                    {project.year}
                  </span>
                </div>

                <h2 className="mt-4 stretch-display text-xl font-semibold leading-snug tracking-tight text-white">
                  {project.title}
                </h2>

                <dl className="mt-4 space-y-1.5 text-sm text-navy-200">
                  <div className="flex gap-2">
                    <dt className="sr-only">Cliente</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="sr-only">Ubicación</dt>
                    <dd>{project.location}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="sr-only">Alcance</dt>
                    <dd className="text-navy-100">{project.scope}</dd>
                  </div>
                </dl>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  )
}
