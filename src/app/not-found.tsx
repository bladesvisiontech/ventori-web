import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { SYSTEM_PAGES } from '@/content/pages'
import { ROUTES } from '@/lib/constants'

export const metadata: Metadata = {
  title: SYSTEM_PAGES.notFound.metaTitle,
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const copy = SYSTEM_PAGES.notFound

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} lines={copy.titleLines} lead={copy.lead} />
      <section className="bg-navy-950 pb-24">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ShinyButton href={ROUTES.home}>{copy.primaryCta}</ShinyButton>
            <Button href={ROUTES.contact} variant="outline">
              {copy.secondaryCta}
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
