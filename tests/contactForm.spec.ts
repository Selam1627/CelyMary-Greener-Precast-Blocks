import { afterEach, describe, expect, it, vi } from 'vitest'

import { contact } from '@/content/contact'
import {
  buildEmailSubject,
  buildEmailText,
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
  visitorType: 'Architect',
  product: 'Paving blocks',
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
        name: contact.errors.nameRequired,
        email: contact.errors.emailRequired,
        visitorType: contact.errors.visitorTypeRequired,
        message: contact.errors.messageRequired,
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
        name: contact.errors.nameRequired,
        email: contact.errors.emailRequired,
        message: contact.errors.messageRequired,
      })
    })

    it('uses a different message for a badly formatted email', () => {
      const errors = validateContactForm({ ...validValues, email: 'not-an-email' })

      expect(errors).toEqual({ email: contact.errors.emailInvalid })
    })

    it('rejects a name, email or message that is too long', () => {
      const errors = validateContactForm({
        ...validValues,
        name: 'a'.repeat(maxLengths.name + 1),
        email: `${'a'.repeat(maxLengths.email)}@example.com`,
        message: 'a'.repeat(maxLengths.message + 1),
      })

      expect(errors).toEqual({
        name: contact.errors.nameTooLong,
        email: contact.errors.emailInvalid,
        message: contact.errors.messageTooLong,
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

    it('states the same limits in the error messages as it checks', () => {
      expect(contact.errors.nameTooLong).toContain(maxLengths.name.toLocaleString('en-US'))
      expect(contact.errors.messageTooLong).toContain(maxLengths.message.toLocaleString('en-US'))
    })
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

describe('buildEmailSubject', () => {
  it('names the visitor', () => {
    expect(buildEmailSubject(validValues)).toBe('Website enquiry from Test Visitor')
  })

  it('keeps the subject on one line, whatever the name contains', () => {
    const subject = buildEmailSubject({ ...validValues, name: '  Test\r\nBcc: other@example.com ' })

    expect(subject).toBe('Website enquiry from Test Bcc: other@example.com')
    expect(subject).not.toMatch(/[\r\n]/)
  })
})

describe('buildEmailText', () => {
  describe('normal cases', () => {
    it('lists the details, then the message', () => {
      expect(buildEmailText(validValues)).toBe(
        [
          'Name: Test Visitor',
          'Email: visitor@example.com',
          'Visitor type: Architect',
          'Product of interest: Paving blocks',
          '',
          'Test message.',
        ].join('\n'),
      )
    })
  })

  describe('edge cases', () => {
    it('leaves out the product line when no product is chosen', () => {
      expect(buildEmailText({ ...validValues, product: '' })).not.toContain('Product of interest')
    })

    it('removes spaces around what the visitor typed', () => {
      const text = buildEmailText({
        ...validValues,
        name: '  Test Visitor  ',
        email: '  visitor@example.com  ',
        message: '  Test message.  ',
      })

      expect(text).toContain('Name: Test Visitor\n')
      expect(text).toContain('Email: visitor@example.com\n')
      expect(text.endsWith('\n\nTest message.')).toBe(true)
    })

    it('keeps the line breaks in a message, whatever kind they are', () => {
      const text = buildEmailText({ ...validValues, message: 'One\r\nTwo\rThree\nFour' })

      expect(text.endsWith('One\nTwo\nThree\nFour')).toBe(true)
    })

    it('keeps accents and symbols intact', () => {
      const message = 'Hola, ¿cómo están? 100% + más & "otros" #1 <b>'

      expect(buildEmailText({ ...validValues, message })).toContain(message)
    })
  })
})

describe('sendContactMessage', () => {
  describe('normal cases', () => {
    it('posts the form and the spam check as JSON to the contact endpoint', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
      vi.stubGlobal('fetch', fetchMock)

      const sent = await sendContactMessage(validValues, spamCheck)

      expect(sent).toBe(true)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, init] = fetchMock.mock.calls[0]!
      expect(url).toBe(contactEndpoint)
      expect(init.method).toBe('POST')
      expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
      expect(JSON.parse(init.body)).toEqual({ ...validValues, ...spamCheck })
    })
  })

  describe('expected errors', () => {
    it.each([400, 500, 502])('reports failure when the server answers %i', async (status) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"ok":false}', { status })))

      expect(await sendContactMessage(validValues, spamCheck)).toBe(false)
    })

    it('reports failure when the server cannot be reached', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

      expect(await sendContactMessage(validValues, spamCheck)).toBe(false)
    })
  })
})
