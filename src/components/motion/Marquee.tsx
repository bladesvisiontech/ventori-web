'use client'

import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'
import { cmsField, cmsSection } from '@/lib/cms'

interface MarqueeProps {
  /** Ruta de la lista en el CMS, para la vista previa. */
  cms?: string
  /** Términos que desfilan. Se repiten hasta cubrir el ancho. */
  items: readonly string[]
  /** Píxeles por segundo en reposo. */
  baseSpeed?: number
}

/** Copias de la lista. Tres bastan para cubrir cualquier ancho sin dejar hueco. */
const COPIES = 3

/**
 * Banda de términos que desfila de forma continua y reacciona al scroll:
 * acelera cuando la página baja deprisa y se invierte cuando sube.
 *
 * Es el único movimiento perpetuo del sitio y por eso va en una banda estrecha,
 * en terracota sobre navy, sin nada más compitiendo. Cumple una función: separa
 * dos bloques de contenido denso y le da respiro a la lectura.
 *
 * `data-marquee` lo retira por completo con movimiento reducido, desde
 * `globals.css` — un bucle infinito no se arregla acelerándolo.
 *
 * El desplazamiento se aplica en porcentaje sobre una lista repetida tres veces
 * y se envuelve en el rango [-100 %, 0]: al llegar al final, el salto cae justo
 * donde empieza una copia idéntica y no se percibe corte.
 */
export function Marquee({ items, baseSpeed = 28, cms }: MarqueeProps) {
  const offset = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 400, damping: 50 })
  /* Un scroll rápido ronda los 2000 px/s. Se mapea a un factor de ±4 para que
     la banda acuse el gesto sin llegar a volverse ilegible. */
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 1, 4], {
    clamp: false,
  })

  const x = useTransform(offset, (value) => `${wrap(-100 / COPIES, 0, value)}%`)

  useAnimationFrame((_, delta) => {
    const width = containerRef.current?.offsetWidth ?? 0
    if (width === 0) return

    /* delta llega en milisegundos; baseSpeed está en px/s. El avance se
       convierte a porcentaje del ancho total para que la velocidad percibida no
       dependa del tamaño de la pantalla. */
    const pixels = (baseSpeed * delta) / 1000
    offset.set(offset.get() - (pixels / width) * 100 * velocityFactor.get())
  })

  return (
    <div
      data-marquee
      {...cmsSection(cms)}
      aria-hidden="true"
      className="overflow-hidden border-y border-terracota-600/40 bg-terracota-500 py-4"
    >
      <motion.div ref={containerRef} style={{ x }} className="flex w-max whitespace-nowrap">
        {Array.from({ length: COPIES }).map((_, copy) => (
          <div key={copy} className="flex">
            {items.map((item, position) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center gap-8 px-8 font-mono text-label uppercase text-navy-950"
              >
                <span {...cmsField(cms && `${cms}.${position}`)}>{item}</span>
                <span className="h-1 w-1 shrink-0 bg-navy-950" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/*
 * Nota de accesibilidad: la banda es decorativa y va `aria-hidden`. Los términos
 * que muestra son los mismos que ya aparecen como texto real en las secciones de
 * servicios y sectores, así que ocultarla no retira información. Si algún día
 * lleva contenido único, hay que sacarla del `aria-hidden`.
 */
