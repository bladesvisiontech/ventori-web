import Link from 'next/link'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { HOME_SECTIONS } from '@/content/sections'
import { SECTORS } from '@/content/sectors'
import { ROUTES } from '@/lib/constants'
import { cn, formatIndex } from '@/lib/utils'

/**
 * Reparto de la retícula de 12 columnas, pieza a pieza.
 *
 * Se declara a mano en vez de repetir un tamaño uniforme: una cuadrícula de
 * siete tarjetas idénticas no tiene jerarquía y se lee como un catálogo. Al
 * variar anchos y proporciones, la vista entra por las piezas grandes y el
 * bloque deja de parecer una plantilla.
 *
 * `sizes` acompaña a cada reparto para que el navegador pida la resolución que
 * corresponde a ese ancho y no una imagen de 2400 px para un tercio de columna.
 */
const LAYOUT = [
  { span: 'lg:col-span-7', ratio: 'landscape', sizes: '(min-width: 1024px) 58vw, 100vw' },
  { span: 'lg:col-span-5', ratio: 'landscape', sizes: '(min-width: 1024px) 41vw, 100vw' },
  { span: 'lg:col-span-4', ratio: 'portrait', sizes: '(min-width: 1024px) 33vw, 100vw' },
  { span: 'lg:col-span-4', ratio: 'portrait', sizes: '(min-width: 1024px) 33vw, 100vw' },
  { span: 'lg:col-span-4', ratio: 'portrait', sizes: '(min-width: 1024px) 33vw, 100vw' },
  { span: 'lg:col-span-5', ratio: 'landscape', sizes: '(min-width: 1024px) 41vw, 100vw' },
  { span: 'lg:col-span-7', ratio: 'landscape', sizes: '(min-width: 1024px) 58vw, 100vw' },
] as const

export function SectorsMosaic({ index }: { index: number }) {
  const copy = HOME_SECTIONS.sectors

  return (
    <Section tone="navy" grid>
      <Container width="wide">
        <SectionHead
          index={index}
          eyebrow={copy.eyebrow}
          lines={copy.lines}
          intro={copy.intro}
          className="lg:max-w-2xl"
        />

        <Stagger className="mt-16 grid gap-4 lg:grid-cols-12" delay={0.1}>
          {SECTORS.map((sector, position) => {
            const layout = LAYOUT[position % LAYOUT.length]

            return (
              <StaggerItem key={sector.id} className={layout.span}>
                {/*
                  Toda la pieza es el destino del enlace, no solo el título: un
                  objetivo táctil del tamaño de la tarjeta no exige puntería.
                */}
                <Link
                  href={`${ROUTES.sectors}#${sector.id}`}
                  className="group relative block"
                  aria-label={`${sector.title}. Ver detalle del sector`}
                >
                  <MediaFrame
                    media={sector.media}
                    ratio={layout.ratio}
                    sizes={layout.sizes}
                    className={cn(
                      'transition-transform duration-500 ease-[var(--ease-out-soft)]',
                      'group-hover:-translate-y-1 group-focus-visible:-translate-y-1',
                    )}
                  >
                    {/* Velo permanente: garantiza el contraste del rótulo sobre
                        cualquier fotografía, no solo sobre las oscuras. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-baseline gap-4 p-6">
                      <span className="font-mono text-label tabular text-terracota-500">
                        {formatIndex(position)}
                      </span>
                      <h3 className="stretch-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {sector.title}
                      </h3>
                    </div>
                  </MediaFrame>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </Section>
  )
}
