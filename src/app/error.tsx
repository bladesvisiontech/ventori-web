'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SYSTEM_PAGES } from '@/content/pages'
import { ROUTES } from '@/lib/constants'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const copy = SYSTEM_PAGES.error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="bg-navy-hero pt-(--header-height) pb-24 text-white lg:pt-(--header-height-lg)">
      <Container className="pt-16 lg:pt-24">
        <p className="font-mono text-label uppercase text-navy-100">{copy.eyebrow}</p>
        <h1 className="stretch-display mt-6 font-display text-display-md font-semibold">{copy.title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">{copy.lead}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={reset} withArrow={false}>
            {copy.retry}
          </Button>
          <Button href={ROUTES.home} variant="outline">
            {copy.home}
          </Button>
        </div>
      </Container>
    </section>
  )
}
