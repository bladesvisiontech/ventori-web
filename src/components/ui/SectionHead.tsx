import { Headline } from '@/components/motion/Headline'
import { Reveal } from '@/components/motion/Reveal'
import type { EntranceTrigger } from '@/components/motion/entrance'
import { Rule } from '@/components/motion/Rule'
import { cn, formatIndex } from '@/lib/utils'
import type { HeadlineLine } from '@/types/content'

/** Superficie sobre la que se apoya la cabecera. Decide todos sus colores. */
type HeadTone = 'dark' | 'light' | 'accent'

interface SectionHeadProps {
  /** Índice de la sección dentro de la página, empezando en 0. */
  index: number
  /** Nombre corto de la sección, en monoespaciada. */
  eyebrow: string
  lines: readonly HeadlineLine[]
  /** Párrafo de entrada. Opcional: no toda sección necesita bajada. */
  intro?: string
  tone?: HeadTone
  /** Tamaño del titular. `lg` para la apertura de una página. */
  size?: 'md' | 'lg'
  className?: string
  /** `h1` cuando la cabecera abre la página, sin hero encima. */
  as?: 'h1' | 'h2'
  /** `mount` cuando la cabecera está en pantalla al cargar (ver AGENTS.md). */
  trigger?: EntranceTrigger
}

/*
 * Un juego de colores por superficie, con el contraste verificado pieza a pieza.
 * Se declara aquí en vez de resolverlo con `currentColor` porque cada elemento
 * de la cabecera necesita un peso distinto, y el que sirve sobre navy no sirve
 * sobre terracota.
 *
 *   dark   · sobre navy-950:      índice 7.4:1 · eyebrow 9.4:1 · texto 12.6:1
 *   light  · sobre paper-50:      índice 6.9:1 · eyebrow 11.9:1 · texto 11.9:1
 *   accent · sobre terracota-500: índice 7.4:1 · eyebrow 5.8:1 · texto 5.8:1
 *
 * La terracota de marca nunca aparece como texto sobre claro: da 2.7:1 y no
 * pasa AA (ver AGENTS.md). Por eso `light` usa terracota-800 y `accent` navy.
 */
const TONES = {
  dark: {
    index: 'text-terracota-500',
    rule: 'text-navy-600',
    eyebrow: 'text-navy-200',
    title: 'text-white',
    /* 7.4:1 sobre navy-950 */
    accent: 'text-terracota-500',
    intro: 'text-navy-100',
  },
  light: {
    index: 'text-terracota-800',
    rule: 'text-paper-300',
    eyebrow: 'text-navy-700',
    title: 'text-navy-950',
    /* 7.6:1 sobre paper-50. La terracota-500 daría 2.7:1 y no pasa AA. */
    accent: 'text-terracota-800',
    intro: 'text-navy-700',
  },
  accent: {
    index: 'text-navy-950',
    rule: 'text-navy-800/40',
    eyebrow: 'text-navy-800',
    title: 'text-navy-950',
    /* 5.8:1 sobre terracota-500 */
    accent: 'text-navy-800',
    intro: 'text-navy-800',
  },
} as const satisfies Record<HeadTone, Record<string, string>>

/**
 * Cabecera de sección: índice numerado, regla que se traza, titular que sube
 * línea a línea y bajada.
 *
 * Se repite en todas las secciones de todas las páginas y es lo que le da al
 * sitio el aire de documento técnico numerado. La secuencia está cronometrada
 * para leerse en orden —primero el índice, después la línea de cota, luego el
 * titular, al final la bajada—, por eso los retardos son fijos.
 */
export function SectionHead({
  index,
  eyebrow,
  lines,
  intro,
  tone = 'dark',
  size = 'md',
  className,
  as = 'h2',
  trigger = 'view',
}: SectionHeadProps) {
  const palette = TONES[tone]

  return (
    <div className={cn('max-w-3xl', className)}>
      <Reveal trigger={trigger}>
        <div className="flex items-center gap-4">
          <span className={cn('font-mono text-label tabular', palette.index)}>
            {formatIndex(index)}
          </span>

          <Rule trigger={trigger} className={cn('w-10 flex-none', palette.rule)} delay={0.1} />

          <span className={cn('font-mono text-label uppercase', palette.eyebrow)}>{eyebrow}</span>
        </div>
      </Reveal>

      <Headline
        as={as}
        trigger={trigger}
        lines={lines}
        delay={0.15}
        accentClassName={palette.accent}
        className={cn(
          'mt-7 font-semibold',
          size === 'lg' ? 'text-display-lg' : 'text-display-md',
          palette.title,
        )}
      />

      {intro && (
        <Reveal trigger={trigger} delay={0.25}>
          <p className={cn('mt-7 max-w-2xl text-base leading-relaxed sm:text-lg', palette.intro)}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  )
}
