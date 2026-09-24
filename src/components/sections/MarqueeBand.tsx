import { Marquee } from '@/components/motion/Marquee'
import { MARQUEE_TERMS } from '@/content/sections'

/**
 * Banda de términos entre dos bloques densos.
 *
 * Cumple una función de ritmo: separa el mosaico de sectores del argumento de
 * empresa y le da a la página un respiro sin introducir una sección más que
 * leer. Es decorativa y va oculta a lectores de pantalla — todos sus términos
 * aparecen como texto real en servicios y sectores.
 */
export function MarqueeBand() {
  return <Marquee items={MARQUEE_TERMS} cms="servicios:marquee" />
}
