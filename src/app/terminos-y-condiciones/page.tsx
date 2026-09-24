import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'
import { TERMS } from '@/content/legal'
import { ROUTES } from '@/lib/constants'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: TERMS.metaTitle,
  description: TERMS.description,
  path: ROUTES.terms,
})

export default function TermsPage() {
  return <LegalPage document={TERMS} path={ROUTES.terms} />
}
