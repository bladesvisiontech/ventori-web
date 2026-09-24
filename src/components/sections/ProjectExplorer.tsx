'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { COLOMBIA_MAP_VIEWBOX, DEPARTMENT_PATHS, PROJECT_LABELS } from '@/content/projects-map'
import { cn, formatIndex } from '@/lib/utils'
import type { ConcessionProject } from '@/types/content'

interface ProjectExplorerProps {
  projects: readonly ConcessionProject[]
  /** Cabecera de la sección, a ancho completo sobre el mapa. */
  children: React.ReactNode
  /** Destino del botón "Más información". Sin él, el botón no se muestra. */
  moreHref?: string
}

const PLACEHOLDER_IMAGE = '/media/placeholder.svg'

/** Extrae ancho y alto de un `viewBox` "0 0 W H" para calcular posiciones en %. */
function parseViewBox(viewBox: string) {
  const [, , width, height] = viewBox.split(' ').map(Number)
  return { width, height }
}

/**
 * Mapa político de Colombia + selector de proyecto + carrusel de fotos del
 * proyecto activo + datos del contrato, en un solo componente interactivo.
 *
 * El proyecto se elige en el mapa (pin o etiqueta) o en los chips; las flechas
 * del carrusel recorren solo las fotos del proyecto activo.
 */
export function ProjectExplorer({ projects, children, moreHref }: ProjectExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)
  const active = projects[activeIndex]
  const { width, height } = parseViewBox(COLOMBIA_MAP_VIEWBOX)

  const activeDepartments = new Set(projects.map((project) => project.department))

  if (!active) return null

  const photos = active.images ?? []
  const currentPhoto = photos[photoIndex] ?? PLACEHOLDER_IMAGE

  const selectProject = (position: number) => {
    setActiveIndex(position)
    setPhotoIndex(0)
  }

  const stepPhoto = (step: number) => {
    setPhotoIndex((current) => (current + step + photos.length) % photos.length)
  }

  return (
    <div className="mt-16">
      {children}

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-7">
          <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
            <svg
              viewBox={COLOMBIA_MAP_VIEWBOX}
              className="absolute inset-0 size-full"
              role="img"
              aria-label={`${PROJECT_LABELS.mapLabel}: ${projects
                .map((project) => `${project.name} (${project.department})`)
                .join(', ')}`}
            >
              {Object.entries(DEPARTMENT_PATHS).map(([department, path]) => (
                <path
                  key={department}
                  d={path}
                  fill={
                    activeDepartments.has(department)
                      ? 'var(--color-navy-950)'
                      : 'var(--color-terracota-400)'
                  }
                  stroke="var(--color-paper-50)"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              ))}
              {projects.map((project) => (
                <path
                  key={project.id}
                  d={project.boundaryPath}
                  fill="var(--color-navy-950)"
                  stroke="var(--color-paper-50)"
                  strokeWidth={1}
                />
              ))}
              {projects.map((project) => (
                <line
                  key={`line-${project.id}`}
                  x1={project.callout.x}
                  y1={project.callout.y}
                  x2={project.point.x}
                  y2={project.point.y}
                  stroke="var(--color-navy-950)"
                  strokeWidth={1}
                />
              ))}
            </svg>

            {projects.map((project, position) => {
              const isActive = project.id === active.id

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => selectProject(position)}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
                  style={{
                    left: `${(project.point.x / width) * 100}%`,
                    top: `${(project.point.y / height) * 100}%`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'block size-2.5 rounded-full bg-white ring-2 ring-navy-950/40 transition-transform duration-300',
                      isActive ? 'scale-150' : 'group-hover:scale-125',
                    )}
                  />
                </button>
              )
            })}

            {/* Pines y etiquetas son atajos de ratón y táctiles: al teclado y al lector
                de pantalla los sirven los chips, que hacen lo mismo con área suficiente. */}
            {projects.map((project, position) => {
              const isActive = project.id === active.id

              return (
                <button
                  key={`label-${project.id}`}
                  type="button"
                  onClick={() => selectProject(position)}
                  aria-hidden="true"
                  tabIndex={-1}
                  className={cn(
                    'absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 font-mono text-[0.625rem] uppercase tracking-wider transition-colors duration-300 sm:px-3 sm:py-1.5 sm:text-label',
                    isActive
                      ? 'bg-navy-950 text-white'
                      : 'bg-white text-navy-950 hover:bg-navy-950 hover:text-white',
                  )}
                  style={{
                    left: `${(project.callout.x / width) * 100}%`,
                    top: `${(project.callout.y / height) * 100}%`,
                  }}
                >
                  {project.name}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="lg:col-span-5">
          <ul aria-label={PROJECT_LABELS.selectorLabel} className="flex flex-wrap gap-2">
            {projects.map((project, position) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => selectProject(position)}
                  aria-pressed={project.id === active.id}
                  className={cn(
                    'flex min-h-11 items-center gap-2 bevel-sm px-3 py-2.5 font-mono text-label transition-colors duration-300',
                    project.id === active.id
                      ? 'bg-navy-950 text-white'
                      : 'bg-navy-950/5 text-navy-700 hover:bg-navy-950/10',
                  )}
                >
                  <span
                    className={cn(
                      'tabular',
                      project.id === active.id ? 'text-terracota-400' : 'text-terracota-800',
                    )}
                  >
                    {formatIndex(position)}
                  </span>
                  <span className="uppercase">{project.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <p aria-live="polite" className="sr-only">
            {active.name}, {active.department}
            {photos.length > 1 &&
              ` — ${PROJECT_LABELS.gallery} ${photoIndex + 1} ${PROJECT_LABELS.photoOf} ${photos.length}`}
          </p>

          <div className="mt-6">
            <div className="relative aspect-4/3 overflow-hidden bevel bg-navy-950">
              <Image
                key={currentPhoto}
                src={currentPhoto}
                alt={
                  photos.length > 0
                    ? `${active.name}, ${active.department}. ${PROJECT_LABELS.gallery} ${photoIndex + 1} ${PROJECT_LABELS.photoOf} ${photos.length}.`
                    : PROJECT_LABELS.photoAltPending
                }
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent"
              />

              <p
                aria-hidden="true"
                className="stretch-display absolute left-6 top-6 font-display text-display-md font-semibold text-white/90"
              >
                {formatIndex(activeIndex)}
              </p>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <p className="stretch-display text-xl font-semibold text-white sm:text-2xl">
                    {active.name}
                  </p>
                  <p className="mt-1 font-mono text-label uppercase text-navy-200">
                    {active.department}
                  </p>
                </div>
                {photos.length > 1 && (
                  <p className="font-mono text-label tabular text-navy-100">
                    {formatIndex(photoIndex)} / {formatIndex(photos.length - 1)}
                  </p>
                )}
              </div>

              {photos.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3">
                  <button
                    type="button"
                    onClick={() => stepPhoto(-1)}
                    aria-label={PROJECT_LABELS.previousPhoto}
                    className="flex size-11 items-center justify-center bevel-sm bg-navy-950/70 text-white transition-colors duration-300 hover:bg-terracota-500 hover:text-navy-950"
                  >
                    <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepPhoto(1)}
                    aria-label={PROJECT_LABELS.nextPhoto}
                    className="flex size-11 items-center justify-center bevel-sm bg-navy-950/70 text-white transition-colors duration-300 hover:bg-terracota-500 hover:text-navy-950"
                  >
                    <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-navy-950/15 pt-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-label uppercase text-navy-700">
                    {PROJECT_LABELS.startDate}
                  </dt>
                  <dd className="mt-1 font-mono text-label tabular text-navy-950">{active.startDate}</dd>
                </div>
                <div>
                  <dt className="font-mono text-label uppercase text-navy-700">{PROJECT_LABELS.term}</dt>
                  <dd className="mt-1 font-mono text-label tabular text-navy-950">
                    {active.termYears} {PROJECT_LABELS.termUnit}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-label uppercase text-navy-700">
                    {PROJECT_LABELS.luminaires}
                  </dt>
                  <dd className="mt-1 font-mono text-label tabular text-navy-950">
                    {active.luminaires.toLocaleString('es-CO')}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-sm leading-relaxed text-navy-950">{active.object}</p>

              <p className="mt-5 font-mono text-label uppercase text-navy-700">
                {PROJECT_LABELS.contract} {active.contract} · {active.company}
              </p>
            </div>

            {moreHref && (
              <div className="mt-6">
                <ShinyButton href={`${moreHref}#${active.id}`}>{PROJECT_LABELS.moreInfo}</ShinyButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
