import Image from 'next/image'
import { Parallax } from '@/components/motion/Parallax'
import type { MediaImage } from '@/types/content'
import { cn } from '@/lib/utils'

interface MediaFrameProps {
  image: MediaImage
  /** Proporción del marco. La fotografía se recorta para llenarlo. */
  ratio?: 'portrait' | 'landscape' | 'square' | 'wide' | 'fill'
  /** Descriptor de anchos para el srcset. Sin él el navegador asume 100vw. */
  sizes: string
  /** Solo para la imagen que compite por ser el LCP de la página. */
  priority?: boolean
  /** Desactiva el parallax donde el marco ya está en movimiento por otra causa. */
  parallax?: boolean
  className?: string
  /** Capa opcional sobre la fotografía: pie de foto, índice, velo. */
  children?: React.ReactNode
}

const RATIOS = {
  portrait: 'aspect-3/4',
  landscape: 'aspect-4/3',
  square: 'aspect-square',
  wide: 'aspect-16/9',
  fill: 'h-full',
} as const

/**
 * Marco de fotografía con el bisel de marca.
 *
 * Toda la fotografía del sitio pasa por aquí, y esa es la razón de que el bisel
 * se lea como sistema y no como capricho: aparece siempre en las mismas dos
 * esquinas y con el mismo tamaño relativo.
 *
 * El espacio lo reserva la proporción del marco, así que el bloque no salta
 * (CLS) aunque la foto se sustituya desde el CMS por otra de distinto tamaño.
 */
export function MediaFrame({
  image,
  ratio = 'landscape',
  sizes,
  priority = false,
  parallax = true,
  className,
  children,
}: MediaFrameProps) {

  const photo = (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  )

  return (
    <div className={cn('relative overflow-hidden bevel', RATIOS[ratio], className)}>
      {parallax ? <Parallax>{photo}</Parallax> : photo}
      {children}
    </div>
  )
}
