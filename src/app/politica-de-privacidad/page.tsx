import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'
import { PRIVACY_POLICY } from '@/content/legal'
import { ROUTES } from '@/lib/constants'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: PRIVACY_POLICY.metaTitle,
  description: PRIVACY_POLICY.description,
  path: ROUTES.privacy,
})

export default function PrivacyPage() {
  return <LegalPage document={PRIVACY_POLICY} path={ROUTES.privacy} />
}
