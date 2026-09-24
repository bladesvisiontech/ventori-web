import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { DIFFERENTIATORS } from '@/content/differentiators'
import { HOME_SECTIONS } from '@/content/sections'
import { formatIndex } from '@/lib/utils'
import { cmsField } from '@/lib/cms'

/**
 * "Por qué elegirnos", sobre el bloque de terracota.
 *
 * Es el único bloque a color pleno de la página y por eso va aquí: rompe la
 * alternancia navy/papel justo antes del cierre y funciona como acento, no como
 * fondo. Terracota con texto navy da 7.4:1 — es la única forma de usar el color
 * de marca a tamaño de texto sin incumplir AA (ver AGENTS.md).
 *
 * Siete puntos en tres columnas dejan una fila incompleta a propósito: el hueco
 * final airea el bloque y evita el efecto de tabla cerrada.
 */
export function WhyUs({ index }: { index: number }) {
  const copy = HOME_SECTIONS.whyUs

  return (
    <Section tone="terracota" grid cms="nosotros:whyUs">
      <Container>
        <SectionHead
          index={index}
          eyebrow={copy.eyebrow}
          lines={copy.lines}
          intro={copy.intro}
          tone="accent"
          cms="nosotros:whyUs.section"
        />

        <Stagger as="ul" className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map((item, position) => (
            <StaggerItem as="li" key={item.id}>
              <div className="flex items-center gap-3">
                <Icon name={item.icon} className="size-6 text-navy-950" />
                <span className="font-mono text-label tabular text-navy-800">
                  {formatIndex(position)}
                </span>
              </div>

              <h3 className="mt-5 stretch-display text-lg font-semibold leading-snug tracking-tight text-navy-950" {...cmsField(`nosotros:whyUs.items.${position}.title`)}>
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-navy-800" {...cmsField(`nosotros:whyUs.items.${position}.description`)}>
                {item.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  )
}
