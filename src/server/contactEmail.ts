// Builds the email the company receives. Always in English, whatever language
// the visitor used, so the inbox stays readable. The visitor's own message is
// kept exactly as they wrote it.
//
// Imports are relative and end in ".js" because Vercel runs this as a native
// ES module and doesn't support the "@/" alias.
import { emailTemplate } from '../content/emailTemplate.js'
import { findLanguage, type LanguageCode } from '../content/languages.js'
import { en } from '../content/locales/en.js'
import type { ContactFormValues } from '../utils/contactForm.js'

/** A checked submission: the ids are ones the form offers. */
export interface ContactSubmission extends ContactFormValues {
  language: LanguageCode
}

/** True when the visitor type and product are ids the form offers. */
export function hasKnownChoices(values: ContactFormValues): boolean {
  const knownVisitorType = en.contact.visitorTypes.some((type) => type.id === values.visitorType)
  const knownProduct =
    values.product === '' || en.products.items.some((product) => product.id === values.product)
  return knownVisitorType && knownProduct
}

/** "Spanish (Español)", or just "English" when both names are the same. */
export function describeLanguage(code: LanguageCode): string {
  const { englishName, nativeName } = findLanguage(code)
  return englishName === nativeName ? englishName : `${englishName} (${nativeName})`
}

/** The email subject. Line breaks in the name are flattened, so it stays on one line. */
export function buildEmailSubject(values: ContactFormValues): string {
  const name = values.name.trim().replace(/\s+/g, ' ')
  return `${emailTemplate.subjectPrefix} ${name}`
}

/** The plain-text email: the details, a blank line, then the message. */
export function buildEmailText(submission: ContactSubmission): string {
  const visitorType =
    en.contact.visitorTypes.find((type) => type.id === submission.visitorType)?.label ??
    submission.visitorType
  const product = en.products.items.find((item) => item.id === submission.product)?.name

  const details = [
    `${emailTemplate.nameLabel}: ${submission.name.trim().replace(/\s+/g, ' ')}`,
    `${emailTemplate.emailLabel}: ${submission.email.trim()}`,
    `${emailTemplate.visitorTypeLabel}: ${visitorType}`,
  ]
  if (product) {
    details.push(`${emailTemplate.productLabel}: ${product}`)
  }
  details.push(`${emailTemplate.languageLabel}: ${describeLanguage(submission.language)}`)

  return `${details.join('\n')}\n\n${submission.message.trim().replace(/\r\n?/g, '\n')}`
}
