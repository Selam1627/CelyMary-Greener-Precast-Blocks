// Runs on the server only: in the Vercel function (api/contact.ts) and, during
// development, in the Vite dev server (vite.config.ts). It holds the email API
// key, so it must never be imported by website code.
//
// Imports are relative and end in ".js" because Vercel runs this as a native
// ES module and doesn't support the "@/" alias.
import { contact } from '../content/contact.js'
import { products } from '../content/products.js'
import {
  buildEmailSubject,
  buildEmailText,
  validateContactForm,
  type ContactFormValues,
} from '../utils/contactForm.js'

/** The environment variables the handler reads. */
export interface ContactEnv {
  /** Secret. Resend API key; set in .env and in the Vercel project settings. */
  RESEND_API_KEY?: string
  /** Sender shown on the email, for example "Website <onboarding@resend.dev>". */
  CONTACT_FROM_EMAIL?: string
  /** Company inbox that receives the messages. Public: also shown on the website. */
  VITE_CONTACT_EMAIL?: string
}

/** Forms sent faster than this after the page loaded are treated as bots. */
export const minFillTimeMs = 3000

/** Request bodies longer than this many characters are refused before they are read as JSON. */
export const maxRequestLength = 20_000

export const resendEndpoint = 'https://api.resend.com/emails'

function json(
  status: number,
  body: { ok: boolean },
  headers: Record<string, string> = {},
): Response {
  return Response.json(body, { status, headers })
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/** Reads the form fields from the request body; anything missing or of the wrong type becomes empty. */
function readBody(body: Record<string, unknown>) {
  const values: ContactFormValues = {
    name: text(body.name),
    email: text(body.email),
    visitorType: text(body.visitorType),
    product: text(body.product),
    message: text(body.message),
  }
  const elapsedMs = typeof body.elapsedMs === 'number' ? body.elapsedMs : Number.NaN
  return { values, website: text(body.website), elapsedMs }
}

/** True when the visitor type and product are ones the form offers. */
function hasKnownChoices(values: ContactFormValues): boolean {
  const knownProduct =
    values.product === '' || products.items.some((product) => product.name === values.product)
  return contact.visitorTypes.includes(values.visitorType) && knownProduct
}

/**
 * Checks a contact form submission and sends it to the company inbox through
 * Resend. Responds with { ok: true } when the message was sent (or quietly
 * dropped as spam), and { ok: false } with an error status otherwise.
 */
export async function handleContactRequest(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return json(405, { ok: false }, { Allow: 'POST' })
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json(415, { ok: false })
  }

  const raw = await request.text()
  if (raw.length > maxRequestLength) {
    return json(413, { ok: false })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return json(400, { ok: false })
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return json(400, { ok: false })
  }

  const { values, website, elapsedMs } = readBody(parsed as Record<string, unknown>)

  // Spam: answer as if it worked, so bots get no hint, but send nothing.
  if (website.trim() !== '' || !(elapsedMs >= minFillTimeMs)) {
    return json(200, { ok: true })
  }

  if (Object.keys(validateContactForm(values)).length > 0 || !hasKnownChoices(values)) {
    return json(400, { ok: false })
  }

  const apiKey = env.RESEND_API_KEY?.trim()
  const from = env.CONTACT_FROM_EMAIL?.trim()
  const to = env.VITE_CONTACT_EMAIL?.trim()
  if (!apiKey || !from || !to) {
    const missing = [
      !apiKey && 'RESEND_API_KEY',
      !from && 'CONTACT_FROM_EMAIL',
      !to && 'VITE_CONTACT_EMAIL',
    ].filter(Boolean)
    console.error(`Contact form is not configured. Missing: ${missing.join(', ')}`)
    return json(500, { ok: false })
  }

  try {
    const response = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        // Replies go to the visitor. Their address is never used as the sender.
        reply_to: values.email.trim(),
        subject: buildEmailSubject(values),
        text: buildEmailText(values),
      }),
    })

    if (!response.ok) {
      // Resend's error explains what to fix (for example an unverified sender)
      // and doesn't contain the visitor's message.
      const detail = await response.text().catch(() => '')
      console.error(`Resend refused the message (HTTP ${response.status}): ${detail}`)
      return json(502, { ok: false })
    }
  } catch (error) {
    console.error('Could not reach Resend:', error)
    return json(502, { ok: false })
  }

  return json(200, { ok: true })
}
