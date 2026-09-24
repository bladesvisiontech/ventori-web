import Image from 'next/image'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import {
  CONCESSION_PROJECTS,
  CONCESSION_TOTALS,
  PROJECT_LABELS,
  PROJECTS_PAGE,
} from '@/content/projects-map'
import { formatIndex } from '@/lib/utils'

/**
 * Ficha completa de cada contrato con su registro fotográfico entero.
 *
 * Cada ficha lleva el `id` del proyecto como ancla, que es a donde apunta el
 * botón "Más información" del mapa de la home.
 */
export function ProjectRecords({ index }: { index: number }) {
  const copy = PROJECTS_PAGE.records

  const totals = [
    { label: PROJECTS_PAGE.totals.projects, value: CONCESSION_TOTALS.projects },
    { label: PROJECTS_PAGE.totals.departments, value: CONCESSION_TOTALS.departments },
    { label: PROJECTS_PAGE.totals.luminaires, value: CONCESSION_TOTALS.luminaires },
  ]

  return (
    <Section tone="navy" grid>
      <Container width="wide">
        <SectionHead index={index} eyebrow={copy.eyebrow} lines={copy.lines} intro={copy.intro} />

        <Reveal>
          <dl className="mt-14 grid gap-6 border-y border-navy-800 py-8 sm:grid-cols-3">
            {totals.map((total) => (
              <div key={total.label}>
                <dt className="font-mono text-label uppercase text-navy-200">{total.label}</dt>
                <dd className="stretch-display mt-2 font-display text-display-sm font-semibold tabular text-white">
                  {total.value.toLocaleString('es-CO')}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-20 space-y-24 lg:space-y-32">
          {CONCESSION_PROJECTS.map((project, position) => {
            const photos = project.images ?? []

            const facts = [
              { label: PROJECT_LABELS.department, value: project.department },
              { label: PROJECT_LABELS.company, value: project.company },
              { label: PROJECT_LABELS.contract, value: project.contract },
              { label: PROJECT_LABELS.startDate, value: project.startDate },
              { label: PROJECT_LABELS.endDate, value: project.endDate },
              {
                label: PROJECT_LABELS.term,
                value: `${project.termYears} ${PROJECT_LABELS.termUnit}`,
              },
              {
                label: PROJECT_LABELS.luminaires,
                value: project.luminaires.toLocaleString('es-CO'),
              },
            ]

            return (
              <article
                key={project.id}
                id={project.id}
                aria-labelledby={`${project.id}-title`}
                className="scroll-mt-32 border-t border-navy-800 pt-10"
              >
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                  <Reveal className="lg:col-span-5">
                    <p className="font-mono text-label tabular text-terracota-500">
                      {formatIndex(position)}
                    </p>
                    <h3
                      id={`${project.id}-title`}
                      className="stretch-display mt-4 font-display text-display-sm font-semibold text-white"
                    >
                      {project.name}
                    </h3>

                    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                      {facts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="font-mono text-label uppercase text-navy-200">{fact.label}</dt>
                          <dd className="mt-1 text-sm tabular text-white">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <h4 className="mt-8 font-mono text-label uppercase text-navy-200">
                      {PROJECT_LABELS.object}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-navy-100">{project.object}</p>
                  </Reveal>

                  <div className="lg:col-span-7">
                    <h4 className="font-mono text-label uppercase text-navy-200">
                      {PROJECT_LABELS.gallery}
                    </h4>

                    {photos.length > 0 ? (
                      <Stagger className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                        {photos.map((photo, photoPosition) => (
                          <StaggerItem
                            key={photo}
                            className={photoPosition === 0 ? 'col-span-2' : undefined}
                          >
                            <div
                              className={
                                photoPosition === 0
                                  ? 'relative aspect-16/9 overflow-hidden bevel bg-navy-900'
                                  : 'relative aspect-4/3 overflow-hidden bevel-sm bg-navy-900'
                              }
                            >
                              <Image
                                src={photo}
                                alt={`${project.name}, ${project.department}. ${PROJECT_LABELS.gallery} ${photoPosition + 1} ${PROJECT_LABELS.photoOf} ${photos.length}.`}
                                fill
                                sizes={
                                  photoPosition === 0
                                    ? '(min-width: 1024px) 55vw, 100vw'
                                    : '(min-width: 1024px) 27vw, 50vw'
                                }
                                className="object-cover"
                              />
                            </div>
                          </StaggerItem>
                        ))}
                      </Stagger>
                    ) : (
                      <p className="mt-5 bevel border border-navy-800 bg-navy-900 p-8 text-sm text-navy-200">
                        {PROJECT_LABELS.photosPending}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
