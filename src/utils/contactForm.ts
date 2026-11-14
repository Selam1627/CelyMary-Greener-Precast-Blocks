// This file is shared by the website and the Vercel function in api/. Vercel
// runs functions as native ES modules and doesn't support the "@/" alias, so
// imports here are relative and end in ".js".
import { contact } from '../content/contact.js'

export interface ContactFormValues {
  name: string
  email: string
  visitorType: string
  /** Optional: an empty string means no specific product. */
  product: string
  message: string
}

/** Extra fields sent with the message so the server can spot spam bots. */
export interface SpamCheck {
  /** The hidden trap field. People leave it empty; many bots fill it in. */
  website: string
  /** Milliseconds between showing the form and sending it. */
  elapsedMs: number
}

export type ContactRequestBody = ContactFormValues & SpamCheck

/** The required fields, in the order they appear on the form. */
export const requiredFields = ['name', 'email', 'visitorType', 'message'] as const

export type RequiredField = (typeof requiredFields)[number]

export type ContactFormErrors = Partial<Record<RequiredField, string>>

/** Longest accepted value of each typed field, in characters. */
export const maxLengths = {
  name: 100,
  /** The longest address email standards allow. */
  email: 254,
  message: 5000,
} as const

/** Where the website sends the form. Served by api/contact.ts. */
export const contactEndpoint = '/api/contact'

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Returns an error message for each field with a problem; empty when all are valid. */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()

  if (!name) {
    errors.name = contact.errors.nameRequired
  } else if (name.length > maxLengths.name) {
    errors.name = contact.errors.nameTooLong
  }

  if (!email) {
    errors.email = contact.errors.emailRequired
  } else if (email.length > maxLengths.email || !isValidEmail(email)) {
    errors.email = contact.errors.emailInvalid
  }

  if (!values.visitorType) {
    errors.visitorType = contact.errors.visitorTypeRequired
  }

  if (!message) {
    errors.message = contact.errors.messageRequired
  } else if (message.length > maxLengths.message) {
    errors.message = contact.errors.messageTooLong
  }

  return errors
}

/** The email subject. Line breaks in the name are flattened, so it stays on one line. */
export function buildEmailSubject(values: ContactFormValues): string {
  const name = values.name.trim().replace(/\s+/g, ' ')
  return `${contact.email.subjectPrefix} ${name}`
}

/** The plain-text email the company receives: the details, a blank line, then the message. */
export function buildEmailText(values: ContactFormValues): string {
  const { email } = contact

  const details = [
    `${email.nameLabel}: ${values.name.trim().replace(/\s+/g, ' ')}`,
    `${email.emailLabel}: ${values.email.trim()}`,
    `${email.visitorTypeLabel}: ${values.visitorType}`,
  ]
  if (values.product) {
    details.push(`${email.productLabel}: ${values.product}`)
  }

  return `${details.join('\n')}\n\n${values.message.trim().replace(/\r\n?/g, '\n')}`
}

/**
 * Sends the form to the website's own server. Returns true when the server
 * accepted the message, and false when it refused it or couldn't be reached.
 */
export async function sendContactMessage(
  values: ContactFormValues,
  spamCheck: SpamCheck,
): Promise<boolean> {
  const body: ContactRequestBody = { ...values, ...spamCheck }

  try {
    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return response.ok
  } catch {
    return false
  }
}
