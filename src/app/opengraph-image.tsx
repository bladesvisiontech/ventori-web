import { ImageResponse } from 'next/og'
import { BRAND_COLORS, ISOTYPE } from '@/lib/brand'
import { SITE } from '@/lib/constants'

export const alt = `${SITE.name} · ${SITE.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: BRAND_COLORS.navy,
          color: BRAND_COLORS.white,
        }}
      >
        <svg width={ISOTYPE.width * 2} height={ISOTYPE.height * 2} viewBox={ISOTYPE.viewBox}>
          {ISOTYPE.paths.map((d) => (
            <path key={d} d={d} fill={ISOTYPE.color} />
          ))}
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>{SITE.name}</div>
          <div style={{ fontSize: 40, color: BRAND_COLORS.terracota, marginTop: 12 }}>
            {SITE.tagline}
          </div>
          <div style={{ fontSize: 26, color: BRAND_COLORS.navySoft, marginTop: 32, maxWidth: 900 }}>
            {SITE.description}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
