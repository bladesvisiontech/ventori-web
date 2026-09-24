import { PinnedSequence } from '@/components/motion/PinnedSequence'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { PILLARS } from '@/content/pillars'
import { HOME_SECTIONS } from '@/content/sections'

/**
 * Las tres fases del proyecto, con la fotografía fijada al viewport mientras el
 * texto la atraviesa.
 *
 * Es el momento largo de la página y va sin retícula de fondo: la sección ya
 * tiene bastante que sostener con la columna fija, y una capa más de textura
 * competiría con la fotografía.
 *
 * El espaciado inferior es `none` porque cada fase ya trae el suyo; añadir el
 * de la sección dejaría un hueco muerto entre la última fase y el bloque
 * siguiente.
 */
export function ProcessSequence({ index }: { index: number }) {
  const copy = HOME_SECTIONS.process

  return (
    <Section tone="navy" cms="servicios:process" spacing="none" className="pt-20 sm:pt-28 lg:pt-36">
      <Container>
        <SectionHead
          index={index}
          eyebrow={copy.eyebrow}
          lines={copy.lines}
          intro={copy.intro}
          cms="servicios:process.section"
        />

        <div className="mt-8 lg:mt-4">
          <PinnedSequence items={PILLARS} cms="servicios:process.pillars" />
        </div>
      </Container>
    </Section>
  )
}
