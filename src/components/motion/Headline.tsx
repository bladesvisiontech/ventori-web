'use client'

import { motion } from 'framer-motion'
import { entranceTriggerProps, type EntranceTrigger } from '@/components/motion/entrance'
import { MOTION } from '@/lib/constants'
import { cmsField } from '@/lib/cms'
import { cn } from '@/lib/utils'
import type { HeadlineLine } from '@/types/content'

interface HeadlineProps {
  /** Ruta del titular para la vista previa del CMS ("archivo:ruta"). */
  cms?: string
  /** Para titulares que en el CMS son un solo texto (no una lista de líneas). */
  cmsSingle?: string
  /**
   * Las líneas se declaran en `content/`, no se calculan midiendo el texto
   * renderizado. Medir obligaría a un efecto en cliente y a un salto de layout
   * en el primer pintado, justo en el elemento más grande de la página; además
   * el corte de un titular es una decisión editorial, no un accidente del ancho
   * disponible.
   */
  lines: readonly HeadlineLine[]
  /** Nivel semántico. El tamaño va por `className`, no por el nivel. */
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  /** Retraso inicial, para encadenar el titular con lo que lo precede. */
  delay?: number
  /**
   * Color de las líneas marcadas como acento. Depende de la superficie: la
   * terracota de marca solo alcanza AA sobre navy, así que sobre papel hay que
   * pasar un tono más oscuro y sobre terracota, navy (ver AGENTS.md).
   */
  accentClassName?: string
  /** `mount` para lo que ya está en pantalla al cargar. Ver `entrance.ts`. */
  trigger?: EntranceTrigger
}

/**
 * Variante de línea. El retraso llega por `custom`, que framer pasa a la función
 * de la variante: así el escalonado se calcula en el sistema de animación y no
 * duplicando `transition` en cada línea.
 */
const LINE = {
  hidden: { opacity: 0, y: '100%' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.slow, delay, ease: MOTION.ease },
  }),
}

/**
 * Revelado de titular línea por línea: cada línea sube desde debajo de su propia
 * caja, escalonada respecto a la anterior.
 *
 * Es el movimiento firma del sitio y el único que se permite durar casi un
 * segundo, porque comunica jerarquía —la primera línea manda— en vez de decorar.
 *
 * Cada línea va en un contenedor con `overflow-hidden`. El relleno inferior
 * compensa ese recorte: sin él las astas descendentes (g, j, p, y) quedan
 * cortadas cuando la línea llega a su posición final.
 *
 * Quien observa el viewport es el titular completo, no cada línea. Las líneas
 * arrancan desplazadas una caja entera hacia abajo y recortadas, así que su área
 * visible inicial es cero y el navegador nunca las daría por dentro del
 * viewport: se quedarían invisibles de forma permanente.
 */
export function Headline({
  lines,
  as = 'h2',
  className,
  delay = 0,
  accentClassName = 'text-terracota-500',
  trigger = 'view',
  cms,
  cmsSingle,
}: HeadlineProps) {
  const Tag = motion[as]

  return (
    <Tag className={cn('stretch-display', className)} {...entranceTriggerProps(trigger)}>
      {lines.map((line, index) => {
        const text = typeof line === 'string' ? line : line.text
        const accent = typeof line === 'string' ? false : Boolean(line.accent)

        return (
          <span key={text} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <motion.span
              data-reveal
              className={cn('block', accent && accentClassName)}
              variants={LINE}
              custom={delay + index * MOTION.staggerLines}
              {...cmsField(cmsSingle ?? (cms && `${cms}.${index}`))}
            >
              {text}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}
