import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'
import { COOKIES_POLICY } from '@/content/legal'
import { ROUTES } from '@/lib/constants'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: COOKIES_POLICY.metaTitle,
  description: COOKIES_POLICY.description,
  path: ROUTES.cookies,
})

export default function CookiesPage() {
  return <LegalPage document={COOKIES_POLICY} path={ROUTES.cookies} />
}
