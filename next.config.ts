import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/** Dominio del CMS: el único que puede mostrar el sitio en su vista previa. */
const CMS_ORIGIN = process.env.CMS_ORIGIN ?? ''

/** Fotos y vídeos subidos desde el CMS (Vercel Blob). */
const BLOB_HOST = 'https://*.public.blob.vercel-storage.com'

/**
 * Política de contenido: el sitio solo carga recursos propios (fuentes
 * autoalojadas por `next/font`, imágenes y vídeo en /public). `unsafe-inline`
 * en scripts lo exige la hidratación de Next sin nonces, que obligarían a
 * renderizar todas las páginas en cada petición.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${BLOB_HOST}`,
  "font-src 'self'",
  `media-src 'self' ${BLOB_HOST}`,
  `connect-src 'self'${isDev ? ' ws:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  `frame-ancestors ${CMS_ORIGIN ? `'self' ${CMS_ORIGIN}` : "'none'"}`,
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  /* Redundante con `frame-ancestors`; se omite cuando el CMS necesita la vista previa. */
  ...(CMS_ORIGIN ? [] : [{ key: 'X-Frame-Options', value: 'DENY' }]),
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /* El puente de vista previa necesita saber, en el navegador, de qué dominio aceptar mensajes. */
  env: { NEXT_PUBLIC_CMS_ORIGIN: CMS_ORIGIN },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      /* Las fotos del sitio se muestran como miniaturas en el CMS, que es otro dominio. */
      {
        source: '/:dir(media|proyectos)/:file+',
        headers: [{ key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ]
  },
}

export default nextConfig
