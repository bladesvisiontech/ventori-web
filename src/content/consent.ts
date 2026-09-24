import { CONTACTO } from '@/content/data/contacto'

/** Texto de la casilla de autorización del formulario de contacto (Ley 1581 de 2012). */
export const CONTACT_CONSENT = {
  ...CONTACTO.form.consent,
  /** Constancia que se añade a cada correo recibido. No editable: es la prueba de la autorización. */
  record: 'Autorización de tratamiento de datos: otorgada en el formulario web',
}
