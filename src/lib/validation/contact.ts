import { z } from 'zod'
import { CONTACT_CONSENT } from '@/content/consent'
import { CONTACT_FORM, CONTACT_SUBJECT_VALUES } from '@/lib/constants'

/** Sin caracteres de control: un salto de línea en el nombre acabaría en el asunto del correo. */
const SINGLE_LINE = /^[^\u0000-\u001f\u007f]*$/
/** Dígitos, espacios y los signos habituales de un teléfono. */
const PHONE = /^[+\d\s().-]+$/

/**
 * Esquema compartido: el cliente lo usa con react-hook-form y el route handler
 * lo vuelve a aplicar sobre el body. La validación de servidor no confía en la
 * de cliente — se ejecutan las dos.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_FORM.minNameLength, 'Escribe tu nombre completo.')
    .max(CONTACT_FORM.maxNameLength, 'El nombre es demasiado largo.')
    .regex(SINGLE_LINE, 'El nombre contiene caracteres no válidos.'),
  email: z
    .email('Escribe un correo electrónico válido.')
    .max(CONTACT_FORM.maxEmailLength, 'El correo es demasiado largo.'),
  phone: z
    .string()
    .trim()
    .min(CONTACT_FORM.minPhoneLength, 'Escribe un teléfono de contacto válido.')
    .max(CONTACT_FORM.maxPhoneLength, 'El teléfono es demasiado largo.')
    .regex(PHONE, 'Escribe un teléfono de contacto válido.'),
  organization: z
    .string()
    .trim()
    .max(CONTACT_FORM.maxOrganizationLength, 'El nombre de la entidad es demasiado largo.')
    .regex(SINGLE_LINE, 'El nombre de la entidad contiene caracteres no válidos.')
    .optional()
    .or(z.literal('')),
  subject: z.enum(CONTACT_SUBJECT_VALUES as [string, ...string[]], {
    message: 'Selecciona un asunto.',
  }),
  message: z
    .string()
    .trim()
    .min(CONTACT_FORM.minMessageLength, 'Cuéntanos un poco más sobre el proyecto.')
    .max(CONTACT_FORM.maxMessageLength, 'El mensaje es demasiado largo.'),
  /**
   * Campo trampa: invisible para las personas, así que si llega con contenido el
   * envío proviene de un bot.
   *
   * El esquema lo acepta a propósito —validarlo aquí devolvería un 400 que le
   * confirma al bot que fue detectado—. El descarte lo hace el route handler,
   * respondiendo 200 como si el envío hubiera sido correcto.
   */
  website: z.string().max(CONTACT_FORM.maxNameLength).optional(),
  /** Autorización de tratamiento de datos (Ley 1581 de 2012). Obligatoria. */
  consent: z.boolean().refine((value) => value, CONTACT_CONSENT.error),
})

export type ContactInput = z.infer<typeof contactSchema>
