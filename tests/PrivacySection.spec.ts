import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import PrivacySection from '@/components/sections/PrivacySection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { languages, type LanguageCode } from '@/content/languages'
import { siteContent } from '@/content/siteContent'

const testAddress = 'contact@example.com'
const codes = languages.map((language) => language.code)

function mountIn(code: LanguageCode = 'en') {
  useLanguage().setLanguage(code)
  return mount(PrivacySection)
}

beforeEach(() => {
  vi.stubEnv('VITE_CONTACT_EMAIL', testAddress)
})

afterEach(() => {
  vi.unstubAllEnvs()
  useLanguage().setLanguage('en')
  localStorage.clear()
})

describe('PrivacySection', () => {
  describe('what the notice covers (English)', () => {
    const text = () => mountIn('en').text()

    it('names the responsible person and how to contact them', () => {
      expect(text()).toContain(
        'Selam Berhe Beyene, founder of CelyMary Greener Precast Blocks, is responsible for your personal data. You can contact us at contact@example.com.',
      )
    })

    it('lists exactly what the contact form sends', () => {
      for (const field of [
        'your name',
        'your email address',
        'who you are',
        'the product you are interested in',
        'your message',
        'the language you were reading the site in',
      ]) {
        expect(text()).toContain(field)
      }
    })

    it('says the data is used only to reply', () => {
      expect(text()).toContain('We use your details only to read your message and reply to you.')
    })

    it('names the services that process the data, and that they may be outside the EU', () => {
      for (const service of ['Vercel', 'Resend', 'Google (Gmail)']) {
        expect(text()).toContain(service)
      }
      expect(text()).toContain('These providers may process data outside the European Union.')
    })

    it('gives the legal basis and the retention period', () => {
      expect(text()).toContain('on the basis of your consent')
      expect(text()).toContain('12 months after our conversation ends')
    })

    it('lists every right and how to use it', () => {
      for (const right of [
        'access',
        'correction',
        'deletion',
        'objection',
        'restriction',
        'portability',
      ]) {
        expect(text()).toContain(`(${right})`)
      }
      expect(text()).toContain(`To use any of these rights, write to ${testAddress}.`)
    })

    it('names the AEPD and links to its website', () => {
      const link = mountIn('en').get('a[href="https://www.aepd.es"]')

      expect(text()).toContain('Spanish Data Protection Agency')
      expect(link.text()).toBe('www.aepd.es')
    })

    it('says the language choice stays in the browser', () => {
      expect(text()).toContain('your browser saves that choice on your own device')
    })

    it('says the site uses no cookies or trackers', () => {
      expect(text()).toContain('does not use cookies, analytics or advertising trackers')
    })
  })

  describe.each(codes)('in %s', (code) => {
    it('shows the heading, the introduction and every part of the notice', () => {
      const wrapper = mountIn(code)
      const { privacy } = siteContent[code]

      expect(wrapper.get('h1').text()).toBe(privacy.heading)
      expect(wrapper.text()).toContain(privacy.intro)
      expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual(
        privacy.sections.map((part) => part.heading),
      )
    })

    it('turns every {email} into a link to the company email', () => {
      const wrapper = mountIn(code)
      const placeholders = siteContent[code].privacy.sections
        .flatMap((part) => part.paragraphs)
        .join(' ')
        .match(/\{email\}/g)

      expect(wrapper.findAll(`a[href="mailto:${testAddress}"]`)).toHaveLength(placeholders!.length)
      expect(wrapper.text()).not.toMatch(/\{\w+\}/)
    })

    it('mentions every service, the AEPD and the retention period', () => {
      const text = mountIn(code).text()

      for (const name of ['Vercel', 'Resend', 'Gmail', 'AEPD', '12']) {
        expect(text).toContain(name)
      }
    })
  })

  describe('edge cases', () => {
    it('names the company email in words when no address is set', () => {
      vi.stubEnv('VITE_CONTACT_EMAIL', '')
      const wrapper = mountIn('en')

      expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(false)
      expect(wrapper.text()).toContain('You can contact us at the company email address.')
      expect(wrapper.text()).not.toMatch(/\{\w+\}/)
    })

    it('has one main heading, then a labelled section per part', () => {
      const wrapper = mountIn('en')

      expect(wrapper.findAll('h1')).toHaveLength(1)
      for (const part of wrapper.findAll('section section')) {
        const heading = wrapper.get(`#${part.attributes('aria-labelledby')}`)
        expect(heading.element.tagName).toBe('H2')
      }
    })

    it('uses the same parts, in the same order, in every language', () => {
      const ids = (code: LanguageCode) => siteContent[code].privacy.sections.map((part) => part.id)

      for (const code of codes) {
        expect(ids(code)).toEqual(ids('en'))
      }
    })
  })
})
