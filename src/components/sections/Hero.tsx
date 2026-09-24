import Image from 'next/image'
import { HeroVideo } from '@/components/sections/HeroVideo'
import { Headline } from '@/components/motion/Headline'
import { Reveal } from '@/components/motion/Reveal'
import { Rule } from '@/components/motion/Rule'
import { Button } from '@/components/ui/Button'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { Container } from '@/components/ui/Container'
import { HERO } from '@/content/about'
import { ROUTES } from '@/lib/constants'
import { formatIndex } from '@/lib/utils'

/**
 * Apertura de la home.
 *
 * `min-h-dvh` y no `100vh`: en móvil, la barra de direcciones hace que `vh`
 * mida más que la ventana real y el hero queda cortado por abajo.
 *
 * El contenido se ancla abajo a la izquierda, no centrado. Es lo que deja
 * respirar la fotografía en la mitad superior y lo que hace que el titular
 * caiga sobre la zona más oscura del velo, donde el contraste es máximo.
 *
 * La secuencia de entrada está cronometrada para leerse en orden: disciplinas,
 * titular línea a línea, bajada, acciones. Nada entra a la vez que otra cosa.
 */
export function Hero() {
  return (
    <section className="relative isolate z-10 flex min-h-dvh flex-col justify-end pt-(--header-height) pb-[calc(var(--mobile-bar-clearance)+6rem)] sm:pb-[calc(var(--mobile-bar-clearance)+7rem)] lg:pt-(--header-height-lg) lg:pb-52">
      <HeroVideo />

      <Container width="wide" className="relative">
        <Reveal trigger="mount">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {HERO.disciplines.map((discipline, index) => (
              <li key={discipline} className="flex items-baseline gap-2">
                <span className="font-mono text-label tabular text-terracota-500">
                  {formatIndex(index)}
                </span>
                <span className="font-mono text-label uppercase text-navy-100">{discipline}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal trigger="mount" delay={0.08}>
          <Rule trigger="mount" className="mt-6 max-w-md text-navy-600" />
        </Reveal>

        <Headline
          as="h1"
          lines={HERO.lines}
          delay={0.2}
          trigger="mount"
          className="mt-8 max-w-6xl text-display-xl font-semibold text-white"
        />

        <div className="mt-10 flex flex-col gap-10">
          <Reveal trigger="mount" delay={0.45}>
            <p className="max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
              {HERO.subheadline}
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={0.55}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <ShinyButton href={ROUTES.contact}>{HERO.primaryCta}</ShinyButton>
              <Button href={ROUTES.services} variant="outline">
                {HERO.secondaryCta}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>

      <Image
        src="/icon.svg"
        alt=""
        width={59}
        height={65}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 w-24 -translate-x-1/2 translate-y-1/2 sm:w-32 lg:w-52"
      />
    </section>
  )
}
