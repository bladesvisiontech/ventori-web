'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { COLOMBIA_MAP_VIEWBOX, DEPARTMENT_PATHS } from '@/content/projects-map'
import { ROUTES } from '@/lib/constants'
import { cn, formatIndex } from '@/lib/utils'
import type { ConcessionProject } from '@/types/content'

interface ProjectExplorerProps {
  projects: readonly ConcessionProject[]
  /** Cabecera de la sección, a ancho completo sobre el mapa. */
  children: React.ReactNode
}

/** Extrae ancho y alto de un `viewBox` "0 0 W H" para calcular posiciones en %. */
function parseViewBox(viewBox: string) {
  const [, , width, height] = viewBox.split(' ').map(Number)
  return { width, height }
}

/**
 * Mapa político de Colombia (los 32 departamentos) + selector de proyecto +
 * carrusel de foto, en un solo componente interactivo.
 *
 * Es la única pieza de la home con estado, así que se mantiene aparte de
 * `<ProjectsMap>`: la sección en sí sigue siendo un Server Component. La
 * cabecera llega como `children` desde el servidor.
 *
 * Orden deliberado: mapa, luego los chips numerados, y la información del
 * proyecto seleccionado siempre debajo de los chips, nunca al lado ni encima
 * — es el dato que el usuario vino a buscar tras elegir, así que no compite
 * por atención con el selector.
 */
export function ProjectExplorer({ projects, children }: ProjectExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = projects[activeIndex]
  const { width, height } = parseViewBox(COLOMBIA_MAP_VIEWBOX)

  const activeDepartments = new Set(projects.map((project) => project.department))

  const goTo = (nextIndex: number) => {
    setActiveIndex((nextIndex + projects.length) % projects.length)
  }

  if (!active) return null

  return (
    <div className="mt-16">
      {children}

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Mapa político */}
        <Reveal className="lg:col-span-7">
          <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
            <svg viewBox={COLOMBIA_MAP_VIEWBOX} className="absolute inset-0 size-full" aria-hidden="true">
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
                  onClick={() => setActiveIndex(position)}
                  aria-pressed={isActive}
                  aria-label={`${project.name}, ${project.department}`}
                  title={project.name}
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

            {projects.map((project, position) => {
              const isActive = project.id === active.id

              return (
                <button
                  key={`label-${project.id}`}
                  type="button"
                  onClick={() => setActiveIndex(position)}
                  aria-hidden="true"
                  tabIndex={-1}
                  className={cn(
                    'absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 font-mono text-label uppercase transition-colors duration-300',
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

        {/* Chips + información del proyecto activo, siempre debajo de los chips */}
        <div className="lg:col-span-5">
          <ul className="flex flex-wrap gap-2">
            {projects.map((project, position) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(position)}
                  aria-current={project.id === active.id}
                  className={cn(
                    'flex items-center gap-2 bevel-sm px-3 py-2.5 font-mono text-label transition-colors duration-300',
                    project.id === active.id
                      ? 'bg-navy-950 text-white'
                      : 'bg-navy-950/5 text-navy-700 hover:bg-navy-950/10',
                  )}
                >
                  <span className="tabular text-terracota-800">{formatIndex(position)}</span>
                  <span className="uppercase">{project.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <div className="relative aspect-4/3 overflow-hidden bevel bg-navy-950">
              <Image
                key={active.id}
                src={active.images?.[0] ?? '/media/placeholder.svg'}
                alt={
                  active.images
                    ? `${active.name}, ${active.department}`
                    : 'Foto pendiente del cliente'
                }
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent"
              />

              <p className="stretch-display absolute left-6 top-6 font-display text-display-md font-semibold text-white/90">
                {formatIndex(activeIndex)}
              </p>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="stretch-display text-xl font-semibold text-white sm:text-2xl">
                  {active.name}
                </p>
                <p className="mt-1 font-mono text-label uppercase text-navy-200">
                  {active.department}
                </p>
              </div>

              {projects.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3">
                  <button
                    type="button"
                    onClick={() => goTo(activeIndex - 1)}
                    aria-label="Proyecto anterior"
                    className="flex size-9 items-center justify-center bevel-sm bg-navy-950/70 text-white transition-colors duration-300 hover:bg-terracota-500 hover:text-navy-950"
                  >
                    <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(activeIndex + 1)}
                    aria-label="Proyecto siguiente"
                    className="flex size-9 items-center justify-center bevel-sm bg-navy-950/70 text-white transition-colors duration-300 hover:bg-terracota-500 hover:text-navy-950"
                  >
                    <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Datos del contrato, debajo de la foto, sobre papel. */}
            <div className="mt-6 border-t border-navy-950/15 pt-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-label uppercase text-navy-500">Fecha de inicio</p>
                  <p className="mt-1 font-mono text-label tabular text-navy-950">{active.startDate}</p>
                </div>
                <div>
                  <p className="font-mono text-label uppercase text-navy-500">Vigencia</p>
                  <p className="mt-1 font-mono text-label tabular text-navy-950">{active.termYears} años</p>
                </div>
                <div>
                  <p className="font-mono text-label uppercase text-navy-500">N.º luminarias</p>
                  <p className="mt-1 font-mono text-label tabular text-navy-950">
                    {active.luminaires.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-navy-950">{active.object}</p>

              <p className="mt-5 font-mono text-label uppercase text-navy-700">
                Contrato {active.contract} · {active.company}
              </p>
            </div>

            <div className="mt-6">
              <ShinyButton href={ROUTES.projects}>Más información</ShinyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
