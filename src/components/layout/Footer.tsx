import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import { GridPaper } from '@/components/ui/GridPaper'
import { Container } from '@/components/ui/Container'
import { CONTACT, LEGAL_LINKS, NAV_LINKS, SITE, UI_TEXT, getContactChannels } from '@/lib/constants'

export function Footer() {
  const channels = getContactChannels()
  const year = new Date().getFullYear()

  return (
    <footer className="relative isolate overflow-hidden bg-paper-50 text-navy-950">
      <GridPaper tone="light" />

      <Container className="relative pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-navy-700">
              {SITE.description}
            </p>
          </div>

          <nav aria-label="Pie de página" className="lg:col-span-3">
            <h2 className="font-mono text-label uppercase text-navy-600">{UI_TEXT.footer.navHeading}</h2>
            {/*
              Los enlaces son `flex min-h-11`, no texto suelto: como texto en
              línea el área táctil quedaba en 17 px de alto. El mínimo de 44 px
              se consigue con el propio enlace, para que toda la franja sea
              pulsable y no solo las letras.
            */}
            <ul className="mt-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 items-center text-sm text-navy-950 underline-offset-4 transition-colors duration-200 hover:text-terracota-800 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="font-mono text-label uppercase text-navy-600">{UI_TEXT.footer.contactHeading}</h2>

            {/*
              Solo se listan los canales que ya tienen dato. Mientras el cliente
              no entregue correo, teléfono y dirección, el pie muestra el horario
              y remite al formulario en vez de dejar filas vacías.
            */}
            {channels.length > 0 && (
              <ul className="mt-5 space-y-3">
                {channels.map((channel) => (
                  <li key={channel.id} className="text-sm text-navy-700">
                    <span className="sr-only">{channel.label}: </span>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="inline-flex min-h-11 items-center text-navy-950 underline-offset-4 transition-colors duration-200 hover:text-terracota-800 hover:underline"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      channel.value
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 text-sm text-navy-700">
              <p>{CONTACT.schedule.days}</p>
              <p className="tabular">{CONTACT.schedule.hours}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-label uppercase text-navy-600">
            © {year} {SITE.legalName}
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-mono text-label uppercase text-navy-700 underline-offset-4 transition-colors duration-200 hover:text-terracota-800 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-mono text-label uppercase text-navy-600">{SITE.tagline}</p>
        </div>

        {/*
          Marca de agua con el nombre, recortada por el borde inferior del pie.
          Es decorativa: el nombre ya está en el logotipo y en el copyright, así
          que va `aria-hidden`. El tamaño sigue el ancho del contenedor (unos 7
          em para "Grupo Ventori") y se topa en escritorio para no crecer sin
          límite en pantallas anchas.
        */}
        <p
          aria-hidden="true"
          className="stretch-display -mb-[0.2em] mt-10 select-none whitespace-nowrap text-center font-display text-[min(12vw,10.5rem)] font-semibold leading-none text-navy-950/[0.06]"
        >
          {SITE.name}
        </p>
      </Container>
    </footer>
  )
}
