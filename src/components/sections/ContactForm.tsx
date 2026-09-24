'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Check, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { CONTACT_CONSENT } from '@/content/consent'
import { CONTACTO } from '@/content/data/contacto'
import {
  CONTACT_FORM,
  CONTACT_SUBJECTS,
  FORM_MESSAGES,
  FORM_STATUS,
  ROUTES,
  type FormStatus,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { contactSchema, type ContactInput } from '@/lib/validation/contact'

const FORM_TEXT = CONTACTO.form

/* Un solo juego de clases para todos los campos: mezclar alturas o grosores de
   borde entre un input y un select es de lo que más delata un formulario. */
const FIELD =
  'min-h-12 w-full border border-navy-700 bg-navy-900 px-4 py-3 text-base text-white ' +
  'placeholder:text-navy-400 transition-colors duration-200 ' +
  'hover:border-navy-600 focus:border-terracota-500 focus:outline-none focus:ring-1 focus:ring-terracota-500'

const FIELD_INVALID = 'border-terracota-400'

const LABEL = 'block font-mono text-label uppercase text-navy-200'

interface FieldShellProps {
  id: string
  label: string
  /** Texto de ayuda permanente. No se sustituye por el placeholder. */
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

/**
 * Envoltura común de cada campo: etiqueta visible, ayuda, y error debajo del
 * control al que se refiere.
 *
 * El error va en un `role="alert"`, de modo que un lector de pantalla lo anuncia
 * en cuanto aparece sin que el usuario tenga que ir a buscarlo.
 */
function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-1 text-terracota-500">
              *
            </span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        )}
      </label>

      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy-300">
          {hint}
        </p>
      )}

      <div className="mt-2.5">{children}</div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-sm text-terracota-300"
        >
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>(FORM_STATUS.idle)
  const [feedback, setFeedback] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    /* Se valida al salir del campo, no en cada pulsación: marcar en rojo un
       correo a medio escribir es corregir al usuario antes de que termine. */
    mode: 'onBlur',
    defaultValues: { subject: CONTACT_SUBJECTS[0].value, consent: false },
  })

  const onSubmit = async (values: ContactInput) => {
    setStatus(FORM_STATUS.submitting)
    setFeedback('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        setStatus(FORM_STATUS.error)
        setFeedback(payload.message ?? FORM_MESSAGES.error)
        return
      }

      setStatus(FORM_STATUS.success)
      setFeedback(payload.message ?? FORM_MESSAGES.success)
      reset()
    } catch {
      setStatus(FORM_STATUS.error)
      setFeedback(FORM_MESSAGES.error)
    }
  }

  /* Con errores de validación, el foco va al primer campo que falla. Sin esto,
     en un formulario largo el usuario recibe el aviso y no sabe dónde mirar. */
  const onInvalid = (formErrors: typeof errors) => {
    const firstField = Object.keys(formErrors)[0] as keyof ContactInput | undefined
    if (firstField) setFocus(firstField)
  }

  const submitting = status === FORM_STATUS.submitting

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-7">
      {/*
        Campo trampa. `tabIndex={-1}` y `aria-hidden` lo sacan del recorrido de
        teclado y del árbol de accesibilidad: solo un bot que rellena por
        atributo `name` puede escribir aquí.
      */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="website">No rellenar</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <FieldShell id="name" label={FORM_TEXT.labels.name} error={errors.name?.message} required>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={cn(FIELD, errors.name && FIELD_INVALID)}
            {...register('name')}
          />
        </FieldShell>

        <FieldShell
          id="organization"
          label={FORM_TEXT.labels.organization}
          hint={FORM_TEXT.labels.organizationHint}
          error={errors.organization?.message}
        >
          <input
            id="organization"
            type="text"
            autoComplete="organization"
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={errors.organization ? 'organization-error' : undefined}
            className={cn(FIELD, errors.organization && FIELD_INVALID)}
            {...register('organization')}
          />
        </FieldShell>

        <FieldShell id="email" label={FORM_TEXT.labels.email} error={errors.email?.message} required>
          {/* `type="email"` abre el teclado con arroba en móvil. */}
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn(FIELD, errors.email && FIELD_INVALID)}
            {...register('email')}
          />
        </FieldShell>

        <FieldShell id="phone" label={FORM_TEXT.labels.phone} error={errors.phone?.message} required>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={cn(FIELD, errors.phone && FIELD_INVALID)}
            {...register('phone')}
          />
        </FieldShell>
      </div>

      <FieldShell id="subject" label={FORM_TEXT.labels.subject} error={errors.subject?.message} required>
        <select
          id="subject"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className={cn(FIELD, 'cursor-pointer', errors.subject && FIELD_INVALID)}
          {...register('subject')}
        >
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell
        id="message"
        label={FORM_TEXT.labels.message}
        hint={`${FORM_TEXT.labels.messageHint} Mínimo ${CONTACT_FORM.minMessageLength} caracteres.`}
        error={errors.message?.message}
        required
      >
        <textarea
          id="message"
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={cn('message-hint', errors.message && 'message-error')}
          className={cn(FIELD, 'resize-y', errors.message && FIELD_INVALID)}
          {...register('message')}
        />
      </FieldShell>

      <div>
        <div className="flex items-start gap-3">
          <span className="relative mt-0.5 flex size-5 shrink-0">
            <input
              id="consent"
              type="checkbox"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
              className="peer size-5 cursor-pointer appearance-none border border-navy-600 bg-navy-900 transition-colors duration-200 checked:border-terracota-500 checked:bg-terracota-500 hover:border-navy-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota-500"
              {...register('consent')}
            />
            <Check
              aria-hidden="true"
              strokeWidth={2.5}
              className="pointer-events-none absolute inset-0.5 size-4 text-navy-950 opacity-0 peer-checked:opacity-100"
            />
          </span>
          <label htmlFor="consent" className="cursor-pointer text-sm leading-relaxed text-navy-100">
            {CONTACT_CONSENT.before}
            <Link
              href={ROUTES.privacy}
              target="_blank"
              className="text-white underline underline-offset-4 hover:text-terracota-300"
            >
              {CONTACT_CONSENT.link}
            </Link>
            {CONTACT_CONSENT.after}
            <span aria-hidden="true" className="ml-1 text-terracota-500">
              *
            </span>
            <span className="sr-only"> (obligatorio)</span>
          </label>
        </div>

        {errors.consent && (
          <p
            id="consent-error"
            role="alert"
            className="mt-2 flex items-start gap-1.5 text-sm text-terracota-300"
          >
            <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
            {errors.consent.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <ShinyButton type="submit" disabled={submitting}>
          {submitting ? FORM_TEXT.submitting : FORM_TEXT.submit}
        </ShinyButton>

        <p className="font-mono text-label uppercase text-navy-300">
          <span aria-hidden="true" className="text-terracota-500">
            *
          </span>{' '}
          {FORM_TEXT.requiredNote}
        </p>
      </div>

      {/*
        Región viva permanente: el mensaje de resultado se anuncia al aparecer
        sin robarle el foco a quien esté navegando con teclado. Debe existir en
        el DOM desde el principio, o el lector de pantalla no llega a observarla.
      */}
      <div aria-live="polite" className="min-h-0">
        {feedback && (
          <div
            className={cn(
              'flex items-start gap-3 bevel-sm p-4 text-sm',
              status === FORM_STATUS.success
                ? 'bg-terracota-500 text-navy-950'
                : 'border border-terracota-400 bg-navy-900 text-terracota-200',
            )}
          >
            {status === FORM_STATUS.success ? (
              <CheckCircle2 aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-5 shrink-0" />
            ) : (
              <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-5 shrink-0" />
            )}
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </form>
  )
}
