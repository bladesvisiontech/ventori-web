'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { HERO_CLIPS } from '@/content/hero-video'
import { cn } from '@/lib/utils'

/**
 * Milisegundos que permanece cada clip antes de fundir al siguiente.
 *
 * Hoy no llega a usarse: `HERO_CLIPS` tiene un solo vídeo, que es un montaje ya
 * cortado, y el ciclo no se activa por debajo de dos. Se conserva porque el
 * componente sigue aceptando varios y volver a poner dos sería solo añadirlos.
 */
const CLIP_DURATION = 7000

/**
 * Fondo del hero.
 *
 * Decisiones que importan:
 *
 * - Los vídeos van silenciados, sin controles y `aria-hidden`: son ambientación,
 *   no contenido. Nada de lo que dicen es información que se pierda.
 * - El `poster` pinta el primer fotograma sin esperar al mp4, así el LCP no
 *   depende de la descarga del vídeo.
 * - Solo se reproduce el clip visible. Con `autoPlay` en los tres, los tres
 *   decodifican a la vez y consumen CPU sin que se vean.
 * - Con movimiento reducido no se reproduce nada ni se descarga ningún mp4: se
 *   queda el póster del primer clip como imagen fija.
 *
 * El markup es idéntico en los dos casos, incluido `preload`. La preferencia
 * solo cambia lo que hacen los efectos: renderizar `<img>` en un caso y `<video>`
 * en el otro rompía la hidratación, porque `useReducedMotion()` devuelve valores
 * distintos en servidor y en cliente.
 */
export function HeroVideo() {
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion || HERO_CLIPS.length < 2) return

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % HERO_CLIPS.length)
    }, CLIP_DURATION)

    return () => clearInterval(timer)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return

    videoRefs.current.forEach((video, index) => {
      if (!video) return

      if (index === active) {
        /* La descarga se pide aquí y no con un atributo, para no alterar el
           markup servido: así quien tiene movimiento reducido nunca llega a
           bajar el mp4. */
        if (video.preload !== 'auto') {
          video.preload = 'auto'
          video.load()
        }
        video.currentTime = 0
        void video.play().catch(() => {
          /* Si el navegador bloquea la reproducción automática, queda el póster. */
        })
      } else {
        video.pause()
      }
    })
  }, [active, prefersReducedMotion])

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-950" aria-hidden="true">
      {HERO_CLIPS.map((clip, index) => (
        <div
          key={clip.src}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-[var(--ease-in-out-soft)]',
            index === active ? 'opacity-100' : 'opacity-0',
          )}
        >
          <video
            ref={(node) => {
              videoRefs.current[index] = node
            }}
            src={clip.src}
            poster={clip.poster}
            muted
            loop
            playsInline
            preload="none"
            className="size-full object-cover"
          />
        </div>
      ))}

      {/*
        Tres capas de velo, cada una con un trabajo distinto:
        el plano general baja la luminancia de toda la fotografía; el degradado
        inferior asienta el titular sobre la zona más oscura; el lateral abre
        contraste en el borde izquierdo, que es donde arranca la lectura.
      */}
      <div className="absolute inset-0 bg-navy-950/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/15 to-navy-950/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/75 via-navy-950/45 via-45% to-transparent to-75% max-sm:from-navy-950/60 max-sm:via-navy-950/55 max-sm:to-navy-950/40" />
    </div>
  )
}
