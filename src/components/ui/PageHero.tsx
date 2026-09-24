import { Headline } from '@/components/motion/Headline'
import { Reveal } from '@/components/motion/Reveal'
import { Rule } from '@/components/motion/Rule'
import { Container } from '@/components/ui/Container'
import { GridPaper } from '@/components/ui/GridPaper'
import type { HeadlineLine } from '@/types/content'

interface PageHeroProps {
  eyebrow: string
  lines: readonly HeadlineLine[]
  lead: string
}

/**
 * Apertura de las páginas internas.
 *
 * Deliberadamente sin fotografía: la única página que abre con imagen es la
 * home. Si todas lo hicieran, el gesto dejaría de significar nada y cada página
 * interna cargaría un LCP pesado para mostrar un encabezado.
 *
 * El relleno superior reserva la altura del header fijo, que se superpone al
 * contenido. Sin él, el eyebrow quedaría debajo de la barra.
 */
export function PageHero({ eyebrow, lines, lead }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-hero pt-(--header-height) pb-16 sm:pb-20 lg:pt-(--header-height-lg) lg:pb-28">
      <GridPaper />

      <Container className="relative pt-16 lg:pt-24">
        <Reveal trigger="mount">
          <div className="flex items-center gap-4">
            <Rule trigger="mount" className="w-10 flex-none text-terracota-500" />
            <span className="font-mono text-label uppercase text-navy-100">{eyebrow}</span>
          </div>
        </Reveal>

        <Headline
          as="h1"
          lines={lines}
          delay={0.12}
          trigger="mount"
          accentClassName="text-terracota-400"
          className="mt-7 max-w-4xl text-display-lg font-semibold text-white"
        />

        <Reveal trigger="mount" delay={0.35}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
            {lead}
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
