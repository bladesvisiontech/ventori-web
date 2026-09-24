import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { COMMITMENT } from '@/content/about'

/**
 * Cierre de la página de empresa: el compromiso, con la fotografía a la
 * izquierda.
 *
 * La imagen va antes que el texto en escritorio —al revés que en `AboutSplit`—
 * para que las dos secciones de la misma página no se lean como el mismo bloque
 * repetido. En móvil el orden vuelve a ser texto primero.
 */
export function Commitment({ index }: { index: number }) {
  return (
    <Section tone="navy" grid>
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal mask from="bottom" className="lg:order-1">
            <MediaFrame image={COMMITMENT.image} ratio="landscape" sizes="(min-width: 1024px) 45vw, 100vw" />
          </Reveal>

          <div className="lg:order-2">
            <SectionHead
              index={index}
              eyebrow={COMMITMENT.eyebrow}
              lines={[COMMITMENT.heading]}
            />

            <Reveal delay={0.3}>
              <p className="mt-8 text-base leading-relaxed text-navy-100 sm:text-lg">
                {COMMITMENT.text}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
