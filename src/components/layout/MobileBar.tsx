'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { CONTACT, MOBILE_BAR, NAV_LINKS, ROUTES } from '@/lib/constants'
import { cn, formatIndex } from '@/lib/utils'
import { cmsField, cmsSection } from '@/lib/cms'

/**
 * Navegación de móvil: barra fija al pie y menú a pantalla completa.
 *
 * El botón de menú vivía en la esquina superior derecha del header, que es justo
 * donde no llega el pulgar en un teléfono. Baja al pie, junto a la acción de
 * contacto, que es lo que el usuario va a querer hacer.
 *
 * El menú abierto invierte el sitio: fondo de papel y tipografía navy a gran
 * tamaño, cuando el resto es navy sobre oscuro. Esa inversión es lo que hace que
 * se lea como una capa por encima y no como otra sección más.
 *
 * Todo el componente es `lg:hidden`. En escritorio manda el header, que conserva
 * su navegación horizontal.
 */
export function MobileBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const hasPhone = CONTACT.phone.length > 0

  useEffect(() => {
    if (!open) return

    /* El fondo no debe poder desplazarse detrás del menú. */
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      /* Retención del foco: sin esto el tabulador se va al contenido que hay
         debajo del menú, que el usuario no puede ver. */
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    /* Se captura ahora: para cuando corra la limpieza, `toggleRef.current`
       podría apuntar a otro nodo o a ninguno. */
    const toggle = toggleRef.current

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      /* El foco vuelve al botón que abrió el menú, no al principio del documento. */
      toggle?.focus()
    }
  }, [open])

  const isActive = (href: string) =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/*
        Menú a pantalla completa. Permanece en el árbol y se oculta con `hidden`,
        que además lo retira del orden de tabulación y del árbol de
        accesibilidad. Desmontarlo haría imposible devolver el foco al cerrarlo.
      */}
      <div
        id="menu-movil"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-[70] flex flex-col bg-paper-50 lg:hidden"
      >
        <div className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
          <Logo tone="dark" onNavigate={() => setOpen(false)} />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={MOBILE_BAR.menu.close}
            className="-mr-3 flex size-12 cursor-pointer items-center justify-center text-navy-950"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-7" />
          </button>
        </div>

        {/* `min-h-0` deja que esta zona se encoja y ceda el espacio al pie del
            menú cuando la pantalla es corta; sin él, el CTA se sale abajo. */}
        <nav
          aria-label="Principal (móvil)"
          className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 overflow-y-auto px-6 py-8"
        >
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              /*
               * Retícula de dos columnas y no una fila flexible: con `flex` cada
               * enlace se centra por su cuenta y los índices quedan en un borde
               * izquierdo irregular. Con la primera columna a ancho fijo, los
               * números forman una línea vertical limpia y las etiquetas
               * arrancan todas a la misma altura.
               */
              className="grid w-full max-w-xs grid-cols-[2rem_1fr] items-baseline gap-x-4"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'text-right font-mono text-label tabular',
                  isActive(link.href) ? 'text-terracota-800' : 'text-navy-300',
                )}
              >
                {formatIndex(index)}
              </span>
              <span
                className={cn(
                  'stretch-display py-2 font-display text-4xl font-bold tracking-tight uppercase',
                  isActive(link.href) ? 'text-terracota-800' : 'text-navy-950',
                )}
              >
                <span {...cmsField(link.cms)}>{link.label}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <span aria-hidden="true" className="block h-px w-full bg-paper-300" />

          <Link
            href={MOBILE_BAR.cta.href}
            onClick={() => setOpen(false)}
            className="mt-6 flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 bevel-sm bg-terracota-500 font-mono text-label uppercase text-navy-950"
          >
            <span {...cmsField('global:ui.mobileBar.cta')}>{MOBILE_BAR.cta.label}</span>
            <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
          </Link>
        </div>
      </div>

      {/*
        Barra fija al pie. El relleno inferior respeta el indicador de inicio de
        los iPhone sin gastarlo en los teléfonos que no lo tienen.
      */}
      <nav
        aria-label={MOBILE_BAR.label}
        {...cmsSection('global:mobileBar')}
        className="fixed inset-x-0 bottom-0 z-[60] flex border-t border-paper-300 bg-paper-50 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? MOBILE_BAR.menu.close : MOBILE_BAR.menu.open}
          className="flex min-h-16 flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-navy-950"
        >
          <Menu aria-hidden="true" strokeWidth={1.75} className="size-5" />
          <span className="font-mono text-label uppercase" {...cmsField('global:ui.mobileBar.menu')}>{MOBILE_BAR.menu.label}</span>
        </button>

        {hasPhone && (
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
            className="flex min-h-16 flex-1 cursor-pointer flex-col items-center justify-center gap-1 border-l border-paper-300 text-navy-950"
          >
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
            <span className="font-mono text-label uppercase">{MOBILE_BAR.call.label}</span>
          </a>
        )}

        {/* El CTA ocupa más que las acciones auxiliares: es la única acción
            primaria de la barra y debe leerse como tal sin ambigüedad. */}
        <Link
          href={MOBILE_BAR.cta.href}
          className="flex min-h-16 flex-[1.6] cursor-pointer items-center justify-center gap-3 bg-terracota-500 font-mono text-label uppercase text-navy-950"
        >
          <span {...cmsField('global:ui.mobileBar.cta')}>{MOBILE_BAR.cta.label}</span>
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
        </Link>
      </nav>
    </>
  )
}
