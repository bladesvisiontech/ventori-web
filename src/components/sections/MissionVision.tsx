import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { MISSION, VISION } from '@/content/about'
import { formatIndex } from '@/lib/utils'
import { cmsField } from '@/lib/cms'

/**
 * Misión y visión, en dos paneles biselados.
 *
 * Uno sobre papel y otro en terracota: son dos declaraciones del mismo peso y
 * darles el mismo tratamiento las convertiría en un párrafo doble. El contraste
 * de superficie es lo que las separa como piezas.
 *
 * Los dos paneles entran enmascarados desde abajo con 120 ms de diferencia, lo
 * justo para que se lean como dos piezas colocadas y no como un bloque que
 * aparece.
 */
export function MissionVision({ index }: { index: number }) {
  const panels = [
    {
      ...MISSION,
      surface: 'bg-paper-100 text-navy-950',
      meta: 'text-navy-700',
      body: 'text-navy-700',
    },
    {
      ...VISION,
      surface: 'bg-terracota-500 text-navy-950',
      meta: 'text-navy-800',
      body: 'text-navy-800',
    },
  ]

  return (
    <Section tone="paper" cms="nosotros:missionVision">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          {panels.map((panel, position) => (
            <Reveal key={panel.eyebrow} mask from="bottom" delay={position * 0.12} className="h-full">
              <div className={`h-full bevel p-8 sm:p-10 lg:p-12 ${panel.surface}`}>
                <div className="flex items-center gap-4">
                  <Icon name={panel.icon} className="size-6" />
                  <span className={`font-mono text-label tabular ${panel.meta}`}>
                    {formatIndex(index + position)}
                  </span>
                  <span className={`font-mono text-label uppercase ${panel.meta}`} {...cmsField(`nosotros:${position === 0 ? 'mission' : 'vision'}.eyebrow`)}>
                    {panel.eyebrow}
                  </span>
                </div>

                <p
                  className={`mt-8 text-lg leading-relaxed sm:text-xl ${panel.body}`}
                  {...cmsField(`nosotros:${position === 0 ? 'mission' : 'vision'}.text`)}
                >
                  {panel.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
