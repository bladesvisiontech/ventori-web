import { z } from 'zod'

/**
 * Forma de los archivos de `src/content/data/*.json`, que edita el CMS.
 *
 * Se valida en build: si un guardado deja un archivo con un campo que falta o
 * un valor imposible, el build falla con el campo exacto y Vercel mantiene
 * publicada la versión anterior en vez de servir una página rota.
 */

export const ICON_NAMES = [
  'ClipboardCheck', 'ShieldCheck', 'Compass', 'Ruler', 'HardHat', 'Leaf', 'FileText', 'Users',
  'Route', 'Building2', 'Landmark', 'LayoutGrid', 'Globe2', 'Briefcase', 'Award', 'Scale',
  'Lightbulb', 'Handshake', 'TrendingUp', 'Target', 'Eye', 'Layers', 'Network', 'SearchCheck',
  'Truck',
] as const

/** Hosts desde los que se admiten fotos y vídeos, además de /public. */
export const MEDIA_HOST_SUFFIX = '.public.blob.vercel-storage.com'

/* Sin `.trim()`: transformaría el texto, y hay frases que terminan en espacio a propósito. */
const text = z.string().refine((value) => value.trim().length > 0, 'No puede quedar vacío')
const optionalText = z.string()

const mediaSrc = z
  .string()
  .refine(
    (src) => src.startsWith('/') || (src.startsWith('https://') && new URL(src).hostname.endsWith(MEDIA_HOST_SUFFIX)),
    'La ruta debe empezar por "/" o ser un archivo subido desde el CMS',
  )

export const imageSchema = z.object({ src: mediaSrc, alt: text })
export const videoSchema = z.object({ src: mediaSrc, poster: mediaSrc, alt: text })

export const headlineSchema = z
  .array(z.union([text, z.object({ text, accent: z.boolean().optional() })]))
  .min(1)

const iconSchema = z.enum(ICON_NAMES)
const seoSchema = z.object({ metaTitle: text, description: text })
const heroSchema = z.object({ eyebrow: text, titleLines: headlineSchema, lead: text })
const sectionSchema = z.object({ eyebrow: text, lines: headlineSchema, intro: optionalText.optional() })
const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')

export const globalSchema = z.object({
  site: z.object({ name: text, legalName: text, nit: optionalText, tagline: text, description: text }),
  contact: z.object({
    email: z.union([z.literal(''), z.email()]),
    phone: optionalText,
    whatsapp: optionalText,
    address: optionalText,
    city: optionalText,
    schedule: z.object({ days: text, hours: text }),
  }),
  social: z.object({ linkedin: z.union([z.literal(''), z.url()]) }),
  nav: z.object({
    links: z.object({ about: text, services: text, sectors: text, projects: text, contact: text }),
    headerCta: text,
    legalLinks: z.object({ privacy: text, terms: text, cookies: text }),
  }),
  ctaBand: z.object({ eyebrow: text, lines: headlineSchema, text, cta: text, image: imageSchema }),
  footer: z.object({ navHeading: text, contactHeading: text }),
  ui: z.object({
    skipToContent: text,
    mobileBar: z.object({ menu: text, openMenu: text, closeMenu: text, call: text, cta: text }),
  }),
  systemPages: z.object({
    notFound: z.object({ eyebrow: text, titleLines: headlineSchema, lead: text, metaTitle: text, primaryCta: text, secondaryCta: text }),
    error: z.object({ eyebrow: text, title: text, lead: text, retry: text, home: text }),
  }),
})

export const homeSchema = z.object({
  seo: seoSchema,
  hero: z.object({
    disciplines: z.array(text).min(1),
    lines: headlineSchema,
    subheadline: text,
    primaryCta: text,
    secondaryCta: text,
    videos: z.array(videoSchema).min(1),
  }),
  projects: sectionSchema,
})

export const nosotrosSchema = z.object({
  seo: seoSchema,
  hero: heroSchema,
  about: z.object({ section: sectionSchema, eyebrow: text, heading: text, paragraphs: z.array(text).min(1), image: imageSchema }),
  whyUs: z.object({
    section: sectionSchema,
    items: z.array(z.object({ id: slugSchema, title: text, description: text, icon: iconSchema })).min(1),
  }),
  mission: z.object({ eyebrow: text, text, icon: iconSchema }),
  vision: z.object({ eyebrow: text, text, icon: iconSchema }),
  commitment: z.object({ eyebrow: text, heading: text, text, image: imageSchema }),
})

export const serviciosSchema = z.object({
  seo: seoSchema,
  hero: heroSchema,
  index: sectionSchema,
  services: z
    .array(
      z.object({
        id: slugSchema,
        title: text,
        summary: text,
        description: text,
        deliverables: z.array(text).min(1),
        icon: iconSchema,
      }),
    )
    .min(1),
  marquee: z.array(text).min(1),
  detail: z.object({ deliverablesHeading: text }),
  process: z.object({
    section: sectionSchema,
    pillars: z
      .array(z.object({ id: slugSchema, label: text, title: text, description: text, image: imageSchema }))
      .min(1),
  }),
})

export const sectoresSchema = z.object({
  seo: seoSchema,
  hero: heroSchema,
  mosaic: sectionSchema,
  sectors: z
    .array(z.object({ id: slugSchema, title: text, description: text, icon: iconSchema, image: imageSchema }))
    .min(1),
})

export const proyectosSchema = z.object({
  seo: seoSchema,
  map: sectionSchema,
  records: sectionSchema,
  totals: z.object({ projects: text, departments: text, luminaires: text }),
  labels: z.object({
    startDate: text, endDate: text, term: text, termUnit: text, luminaires: text, contract: text,
    company: text, object: text, department: text, gallery: text, photosPending: text,
    photoAltPending: text, previousPhoto: text, nextPhoto: text, photoOf: text, moreInfo: text,
    mapLabel: text, selectorLabel: text,
  }),
  projects: z.array(
    z.object({
      id: slugSchema,
      name: text,
      department: text,
      company: text,
      contract: text,
      object: text,
      startDate: text,
      endDate: text,
      termYears: z.number().int().positive(),
      luminaires: z.number().int().nonnegative(),
      images: z.array(mediaSrc),
    }),
  ),
  stats: z.array(
    z.object({ id: slugSchema, value: z.number(), prefix: optionalText.optional(), suffix: optionalText.optional(), label: text }),
  ),
})

export const contactoSchema = z.object({
  seo: seoSchema,
  hero: heroSchema,
  panel: z.object({
    channelsHeading: text,
    scheduleHeading: text,
    channelLabels: z.object({ email: text, phone: text, address: text, city: text }),
  }),
  form: z.object({
    labels: z.object({
      name: text, organization: text, organizationHint: text, email: text, phone: text,
      subject: text, message: text, messageHint: text,
    }),
    submit: text,
    submitting: text,
    requiredNote: text,
    subjects: z.array(z.object({ value: slugSchema, label: text })).min(1),
    messages: z.object({ success: text, error: text, errorWithEmail: text, rateLimited: text }),
    consent: z.object({ before: text, link: text, after: optionalText, error: text }),
  }),
})

const legalDocSchema = z.object({
  metaTitle: text,
  description: text,
  eyebrow: text,
  titleLines: headlineSchema,
  lead: text,
  updatedAt: text,
  sections: z
    .array(z.object({ heading: text, paragraphs: z.array(text).optional(), items: z.array(text).optional() }))
    .min(1),
})

export const legalSchema = z.object({
  updatedLabel: text,
  privacy: legalDocSchema,
  terms: legalDocSchema,
  cookies: legalDocSchema,
})

export type MediaImage = z.infer<typeof imageSchema>
export type MediaVideo = z.infer<typeof videoSchema>
export type HeadlineLine = z.infer<typeof headlineSchema>[number]
export type IconName = (typeof ICON_NAMES)[number]
export type LegalDocument = z.infer<typeof legalDocSchema>
export type LegalSection = LegalDocument['sections'][number]
