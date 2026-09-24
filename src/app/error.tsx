'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { GLOBAL } from '@/content/data/global'
import { ROUTES } from '@/lib/constants'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const copy = GLOBAL.systemPages.error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="bg-paper-50 pt-(--header-height) pb-24 text-navy-950 lg:pt-(--header-height-lg)">
      <Container className="pt-16 lg:pt-24">
        <p className="font-mono text-label uppercase text-navy-700">{copy.eyebrow}</p>
        <h1 className="stretch-display mt-6 font-display text-display-md font-semibold">{copy.title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-700">{copy.lead}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ShinyButton type="button" onClick={reset}>
            {copy.retry}
          </ShinyButton>
          <Button href={ROUTES.home} variant="onPaper">
            {copy.home}
          </Button>
        </div>
      </Container>
    </section>
  )
}
