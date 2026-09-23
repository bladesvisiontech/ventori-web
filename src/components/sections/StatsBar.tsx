import { Counter } from '@/components/motion/Counter'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { HAS_STATS, STATS } from '@/content/stats'

/**
 * Barra de cifras, justo debajo del hero.
 *
 * No se renderiza mientras `STATS` esté vacío. Las cifras de una empresa real no
 * se inventan, y una barra con datos de relleno es peor que ninguna barra: quien
 * la lea va a citarla.
 *
 * Cuando el cliente entregue los datos, basta con llenar `content/stats.ts` — la
 * sección aparece sola, sin tocar la home ni este archivo.
 */
export function StatsBar() {
  if (!HAS_STATS) return null

  return (
    <Section tone="navy" spacing="tight" grid>
      <Container width="wide">
        <Stagger className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StaggerItem key={stat.id}>
              <p className="stretch-display font-display text-display-sm font-semibold text-white">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="mt-3 font-mono text-label uppercase text-navy-200">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  )
}
