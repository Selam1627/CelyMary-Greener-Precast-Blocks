// This file is shared by the website and the Vercel function in api/. Vercel
// runs functions as native ES modules and doesn't support the "@/" alias, so
// imports here are relative and end in ".js".
import type { LanguageCode } from '../content/languages.js'
import type { ContactErrorTexts } from '../content/types.js'

export interface ContactFormValues {
  name: string
  email: string
  /** A visitor type id, such as "architect": the same in every language. */
  visitorType: string
  /** A product id, or an empty string for no specific product. */
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

export type ContactRequestBody = ContactFormValues &
  SpamCheck & {
    /** The language the visitor was reading the site in. */
    language: LanguageCode
  }

/** The required fields, in the order they appear on the form. */
export const requiredFields = ['name', 'email', 'visitorType', 'message'] as const

export type RequiredField = (typeof requiredFields)[number]

/** Names a text in the contact form's errors, in whichever language is shown. */
export type ContactErrorKey = keyof ContactErrorTexts

export type ContactFormErrors = Partial<Record<RequiredField, ContactErrorKey>>

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

/**
 * Returns the error of each field with a problem; empty when all are valid.
 * Errors are keys, so the form can show them in the visitor's language.
 */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()

  if (!name) {
    errors.name = 'nameRequired'
  } else if (name.length > maxLengths.name) {
    errors.name = 'nameTooLong'
  }

  if (!email) {
    errors.email = 'emailRequired'
  } else if (email.length > maxLengths.email || !isValidEmail(email)) {
    errors.email = 'emailInvalid'
  }

  if (!values.visitorType) {
    errors.visitorType = 'visitorTypeRequired'
  }

  if (!message) {
    errors.message = 'messageRequired'
  } else if (message.length > maxLengths.message) {
    errors.message = 'messageTooLong'
  }

  return errors
}

/**
 * Sends the form to the website's own server. Returns true when the server
 * accepted the message, and false when it refused it or couldn't be reached.
 */
export async function sendContactMessage(
  values: ContactFormValues,
  spamCheck: SpamCheck,
  language: LanguageCode,
): Promise<boolean> {
  const body: ContactRequestBody = { ...values, ...spamCheck, language }

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
