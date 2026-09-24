import { GridPaper } from '@/components/ui/GridPaper'
import { cn } from '@/lib/utils'
import { cmsSection } from '@/lib/cms'

export type SectionTone = 'navy' | 'deep' | 'paper' | 'terracota'

interface SectionProps {
  children: React.ReactNode
  className?: string
  /** Ancla para la navegación interna. */
  id?: string
  tone?: SectionTone
  /** Ritmo vertical. `tight` para bandas, `loose` para bloques con fotografía. */
  spacing?: 'tight' | 'default' | 'loose' | 'none'
  /** Retícula técnica de fondo. Se apaga donde hay fotografía a sangre. */
  grid?: boolean
  /** Sección del CMS a la que corresponde ("archivo:clave"), para la vista previa. */
  cms?: string
}

/*
 * El color de texto se declara junto al fondo, nunca por separado. Es lo que
 * impide que una sección herede el blanco del `body` sobre un fondo claro, que
 * es el fallo de contraste más fácil de introducir sin darse cuenta.
 */
const TONES = {
  navy: 'bg-navy-950 text-white',
  deep: 'bg-navy-975 text-white',
  paper: 'bg-paper-50 text-navy-950',
  terracota: 'bg-terracota-500 text-navy-950',
} as const satisfies Record<SectionTone, string>

const SPACING = {
  tight: 'py-16 sm:py-20',
  default: 'py-20 sm:py-28 lg:py-36',
  loose: 'py-28 sm:py-36 lg:py-48',
  none: '',
} as const

/**
 * Bloque de página: fondo, ritmo vertical y retícula de fondo.
 *
 * La alternancia de tonos es lo que marca el avance del scroll. Dos secciones
 * seguidas con el mismo tono se leen como una sola, así que el orden de tonos se
 * decide en la página, no aquí.
 */
export function Section({
  children,
  className,
  id,
  tone = 'navy',
  spacing = 'default',
  grid = false,
  cms,
}: SectionProps) {
  return (
    /*
     * `overflow-clip` y no `overflow-hidden`. Los dos recortan igual, pero
     * `hidden` convierte la sección en contenedor de scroll, y eso deja sin
     * efecto cualquier `position: sticky` que haya dentro: la secuencia de fases
     * dejaba de fijarse al viewport.
     */
    <section
      id={id}
      {...cmsSection(cms)}
      className={cn('relative isolate overflow-clip', TONES[tone], SPACING[spacing], className)}
    >
      {grid && <GridPaper tone={tone === 'paper' || tone === 'terracota' ? 'light' : 'dark'} />}
      <div className="relative">{children}</div>
    </section>
  )
}
