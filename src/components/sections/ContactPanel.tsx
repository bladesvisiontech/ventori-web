import { Reveal } from '@/components/motion/Reveal'
import { Rule } from '@/components/motion/Rule'
import { ContactForm } from '@/components/sections/ContactForm'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { CONTACTO } from '@/content/data/contacto'
import { CONTACT, getContactChannels } from '@/lib/constants'

/**
 * Bloque de contacto: canales a la izquierda, formulario a la derecha.
 *
 * Los canales directos van primero en el orden de lectura y de tabulación
 * porque para muchas entidades públicas escribir un correo desde su propia
 * cuenta es el trámite válido, y obligarlas a pasar por un formulario sería
 * ponerles un obstáculo.
 *
 * Mientras el cliente no entregue correo, teléfono y dirección, la columna
 * muestra solo el horario y el formulario queda como único canal, en vez de
 * enseñar filas vacías.
 */
export function ContactPanel() {
  const channels = getContactChannels()

  return (
    <Section tone="navy" grid>
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="font-mono text-label uppercase text-navy-200">{CONTACTO.panel.channelsHeading}</h2>
              <Rule className="mt-4 w-12 text-terracota-500" delay={0.1} />
            </Reveal>

            {channels.length > 0 && (
              <dl className="mt-8 space-y-6">
                {channels.map((channel, position) => (
                  <Reveal key={channel.id} delay={0.15 + position * 0.06}>
                    <dt className="font-mono text-label uppercase text-navy-300">
                      {channel.label}
                    </dt>
                    <dd className="mt-1.5 text-base text-white">
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="inline-flex min-h-11 items-center underline-offset-4 transition-colors duration-200 hover:text-terracota-500 hover:underline"
                        >
                          {channel.value}
                        </a>
                      ) : (
                        channel.value
                      )}
                    </dd>
                  </Reveal>
                ))}
              </dl>
            )}

            <Reveal delay={0.3}>
              <div className="mt-8">
                <p className="font-mono text-label uppercase text-navy-300">{CONTACTO.panel.scheduleHeading}</p>
                <p className="mt-1.5 text-base text-white">{CONTACT.schedule.days}</p>
                <p className="tabular text-base text-white">{CONTACT.schedule.hours}</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
