import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Section } from '@/components/ui/Section'
import { SECTORS } from '@/content/sectors'
import { cn, formatIndex } from '@/lib/utils'

/**
 * Detalle de los siete sectores, alternando el lado de la fotografía.
 *
 * La alternancia no es adorno: siete bloques idénticos apilados se leen como
 * una lista y el usuario deja de mirarlos hacia el tercero. Cambiar el lado
 * obliga a la vista a recolocarse en cada uno.
 *
 * Cada bloque lleva `id` porque el mosaico de la home enlaza a `#sector`.
 *
 * Va sobre papel: `<SectorsMosaic>` justo encima ya cubrió el momento oscuro
 * de fotografía a sangre, y repetir navy aquí dejaba `/sectores` sin un solo
 * respiro claro. El índice y el icono usan terracota-800, no terracota-500 —
 * en claro esa es la única combinación que pasa AA (ver AGENTS.md).
 */
export function SectorsGrid() {
  return (
    <Section tone="paper" grid>
      <Container>
        <div className="space-y-20 lg:space-y-32">
          {SECTORS.map((sector, position) => {
            /* Impares con la fotografía a la izquierda en escritorio. */
            const flipped = position % 2 === 1

            return (
              <article
                key={sector.id}
                id={sector.id}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20"
              >
                <Reveal
                  mask
                  from="bottom"
                  className={cn(flipped ? 'lg:order-2' : 'lg:order-1')}
                >
                  <MediaFrame
                    media={sector.media}
                    ratio="landscape"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </Reveal>

                <div className={cn(flipped ? 'lg:order-1' : 'lg:order-2')}>
                  <Reveal>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-label tabular text-terracota-800">
                        {formatIndex(position)}
                      </span>
                      <Icon name={sector.icon} className="size-6 text-navy-500" />
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <h2 className="mt-6 stretch-display text-display-sm font-semibold text-navy-950">
                      {sector.title}
                    </h2>
                  </Reveal>

                  <Reveal delay={0.18}>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-700 sm:text-lg">
                      {sector.description}
                    </p>
                  </Reveal>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
