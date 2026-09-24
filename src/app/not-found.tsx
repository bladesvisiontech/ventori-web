import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/ui/PageHero'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { GLOBAL } from '@/content/data/global'
import { ROUTES } from '@/lib/constants'

export const metadata: Metadata = {
  title: GLOBAL.systemPages.notFound.metaTitle,
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const copy = GLOBAL.systemPages.notFound

  return (
    <PageHero cms="global:systemPages.notFound" eyebrow={copy.eyebrow} lines={copy.titleLines} lead={copy.lead}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ShinyButton href={ROUTES.home}>{copy.primaryCta}</ShinyButton>
        <Button href={ROUTES.contact} variant="onPaper">
          {copy.secondaryCta}
        </Button>
      </div>
    </PageHero>
  )
}
