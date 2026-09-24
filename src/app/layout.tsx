import type { Metadata, Viewport } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileBar } from '@/components/layout/MobileBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { PAGES } from '@/content/pages'
import { BRAND_COLORS } from '@/lib/brand'
import { ROUTES, SITE } from '@/lib/constants'
import { buildMetadata, buildOrganizationJsonLd } from '@/lib/seo'
import './globals.css'

/*
 * Tres familias, cada una con un trabajo:
 *
 *   Archivo        titulares. Grotesca técnica con eje de anchura variable; el
 *                  display va expandido al 112 %, que es lo que le da aire de
 *                  rotulación sobre plano sin recurrir a una fuente decorativa.
 *   Inter          texto corrido. Neutra y de altura de x generosa, que es lo
 *                  que sostiene párrafos largos en pantalla.
 *   JetBrains Mono etiquetas, índices y datos. Es la que hace que la numeración
 *                  se lea como documento técnico y no como adorno.
 *
 * `display: 'swap'` en las tres: el texto se pinta con la fuente de respaldo y
 * se sustituye al llegar la real, en vez de dejar el titular invisible.
 */
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({
    title: PAGES.home.metaTitle,
    description: PAGES.home.description,
    path: ROUTES.home,
  }),
  title: {
    default: PAGES.home.metaTitle,
    template: `%s | ${SITE.name}`,
  },
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: 'business',
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
}

/**
 * `maximumScale` y `userScalable` se quedan en sus valores por defecto a
 * propósito: bloquear el zoom es una barrera de accesibilidad y en iOS impide
 * ampliar un formulario a quien lo necesita.
 */
export const viewport: Viewport = {
  themeColor: BRAND_COLORS.navy,
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={SITE.lang}
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <head>
        {/*
          Los revelados parten de `opacity: 0` en el HTML servido. Sin JavaScript
          nunca llegaría el evento que los hace visibles, así que aquí se
          neutralizan y el contenido queda legible igual.
        */}
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>

      {/*
        El relleno inferior reserva el alto de `<MobileBar />`, que es fija, más
        el indicador de inicio de los iPhone. Va en el `body` y no en el `main`
        porque el pie es hermano del main y también quedaría tapado.
      */}
      <body className="flex min-h-full flex-col bg-navy-950 pb-(--mobile-bar-clearance) lg:pb-0">
        <a
          href="#contenido"
          className="sr-only bevel-sm focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-[70] focus:bg-terracota-500 focus:px-5 focus:py-3 focus:font-mono focus:text-label focus:uppercase focus:text-navy-950"
        >
          Saltar al contenido
        </a>

        <MotionProvider>
          <ScrollProgress />
          <Header />

          <main id="contenido" className="flex-1">
            {children}
          </main>

          <Footer />
          <MobileBar />
        </MotionProvider>

        <JsonLd data={buildOrganizationJsonLd()} />
      </body>
    </html>
  )
}
