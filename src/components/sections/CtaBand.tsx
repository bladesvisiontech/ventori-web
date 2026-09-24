import Image from 'next/image'
import { Headline } from '@/components/motion/Headline'
import { Reveal } from '@/components/motion/Reveal'
import { Rule } from '@/components/motion/Rule'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { Container } from '@/components/ui/Container'
import { CTA_BAND } from '@/content/about'
import { ROUTES } from '@/lib/constants'
import { formatIndex } from '@/lib/utils'

/**
 * Banda de cierre, reutilizada al final de la home y de cada página interna.
 *
 * La fotografía va a sangre y sin parallax: es el último bloque antes del pie y
 * un desplazamiento aquí dejaría ver el borde de la imagen justo donde la página
 * deja de tener scroll por delante para compensarlo.
 *
 * La imagen se sirve con `next/image` directo en vez de con `<MediaFrame>`
 * porque este bloque no lleva bisel: es la única pieza a sangre completa del
 * sitio, y biselarla partiría la banda en diagonal contra el pie.
 */
export function CtaBand({ index }: { index: number }) {
  const asset = CTA_BAND.image

  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <Image
        src={asset.src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />

      {/* Velo doble: uno general para el contraste y otro desde la izquierda,
          que es donde se apoya el texto. */}
      <span aria-hidden="true" className="absolute inset-0 bg-navy-950/75" />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/60 to-navy-950/30"
      />

      <Container className="relative py-24 sm:py-32 lg:py-40">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-label tabular text-terracota-500">
              {formatIndex(index)}
            </span>
            <Rule className="w-10 flex-none text-navy-600" delay={0.1} />
            <span className="font-mono text-label uppercase text-navy-200">{CTA_BAND.eyebrow}</span>
          </div>
        </Reveal>

        <Headline
          as="h2"
          lines={CTA_BAND.lines}
          delay={0.15}
          className="mt-7 max-w-3xl text-display-lg font-semibold text-white"
        />

        <Reveal delay={0.35}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
            {CTA_BAND.text}
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <ShinyButton href={ROUTES.contact}>{CTA_BAND.cta}</ShinyButton>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
