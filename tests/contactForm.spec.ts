import { afterEach, describe, expect, it, vi } from 'vitest'

import { languages } from '@/content/languages'
import { siteContent } from '@/content/siteContent'
import {
  contactEndpoint,
  isValidEmail,
  maxLengths,
  sendContactMessage,
  validateContactForm,
  type ContactFormValues,
} from '@/utils/contactForm'

const validValues: ContactFormValues = {
  name: 'Test Visitor',
  email: 'visitor@example.com',
  visitorType: 'architect',
  product: 'paving-blocks',
  message: 'Test message.',
}

const spamCheck = { website: '', elapsedMs: 10_000 }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('validateContactForm', () => {
  describe('normal cases', () => {
    it('finds no errors when every field is filled in', () => {
      expect(validateContactForm(validValues)).toEqual({})
    })

    it('does not require a product', () => {
      expect(validateContactForm({ ...validValues, product: '' })).toEqual({})
    })
  })

  describe('expected errors', () => {
    it('reports every required field when the form is empty', () => {
      const errors = validateContactForm({
        name: '',
        email: '',
        visitorType: '',
        product: '',
        message: '',
      })

      expect(errors).toEqual({
        name: 'nameRequired',
        email: 'emailRequired',
        visitorType: 'visitorTypeRequired',
        message: 'messageRequired',
      })
    })

    it('treats fields with only spaces as empty', () => {
      const errors = validateContactForm({
        ...validValues,
        name: '   ',
        email: '   ',
        message: ' \n ',
      })

      expect(errors).toEqual({
        name: 'nameRequired',
        email: 'emailRequired',
        message: 'messageRequired',
      })
    })

    it('uses a different message for a badly formatted email', () => {
      const errors = validateContactForm({ ...validValues, email: 'not-an-email' })

      expect(errors).toEqual({ email: 'emailInvalid' })
    })

    it('rejects a name, email or message that is too long', () => {
      const errors = validateContactForm({
        ...validValues,
        name: 'a'.repeat(maxLengths.name + 1),
        email: `${'a'.repeat(maxLengths.email)}@example.com`,
        message: 'a'.repeat(maxLengths.message + 1),
      })

      expect(errors).toEqual({
        name: 'nameTooLong',
        email: 'emailInvalid',
        message: 'messageTooLong',
      })
    })
  })

  describe('edge cases', () => {
    it('accepts a name and message exactly at the limit', () => {
      const errors = validateContactForm({
        ...validValues,
        name: 'a'.repeat(maxLengths.name),
        message: 'a'.repeat(maxLengths.message),
      })

      expect(errors).toEqual({})
    })

    it('ignores spaces around the text when counting its length', () => {
      const errors = validateContactForm({
        ...validValues,
        message: `  ${'a'.repeat(maxLengths.message)}  `,
      })

      expect(errors).toEqual({})
    })

    it.each(languages.map((language) => language.code))(
      'states the same limits in the %s error messages as it checks',
      (code) => {
        const { errors } = siteContent[code].contact

        expect(errors.nameTooLong).toContain(maxLengths.name.toLocaleString(code))
        expect(errors.messageTooLong).toContain(maxLengths.message.toLocaleString(code))
      },
    )
  })
})

describe('isValidEmail', () => {
  it.each([
    'name@example.com',
    'first.last@example.co.uk',
    'name+tag@example.com',
    '  name@example.com  ',
  ])('accepts %j', (email) => {
    expect(isValidEmail(email)).toBe(true)
  })

  it.each([
    '',
    'name',
    'name@',
    '@example.com',
    'name@example',
    'name@example.',
    'first last@example.com',
    'name@exa mple.com',
    'name@@example.com',
  ])('rejects %j', (email) => {
    expect(isValidEmail(email)).toBe(false)
  })
})

describe('sendContactMessage', () => {
  describe('normal cases', () => {
    it('posts the form and the spam check as JSON to the contact endpoint', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
      vi.stubGlobal('fetch', fetchMock)

      const sent = await sendContactMessage(validValues, spamCheck, 'es')

      expect(sent).toBe(true)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, init] = fetchMock.mock.calls[0]!
      expect(url).toBe(contactEndpoint)
      expect(init.method).toBe('POST')
      expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
      expect(JSON.parse(init.body)).toEqual({ ...validValues, ...spamCheck, language: 'es' })
    })
  })

  describe('expected errors', () => {
    it.each([400, 500, 502])('reports failure when the server answers %i', async (status) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"ok":false}', { status })))

      expect(await sendContactMessage(validValues, spamCheck, 'en')).toBe(false)
    })

    it('reports failure when the server cannot be reached', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

      expect(await sendContactMessage(validValues, spamCheck, 'en')).toBe(false)
    })
  })
})
