import Link from 'next/link'
import { ROUTES, SITE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { cmsField } from '@/lib/cms'

interface LogoProps {
  className?: string
  /** Sobre fondo claro el texto va en navy; sobre navy, en blanco. */
  tone?: 'dark' | 'light'
  /**
   * Se dispara al pulsar. Lo usa el menú móvil para cerrarse: sin esto, tocar el
   * logotipo navegaría al inicio dejando el menú abierto por encima.
   */
  onNavigate?: () => void
}

/**
 * Logotipo: isotipo en SVG inline más el nombre de marca.
 *
 * El isotipo se dibuja aquí y no se carga desde `/logo.svg` porque el archivo
 * oficial trae el texto en navy fijo, y sobre fondo oscuro desaparecería. Las
 * cuatro vigas son las del original, verificadas contra `public/logo.svg`; lo
 * único que cambia es que el nombre se compone con la tipografía del sitio y
 * hereda el color.
 *
 * El enlace envuelve marca y nombre en un solo destino, con `aria-label`, para
 * que un lector de pantalla anuncie "Ventori, inicio" en vez de leer el trazado.
 */
export function Logo({ className, tone = 'light', onNavigate }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${SITE.name}, ir al inicio`}
      onClick={onNavigate}
      /* `py-2` no es aire visual: eleva el área táctil del enlace de 32 px a los
         48 que exigen HIG y Material. El logotipo es el único camino de vuelta al
         inicio desde una página interna. */
      className={cn('group inline-flex items-center gap-3 py-2', className)}
    >
      <svg
        viewBox="0 0 58.84 64.85"
        aria-hidden="true"
        className="h-8 w-auto shrink-0 fill-terracota-500 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 lg:h-9"
      >
        <path d="M26.75,0v12.35l-10.7,6.17-1.81,1.05c-2.19,1.26-3.54,3.6-3.54,6.12v29.89l-8.02-4.63c-1.66-.96-2.68-2.73-2.68-4.64v-27.78c0-1.92,1.02-3.69,2.68-4.64l8.02-4.63,5.35-3.09L26.75,0Z" />
        <path d="M26.75,18.53v46.32l-8.02-4.63c-1.66-.96-2.68-2.73-2.68-4.64v-27.78c0-1.92,1.02-3.69,2.68-4.64l8.02-4.63Z" />
        <path d="M58.84,18.54v27.78c0,1.92-1.02,3.69-2.68,4.64l-8.02,4.63-5.35,3.09-10.7,6.17v-12.35l10.7-6.18,1.81-1.05c2.19-1.26,3.54-3.6,3.54-6.12V9.26l8.02,4.63c1.66.96,2.68,2.73,2.68,4.64Z" />
        <path d="M42.79,9.27v27.78c0,1.92-1.02,3.69-2.68,4.64l-8.02,4.63V0l8.02,4.63c1.66.96,2.68,2.73,2.68,4.64Z" />
      </svg>

      <span
        className={cn(
          'stretch-display font-display text-lg font-semibold tracking-tight',
          tone === 'light' ? 'text-white' : 'text-navy-950',
        )}
      >
        <span {...cmsField('global:site.name')}>{SITE.name}</span>
      </span>
    </Link>
  )
}
