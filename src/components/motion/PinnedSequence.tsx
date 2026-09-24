'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useInView } from 'framer-motion'
import { cn, formatIndex } from '@/lib/utils'
import type { Pillar } from '@/types/content'

interface PinnedSequenceProps {
  items: readonly Pillar[]
}

interface PhaseProps {
  item: Pillar
  index: number
  /** La última fase no reserva pantalla completa. Ver el comentario en el JSX. */
  last: boolean
  onEnter: (index: number) => void
}

/*
 * Márgenes que reducen el viewport a una franja central de una línea de alto.
 * Una fase pasa a activa cuando su bloque cruza el centro exacto de la
 * pantalla, no cuando asoma por abajo: si se activara al asomar, dos fases
 * consecutivas estarían activas a la vez durante casi todo el recorrido.
 */
const CENTER_BAND = '-50% 0px -50% 0px'

function Phase({ item, index, last, onEnter }: PhaseProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: CENTER_BAND })

  /* En efecto y no durante el render: avisar al padre mientras se renderiza un
     hijo es una actualización de estado en fase de render, y React la rechaza. */
  useEffect(() => {
    if (inView) onEnter(index)
  }, [inView, index, onEnter])

  return (
    /*
     * Cada fase ocupa una pantalla completa: es lo que le da al usuario tiempo
     * de leerla antes de que la fotografía funda a la siguiente.
     *
     * La última es la excepción. Al centrar su texto en una pantalla entera
     * dejaría media pantalla vacía por debajo, ya sin fotografía fija que la
     * sostenga, y la sección siguiente empezaría tras medio viewport en blanco.
     */
    <div
      ref={ref}
      className={cn(
        'flex flex-col justify-center py-16 lg:py-24',
        last ? 'min-h-[60vh] lg:min-h-[62vh] lg:pb-0' : 'min-h-[70vh] lg:min-h-screen',
      )}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-label tabular text-terracota-500">
          {formatIndex(index)}
        </span>
        <span className="font-mono text-label uppercase text-navy-200">{item.label}</span>
      </div>

      <h3 className="mt-6 stretch-display text-display-sm text-white">{item.title}</h3>

      <p className="mt-5 max-w-md text-base leading-relaxed text-navy-100 sm:text-lg">
        {item.description}
      </p>

      {/*
        En móvil cada fase lleva su propia imagen: la columna fija de escritorio
        no cabe. `sizes` devuelve 1 px por encima de 1024 para que el navegador
        elija la candidata más pequeña del srcset y no descargue dos veces la
        misma fotografía.
      */}
      <div className="relative mt-8 aspect-4/3 w-full overflow-hidden bevel lg:hidden">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 1px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}

/**
 * Secuencia de fases con la fotografía fijada al viewport.
 *
 * Es el momento largo de la página: en escritorio la imagen se queda quieta
 * mientras el texto de cada fase la atraviesa, y funde a la siguiente cuando esa
 * fase alcanza el centro de la pantalla. El scroll deja de mover cajas y pasa a
 * mover el contenido de una sola caja, que es lo que da la sensación de recorrer
 * un proyecto por etapas en vez de leer tres tarjetas.
 *
 * En móvil la columna fija no cabe: cada fase se convierte en un bloque normal
 * con su propia imagen, y el recorrido se lee igual de ordenado.
 *
 * No se apoya en el progreso del scroll sino en qué bloque cruza el centro, así
 * que la sección se comporta igual aunque una fase tenga el doble de texto que
 * las otras. El fundido es una transición CSS, de modo que la regla global de
 * movimiento reducido lo anula sin que este componente tenga que consultarla.
 */
export function PinnedSequence({ items }: PinnedSequenceProps) {
  const [active, setActive] = useState(0)

  /* Estable entre renders: si cambiara de identidad, el `useInView` de cada
     fase reejecutaría su efecto en cada render del padre. */
  const handleEnter = useCallback((index: number) => {
    setActive((current) => (current === index ? current : index))
  }, [])

  return (
    <div className="grid gap-x-16 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        {items.map((item, index) => (
          <Phase
            key={item.id}
            item={item}
            index={index}
            last={index === items.length - 1}
            onEnter={handleEnter}
          />
        ))}
      </div>

      <div className="order-1 hidden lg:order-2 lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="relative aspect-3/4 w-full overflow-hidden bevel">
            {items.map((item, index) => (
              <Image
                key={item.id}
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 1px"
                priority={index === 0}
                className={cn(
                  'object-cover transition-opacity duration-700 ease-[var(--ease-in-out-soft)]',
                  index === active ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}

            {/* Índice de la fase activa, sobre la fotografía. */}
            <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-navy-950 px-5 py-4">
              <span className="font-mono text-label tabular text-terracota-500">
                {formatIndex(active)}
              </span>
              <span className="h-px w-8 bg-navy-600" />
              <span className="font-mono text-label tabular text-navy-200">
                {formatIndex(items.length - 1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
