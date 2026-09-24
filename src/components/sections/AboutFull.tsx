import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { ABOUT } from '@/content/about'

/**
 * "Quiénes somos" completo, en la página de empresa.
 *
 * A diferencia del bloque equivalente de la home, aquí el texto va a ancho de
 * lectura bajo la cabecera y la fotografía cierra el bloque a lo ancho: la
 * página ya se abre con un encabezado grande, y repetir un split de dos columnas
 * inmediatamente después haría que las dos piezas compitieran.
 */
export function AboutFull({ index }: { index: number }) {
  return (
    <Section tone="paper">
      <Container>
        <SectionHead
          index={index}
          eyebrow={ABOUT.eyebrow}
          lines={[ABOUT.heading]}
          tone="light"
        />

        <div className="mt-10 grid gap-x-16 gap-y-6 lg:grid-cols-2">
          {ABOUT.paragraphs.map((paragraph, position) => (
            <Reveal key={paragraph.slice(0, 40)} delay={0.25 + position * 0.07}>
              <p className="text-base leading-relaxed text-navy-700 sm:text-lg">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal mask from="bottom" delay={0.2} className="mt-16">
          <MediaFrame image={ABOUT.image} ratio="wide" sizes="(min-width: 1280px) 1152px, 100vw" />
        </Reveal>
      </Container>
    </Section>
  )
}
