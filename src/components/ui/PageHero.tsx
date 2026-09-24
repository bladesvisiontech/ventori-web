import { Headline } from '@/components/motion/Headline'
import { Reveal } from '@/components/motion/Reveal'
import { Rule } from '@/components/motion/Rule'
import { Container } from '@/components/ui/Container'
import { cmsField, cmsSection } from '@/lib/cms'
import { GridPaper } from '@/components/ui/GridPaper'
import type { HeadlineLine } from '@/types/content'

interface PageHeroProps {
  eyebrow: string
  lines: readonly HeadlineLine[]
  lead: string
  /** Acciones opcionales bajo la entrada (p. ej. en la página 404). */
  children?: React.ReactNode
  /** Ruta del encabezado en el CMS ("archivo:ruta"), con eyebrow, titleLines y lead dentro. */
  cms?: string
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
export function PageHero({ eyebrow, lines, lead, children, cms }: PageHeroProps) {
  return (
    <section
      {...cmsSection(cms)}
      className="relative isolate overflow-hidden border-b border-paper-200 bg-paper-50 text-navy-950 pt-(--header-height) pb-16 sm:pb-20 lg:pt-(--header-height-lg) lg:pb-28">
      <GridPaper tone="light" />

      <Container className="relative pt-16 lg:pt-24">
        <Reveal trigger="mount">
          <div className="flex items-center gap-4">
            <Rule trigger="mount" className="w-10 flex-none text-terracota-500" />
            <span className="font-mono text-label uppercase text-navy-700" {...cmsField(cms && `${cms}.eyebrow`)}>
              {eyebrow}
            </span>
          </div>
        </Reveal>

        <Headline
          as="h1"
          lines={lines}
          cms={cms && `${cms}.titleLines`}
          delay={0.12}
          trigger="mount"
          accentClassName="text-terracota-800"
          className="mt-7 max-w-4xl text-display-lg font-semibold text-navy-950"
        />

        <Reveal trigger="mount" delay={0.35}>
          <p {...cmsField(cms && `${cms}.lead`)} className="mt-8 max-w-2xl text-base leading-relaxed text-navy-700 sm:text-lg">
            {lead}
          </p>
        </Reveal>

        {children && (
          <Reveal trigger="mount" delay={0.45}>
            <div className="mt-10">{children}</div>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
