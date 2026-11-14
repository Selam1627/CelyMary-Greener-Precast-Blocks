// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { languages } from '@/content/languages'
import { en } from '@/content/locales/en'
import {
  buildEmailSubject,
  buildEmailText,
  describeLanguage,
  hasKnownChoices,
  type ContactSubmission,
} from '@/server/contactEmail'

const submission: ContactSubmission = {
  name: 'Test Visitor',
  email: 'visitor@example.com',
  visitorType: 'architect',
  product: 'paving-blocks',
  message: 'Test message.',
  language: 'en',
}

describe('buildEmailSubject', () => {
  it('names the visitor', () => {
    expect(buildEmailSubject(submission)).toBe('Website enquiry from Test Visitor')
  })

  it('keeps the subject on one line, whatever the name contains', () => {
    const subject = buildEmailSubject({ ...submission, name: '  Test\r\nBcc: other@example.com ' })

    expect(subject).toBe('Website enquiry from Test Bcc: other@example.com')
    expect(subject).not.toMatch(/[\r\n]/)
  })

  it('keeps a name written in Ethiopic script as it is', () => {
    expect(buildEmailSubject({ ...submission, name: 'ሰላም' })).toBe('Website enquiry from ሰላም')
  })
})

describe('buildEmailText', () => {
  describe('normal cases', () => {
    it('lists the details in English, then the message', () => {
      expect(buildEmailText(submission)).toBe(
        [
          'Name: Test Visitor',
          'Email: visitor@example.com',
          'Visitor type: Architect',
          'Product of interest: Paving blocks',
          'Language: English',
          '',
          'Test message.',
        ].join('\n'),
      )
    })

    it.each([
      ['es', 'Spanish (Español)'],
      ['ti', 'Tigrinya (ትግርኛ)'],
      ['am', 'Amharic (አማርኛ)'],
    ] as const)(
      'stays in English for a visitor reading in %s, and names their language',
      (language, name) => {
        const text = buildEmailText({ ...submission, language, message: 'Mensaje de prueba.' })

        expect(text).toContain('Visitor type: Architect\n')
        expect(text).toContain('Product of interest: Paving blocks\n')
        expect(text).toContain(`Language: ${name}\n`)
        expect(text.endsWith('\n\nMensaje de prueba.')).toBe(true)
      },
    )
  })

  describe('edge cases', () => {
    it('leaves out the product line when no product is chosen', () => {
      expect(buildEmailText({ ...submission, product: '' })).not.toContain('Product of interest')
    })

    it('removes spaces around what the visitor typed', () => {
      const text = buildEmailText({
        ...submission,
        name: '  Test Visitor  ',
        email: '  visitor@example.com  ',
        message: '  Test message.  ',
      })

      expect(text).toContain('Name: Test Visitor\n')
      expect(text).toContain('Email: visitor@example.com\n')
      expect(text.endsWith('\n\nTest message.')).toBe(true)
    })

    it('keeps the line breaks in a message, whatever kind they are', () => {
      const text = buildEmailText({ ...submission, message: 'One\r\nTwo\rThree\nFour' })

      expect(text.endsWith('One\nTwo\nThree\nFour')).toBe(true)
    })

    it('keeps accents, symbols and Ethiopic script intact', () => {
      const message = 'Hola, ¿cómo están? 100% + más & "otros" #1 <b> ሰላም። ከመይ ኣለኹም?'

      expect(buildEmailText({ ...submission, message })).toContain(message)
    })
  })
})

describe('describeLanguage', () => {
  it('names every language in English, with its own name when different', () => {
    expect(languages.map((language) => describeLanguage(language.code))).toEqual([
      'English',
      'Spanish (Español)',
      'Tigrinya (ትግርኛ)',
      'Amharic (አማርኛ)',
    ])
  })
})

describe('hasKnownChoices', () => {
  it('accepts every visitor type and product the form offers, and no product', () => {
    for (const type of en.contact.visitorTypes) {
      for (const product of ['', ...en.products.items.map((item) => item.id)]) {
        expect(hasKnownChoices({ ...submission, visitorType: type.id, product })).toBe(true)
      }
    }
  })

  it.each([
    ['an unknown visitor type', { visitorType: 'robot' }],
    ['an English label instead of an id', { visitorType: 'Architect' }],
    ['a translated label instead of an id', { visitorType: 'Arquitecto/a' }],
    ['an unknown product', { product: 'mystery-block' }],
    ['a product name instead of an id', { product: 'Paving blocks' }],
  ])('refuses %s', (_case, change) => {
    expect(hasKnownChoices({ ...submission, ...change })).toBe(false)
  })
})
