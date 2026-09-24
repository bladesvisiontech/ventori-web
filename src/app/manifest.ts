import type { MetadataRoute } from 'next'
import { BRAND_COLORS } from '@/lib/brand'
import { SITE } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} · ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    lang: SITE.lang,
    start_url: '/',
    display: 'browser',
    background_color: BRAND_COLORS.navy,
    theme_color: BRAND_COLORS.navy,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
