import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { HOME_SECTIONS } from '@/content/sections'
import { SERVICES } from '@/content/services'
import { ROUTES } from '@/lib/constants'
import { cmsField } from '@/lib/cms'
import { formatIndex } from '@/lib/utils'

/**
 * Los nueve servicios como índice numerado, no como retícula de tarjetas.
 * Apertura de `/servicios`, antes de `<ServicesDetail>`.
 *
 * Nueve tarjetas iguales serían una pared sin jerarquía y obligarían a recortar
 * los títulos, que aquí son largos y específicos por decisión del cliente. Un
 * índice a ancho completo los deja respirar, se lee como el sumario de un
 * documento técnico y encaja con la numeración que ya recorre todo el sitio.
 *
 * Cada fila entra escalonada y, al pasar el cursor, se desplaza a la derecha
 * como una ficha que se saca del archivador. Cada enlace baja al bloque de
 * detalle del mismo servicio, más abajo en esta misma página.
 */
export function ServicesIndex({ index }: { index: number }) {
  const copy = HOME_SECTIONS.services

  return (
    <Section tone="navy" grid cms="servicios:index">
      <Container>
        <SectionHead
          index={index}
          eyebrow={copy.eyebrow}
          lines={copy.lines}
          intro={copy.intro}
          cms="servicios:index"
          className="lg:max-w-2xl"
        />

        <Stagger as="ul" className="mt-16 border-t border-navy-800" delay={0.1}>
          {SERVICES.map((service, position) => (
            <StaggerItem as="li" key={service.id} className="border-b border-navy-800">
              <Link
                href={`${ROUTES.services}#${service.id}`}
                className="group flex items-start gap-5 py-7 transition-transform duration-400 ease-[var(--ease-out-soft)] hover:translate-x-2 focus-visible:translate-x-2 sm:gap-8"
              >
                <span className="mt-1 font-mono text-label tabular text-terracota-500">
                  {formatIndex(position)}
                </span>

                <Icon
                  name={service.icon}
                  className="mt-0.5 hidden size-6 shrink-0 text-navy-300 transition-colors duration-300 group-hover:text-terracota-500 sm:block"
                />

                <div className="flex-1">
                  <h3 className="stretch-display text-lg font-semibold tracking-tight text-white sm:text-xl lg:text-2xl" {...cmsField(`servicios:services.${position}.title`)}>
                    {service.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200 sm:text-base" {...cmsField(`servicios:services.${position}.summary`)}>
                    {service.summary}
                  </p>
                </div>

                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-1 size-5 shrink-0 text-navy-400 transition-all duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:text-terracota-500 group-focus-visible:text-terracota-500"
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  )
}
