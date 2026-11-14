// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  handleContactRequest,
  maxRequestLength,
  minFillTimeMs,
  resendEndpoint,
  type ContactEnv,
} from '@/server/contactHandler'

import contactFunction from '../api/contact'

const env: ContactEnv = {
  RESEND_API_KEY: 're_test_key',
  CONTACT_FROM_EMAIL: 'Website <website@example.com>',
  VITE_CONTACT_EMAIL: 'contact@example.com',
}

const validBody = {
  name: 'Test Visitor',
  email: 'visitor@example.com',
  visitorType: 'Architect',
  product: 'Paving blocks',
  message: 'Test message.',
  website: '',
  elapsedMs: 10_000,
}

function post(body: unknown, headers: HeadersInit = { 'Content-Type': 'application/json' }) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

/** The fake Resend API. Answers like Resend does when an email is accepted. */
const resend = vi.fn<typeof fetch>()

function sentEmail() {
  const [url, init] = resend.mock.calls[0]!
  return { url, init: init!, body: JSON.parse(init!.body as string) }
}

beforeEach(() => {
  resend.mockReset().mockResolvedValue(Response.json({ id: 'test-email-id' }, { status: 200 }))
  vi.stubGlobal('fetch', resend)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('handleContactRequest', () => {
  describe('normal cases', () => {
    it('sends one email through Resend and answers ok', async () => {
      const response = await handleContactRequest(post(validBody), env)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ ok: true })
      expect(resend).toHaveBeenCalledTimes(1)
      expect(sentEmail().url).toBe(resendEndpoint)
      expect(sentEmail().init.method).toBe('POST')
    })

    it('uses the API key from the environment', async () => {
      await handleContactRequest(post(validBody), env)

      expect(sentEmail().init.headers).toMatchObject({ Authorization: 'Bearer re_test_key' })
    })

    it('sends to the company inbox, from the configured sender, with replies to the visitor', async () => {
      await handleContactRequest(post(validBody), env)

      const { body } = sentEmail()
      expect(body.to).toEqual(['contact@example.com'])
      expect(body.from).toBe('Website <website@example.com>')
      expect(body.reply_to).toBe('visitor@example.com')
    })

    it('puts the visitor details and message in the email', async () => {
      await handleContactRequest(post(validBody), env)

      const { body } = sentEmail()
      expect(body.subject).toBe('Website enquiry from Test Visitor')
      expect(body.text).toBe(
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

    it('accepts a message with no product', async () => {
      const response = await handleContactRequest(post({ ...validBody, product: '' }), env)

      expect(response.status).toBe(200)
      expect(sentEmail().body.text).not.toContain('Product of interest')
    })
  })

  describe('spam protection', () => {
    it('drops the message quietly when the hidden trap field is filled in', async () => {
      const response = await handleContactRequest(
        post({ ...validBody, website: 'https://spam.example' }),
        env,
      )

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ ok: true })
      expect(resend).not.toHaveBeenCalled()
    })

    it.each([
      ['too fast', minFillTimeMs - 1],
      ['missing', undefined],
      ['not a number', '10000'],
    ])('drops the message quietly when the fill time is %s', async (_case, elapsedMs) => {
      const response = await handleContactRequest(post({ ...validBody, elapsedMs }), env)

      expect(response.status).toBe(200)
      expect(resend).not.toHaveBeenCalled()
    })

    it('accepts a form filled in exactly at the minimum time', async () => {
      await handleContactRequest(post({ ...validBody, elapsedMs: minFillTimeMs }), env)

      expect(resend).toHaveBeenCalledTimes(1)
    })
  })

  describe('expected errors', () => {
    it('refuses anything but POST', async () => {
      const response = await handleContactRequest(new Request('http://localhost/api/contact'), env)

      expect(response.status).toBe(405)
      expect(response.headers.get('Allow')).toBe('POST')
      expect(resend).not.toHaveBeenCalled()
    })

    it('refuses a body that is not JSON', async () => {
      const response = await handleContactRequest(
        post('name=Test', { 'Content-Type': 'application/x-www-form-urlencoded' }),
        env,
      )

      expect(response.status).toBe(415)
    })

    it.each([
      ['malformed JSON', '{"name": '],
      ['a list', '[]'],
      ['a string', '"hello"'],
      ['null', 'null'],
    ])('refuses %s', async (_case, body) => {
      const response = await handleContactRequest(post(body), env)

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ ok: false })
      expect(resend).not.toHaveBeenCalled()
    })

    it('refuses a request that is too large', async () => {
      const response = await handleContactRequest(
        post({ ...validBody, message: 'a'.repeat(maxRequestLength) }),
        env,
      )

      expect(response.status).toBe(413)
      expect(resend).not.toHaveBeenCalled()
    })

    it.each([
      ['an empty name', { name: ' ' }],
      ['a badly formatted email', { email: 'not-an-email' }],
      ['a missing message', { message: undefined }],
      ['a message that is too long', { message: 'a'.repeat(5001) }],
      ['a field of the wrong type', { name: 42 }],
      ['a visitor type the form does not offer', { visitorType: 'Robot' }],
      ['a product the form does not offer', { product: 'Mystery block' }],
    ])('refuses %s, like the form does', async (_case, change) => {
      const response = await handleContactRequest(post({ ...validBody, ...change }), env)

      expect(response.status).toBe(400)
      expect(resend).not.toHaveBeenCalled()
    })

    it.each(['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'VITE_CONTACT_EMAIL'] as const)(
      'fails clearly when %s is not set, without logging any secret',
      async (name) => {
        const response = await handleContactRequest(post(validBody), { ...env, [name]: '  ' })

        expect(response.status).toBe(500)
        expect(resend).not.toHaveBeenCalled()
        const logged = vi.mocked(console.error).mock.calls.flat().join(' ')
        expect(logged).toContain(name)
        expect(logged).not.toContain('re_test_key')
      },
    )

    it('fails when Resend refuses the email, and logs why', async () => {
      resend.mockResolvedValue(
        Response.json(
          { name: 'validation_error', message: 'Domain not verified' },
          { status: 403 },
        ),
      )

      const response = await handleContactRequest(post(validBody), env)

      expect(response.status).toBe(502)
      expect(await response.json()).toEqual({ ok: false })
      const logged = vi.mocked(console.error).mock.calls.flat().join(' ')
      expect(logged).toContain('403')
      expect(logged).toContain('Domain not verified')
    })

    it('fails when Resend cannot be reached', async () => {
      resend.mockRejectedValue(new TypeError('fetch failed'))

      const response = await handleContactRequest(post(validBody), env)

      expect(response.status).toBe(502)
    })
  })

  describe('edge cases', () => {
    it('cannot be tricked into adding recipients or changing the sender', async () => {
      await handleContactRequest(
        post({
          ...validBody,
          name: 'Test\r\nBcc: other@example.com',
          email: 'visitor@example.com',
          to: 'other@example.com',
          from: 'other@example.com',
        }),
        env,
      )

      const { body } = sentEmail()
      expect(body.to).toEqual(['contact@example.com'])
      expect(body.from).toBe('Website <website@example.com>')
      expect(body).not.toHaveProperty('bcc')
      expect(body.subject).not.toMatch(/[\r\n]/)
    })

    it('trims spaces around the settings and the visitor email', async () => {
      await handleContactRequest(post({ ...validBody, email: '  visitor@example.com  ' }), {
        RESEND_API_KEY: ' re_test_key ',
        CONTACT_FROM_EMAIL: ' Website <website@example.com> ',
        VITE_CONTACT_EMAIL: ' contact@example.com ',
      })

      const { body, init } = sentEmail()
      expect(init.headers).toMatchObject({ Authorization: 'Bearer re_test_key' })
      expect(body.to).toEqual(['contact@example.com'])
      expect(body.from).toBe('Website <website@example.com>')
      expect(body.reply_to).toBe('visitor@example.com')
    })

    it('accepts a JSON content type with a charset', async () => {
      const response = await handleContactRequest(
        post(validBody, { 'Content-Type': 'application/json; charset=utf-8' }),
        env,
      )

      expect(response.status).toBe(200)
    })
  })
})

describe('api/contact (Vercel function)', () => {
  it('handles requests with the settings from the environment', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_env_key')
    vi.stubEnv('CONTACT_FROM_EMAIL', 'Website <website@example.com>')
    vi.stubEnv('VITE_CONTACT_EMAIL', 'inbox@example.com')

    const response = await contactFunction.fetch(post(validBody))

    expect(response.status).toBe(200)
    expect(sentEmail().init.headers).toMatchObject({ Authorization: 'Bearer re_env_key' })
    expect(sentEmail().body.to).toEqual(['inbox@example.com'])
  })
})
