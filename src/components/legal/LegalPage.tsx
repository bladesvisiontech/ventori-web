import { JsonLd } from '@/components/seo/JsonLd'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { LEGAL_UPDATED_LABEL, type LegalDocument } from '@/content/legal'
import { cmsField } from '@/lib/cms'
import { buildBreadcrumbJsonLd } from '@/lib/seo'
import { formatIndex } from '@/lib/utils'

export function LegalPage({
  document,
  path,
  docKey,
}: {
  document: LegalDocument
  path: string
  /** Clave del documento en legal.json, para la vista previa del CMS. */
  docKey: 'privacy' | 'terms' | 'cookies'
}) {
  const cms = `legal:${docKey}`
  return (
    <>
      <PageHero cms={cms} eyebrow={document.eyebrow} lines={document.titleLines} lead={document.lead} />

      <Section tone="paper" grid>
        <Container width="prose">
          <p className="font-mono text-label uppercase text-navy-700">
            {LEGAL_UPDATED_LABEL}: <span className="tabular" {...cmsField(`${cms}.updatedAt`)}>{document.updatedAt}</span>
          </p>

          <div className="mt-12 space-y-12">
            {document.sections.map((section, position) => (
              <section key={section.heading} aria-labelledby={`legal-${position}`}>
                <h2
                  id={`legal-${position}`}
                  className="flex items-baseline gap-4 font-display text-xl font-semibold text-navy-950 sm:text-2xl"
                >
                  <span className="font-mono text-label tabular text-terracota-800">
                    {formatIndex(position)}
                  </span>
                  <span {...cmsField(`${cms}.sections.${position}.heading`)}>{section.heading}</span>
                </h2>

                {section.paragraphs?.map((paragraph, item) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-base leading-relaxed text-navy-800"
                    {...cmsField(`${cms}.sections.${position}.paragraphs.${item}`)}
                  >
                    {paragraph}
                  </p>
                ))}

                {section.items && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-terracota-800">
                    {section.items.map((item, entry) => (
                      <li
                        key={item}
                        className="text-base leading-relaxed text-navy-800"
                        {...cmsField(`${cms}.sections.${position}.items.${entry}`)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <JsonLd data={buildBreadcrumbJsonLd(document.metaTitle, path)} />
    </>
  )
}
