import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CONTACT_CONSENT } from '@/content/legal'
import { CONTACT_SUBJECTS, FORM_MESSAGES, SITE } from '@/lib/constants'
import {
  getContactFromEmail,
  getContactToEmail,
  getResendApiKey,
  isContactMailConfigured,
} from '@/lib/env'
import { contactSchema } from '@/lib/validation/contact'

/** Tamaño máximo del cuerpo. El formulario completo al límite cabe holgado en 16 KB. */
const MAX_BODY_BYTES = 16_384

/** Ventana y cupo del limitador por IP. */
const RATE_LIMIT = { windowMs: 60_000, maxRequests: 3 } as const

/**
 * Limitador en memoria. Acota ráfagas dentro de una misma instancia; no es un
 * control distribuido. Si el formulario llega a recibir abuso real, hay que
 * moverlo a un almacén compartido.
 */
const attempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()

  /* Se purgan las entradas vencidas para que el mapa no crezca sin límite. */
  if (attempts.size > 1000) {
    for (const [key, entry] of attempts) {
      if (now > entry.resetAt) attempts.delete(key)
    }
  }
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs })
    return false
  }

  entry.count += 1
  return entry.count > RATE_LIMIT.maxRequests
}

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconocida'
}

/**
 * Rechaza envíos desde otros sitios. El navegador manda `Origin` en todo POST
 * con `fetch`; si viene, tiene que coincidir con el host que atiende la petición.
 */
function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function subjectLabel(value: string) {
  return CONTACT_SUBJECTS.find((subject) => subject.value === value)?.label ?? value
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: FORM_MESSAGES.error }, { status: 403 })
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ message: FORM_MESSAGES.error }, { status: 415 })
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json({ message: FORM_MESSAGES.rateLimited }, { status: 429 })
  }

  let body: unknown
  try {
    const raw = await request.text()
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return NextResponse.json({ message: FORM_MESSAGES.error }, { status: 413 })
    }
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ message: FORM_MESSAGES.error }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: FORM_MESSAGES.error, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const data = parsed.data

  // Trampa para bots: se responde 200 para no darles señal de que fueron detectados.
  if (data.website) {
    return NextResponse.json({ message: FORM_MESSAGES.success }, { status: 200 })
  }

  if (!isContactMailConfigured()) {
    console.error('[contacto] Envío no configurado: faltan variables de entorno de Resend.')
    return NextResponse.json({ message: FORM_MESSAGES.error }, { status: 503 })
  }

  try {
    const resend = new Resend(getResendApiKey())

    const { error } = await resend.emails.send({
      from: getContactFromEmail(),
      to: getContactToEmail(),
      replyTo: data.email,
      subject: `[${SITE.name}] ${subjectLabel(data.subject)} — ${data.name}`,
      text: [
        `Nombre: ${data.name}`,
        `Correo: ${data.email}`,
        `Teléfono: ${data.phone}`,
        data.organization ? `Entidad / empresa: ${data.organization}` : null,
        `Asunto: ${subjectLabel(data.subject)}`,
        '',
        'Mensaje:',
        data.message,
        '',
        `${CONTACT_CONSENT.record} el ${new Date().toISOString()}.`,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      console.error('[contacto] Resend devolvió un error:', error)
      return NextResponse.json({ message: FORM_MESSAGES.error }, { status: 502 })
    }

    return NextResponse.json({ message: FORM_MESSAGES.success }, { status: 200 })
  } catch (error) {
    console.error('[contacto] Fallo inesperado al enviar:', error)
    return NextResponse.json({ message: FORM_MESSAGES.error }, { status: 500 })
  }
}
