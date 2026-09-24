'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/layout/Logo'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { NAV_LINKS, ROUTES, TRANSPARENT_HEADER_ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

/** Desplazamiento a partir del cual el header deja de ser transparente. */
const SOLID_AT = 24

/**
 * Cabecera fija.
 *
 * En móvil solo lleva el logotipo: la navegación vive en `<MobileBar />`, al pie,
 * donde llega el pulgar. Aquí arriba quedaba en la esquina superior derecha, que
 * es el punto más incómodo de una pantalla de teléfono.
 */
export function Header() {
  const pathname = usePathname()
  const [solid, setSolid] = useState(false)

  /*
   * El header arranca transparente sobre el hero y se vuelve sólido en cuanto
   * la página se mueve. `passive` porque el manejador nunca cancela el evento y
   * marcarlo permite al navegador seguir haciendo scroll sin esperarlo.
   */
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > SOLID_AT)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isSolid = solid || !TRANSPARENT_HEADER_ROUTES.includes(pathname)

  const isActive = (href: string) =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-(--header-height) transition-colors duration-300 lg:h-(--header-height-lg)',
        isSolid ? 'bg-navy-950/95 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      {/* Filo inferior. Se desvanece con el header transparente en vez de
          aparecer de golpe al empezar a desplazar. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-0 h-px bg-navy-700 transition-opacity duration-300',
          isSolid ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="mx-auto flex h-full max-w-[100rem] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)

            return (
              /*
               * El enlace mide 44 px de alto —mínimo táctil de HIG, y 1024 px
               * puede ser una tablet— mientras que el subrayado se ancla al
               * `<span>` del texto. Si colgara del enlace quedaría a 15 px por
               * debajo de las letras, flotando.
               */
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className="group flex min-h-11 items-center font-mono text-label uppercase text-navy-100 transition-colors duration-200 hover:text-white"
              >
                <span className="relative">
                  {link.label}
                  {/* Presente y al 100 % en la ruta activa; trazado desde la
                      izquierda al pasar el cursor por las demás. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-1.5 h-px origin-left bg-terracota-500 transition-transform duration-300 ease-[var(--ease-out-soft)]',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <ShinyButton href={ROUTES.contact} className="min-h-11 px-6 py-2 text-sm">
            Hablemos
          </ShinyButton>
        </div>
      </div>
    </header>
  )
}
