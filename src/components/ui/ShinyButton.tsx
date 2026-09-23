import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BaseProps {
  children: React.ReactNode
  className?: string
}

type ShinyButtonProps = BaseProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>)
    | ({ href?: undefined } & Omit<React.ComponentProps<'button'>, 'className'>)
  )

/**
 * Acción principal del sitio: terracota con texto navy (7.4:1) y un borde de
 * luz que gira. Todo el dibujo vive en `styles/shiny-button.css`; aquí solo se
 * decide si el elemento es enlace o botón.
 */
export function ShinyButton({ children, className, ...props }: ShinyButtonProps) {
  const classes = cn('shiny-cta', 'disabled:pointer-events-none disabled:opacity-50', className)
  const content = <span>{children}</span>

  const { href, ...rest } = props

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as Omit<React.ComponentProps<'button'>, 'className'>)}>
      {content}
    </button>
  )
}
