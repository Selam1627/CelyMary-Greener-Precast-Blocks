import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import SiteFooter from '@/components/ui/SiteFooter.vue'
import { useLanguage } from '@/composables/useLanguage'
import { languages } from '@/content/languages'
import { siteContent } from '@/content/siteContent'
import { footerPages, type PageId } from '@/pages'
import { pageName } from '@/utils/pageTitle'

const testAddress = 'contact@example.com'

function mountFooter(currentPage: PageId = 'home') {
  return mount(SiteFooter, { props: { currentPage } })
}

function links(wrapper: VueWrapper) {
  return wrapper.get('nav').findAll('a')
}

beforeEach(() => {
  vi.stubEnv('VITE_CONTACT_EMAIL', testAddress)
})

afterEach(() => {
  vi.unstubAllEnvs()
  useLanguage().setLanguage('en')
  localStorage.clear()
})

describe('SiteFooter', () => {
  describe('normal cases', () => {
    it('shows the logo for dark backgrounds and the company name', () => {
      const wrapper = mountFooter()
      const logo = wrapper.get('svg')

      expect(logo.attributes('data-variant')).toBe('dark')
      expect(wrapper.text()).toContain('CelyMary Greener Precast Blocks')
    })

    it('links to every page and the privacy notice, in order', () => {
      expect(links(mountFooter()).map((link) => [link.text(), link.attributes('href')])).toEqual([
        ['Home', '/'],
        ['Products', '/products'],
        ['About us', '/about'],
        ['Contact', '/contact'],
        ['Privacy notice', '/privacy'],
      ])
    })

    it('shows the company email as a link', () => {
      const email = mountFooter().get('a[href^="mailto:"]')

      expect(email.attributes('href')).toBe(`mailto:${testAddress}`)
      expect(email.text()).toBe(testAddress)
      expect(email.element.parentElement!.textContent).toContain(`Email: ${testAddress}`)
    })

    it('shows the copyright line', () => {
      expect(mountFooter().text()).toContain('© 2026 CelyMary Greener Precast Blocks')
    })

    it.each(languages.map((language) => language.code))('is translated into %s', async (code) => {
      const wrapper = mountFooter()

      useLanguage().setLanguage(code)
      await nextTick()

      const texts = siteContent[code]
      expect(links(wrapper).map((link) => link.text())).toEqual(
        footerPages.map((page) => pageName(page.id, texts)),
      )
      expect(wrapper.get('nav').attributes('aria-label')).toBe(texts.footer.label)
      expect(wrapper.text()).toContain(texts.footer.emailLabel)
      expect(wrapper.text()).toContain(texts.footer.copyright)
    })

    it.each([
      ['en', 'CelyMary Greener Precast Blocks'],
      ['es', 'CelyMary Greener Precast Blocks'],
      ['ti', 'ሰሊሜሪ ሓምለዋይ ብሎኬት'],
      ['am', 'ሰሊሜሪ አረንጓዴ ብሎኬት'],
    ] as const)('writes the company name as "%2$s" in %1$s', async (code, name) => {
      const wrapper = mountFooter()

      useLanguage().setLanguage(code)
      await nextTick()

      expect(wrapper.get('p').text()).toBe(name)
      expect(wrapper.text()).toContain(`© 2026 ${name}`)
    })
  })

  describe('edge cases', () => {
    it.each(footerPages.map((page) => page.id))('marks %s as the current page', (id) => {
      const current = links(mountFooter(id)).filter(
        (link) => link.attributes('aria-current') === 'page',
      )

      expect(current).toHaveLength(1)
      expect(current[0]!.attributes('href')).toBe(footerPages.find((page) => page.id === id)!.path)
    })

    it('marks no page as current on the 404 page', () => {
      expect(links(mountFooter('not-found')).some((link) => link.attributes('aria-current'))).toBe(
        false,
      )
    })

    it('has no social media links', () => {
      for (const link of mountFooter().findAll('a')) {
        const href = link.attributes('href')!
        expect(href.startsWith('/') || href.startsWith('mailto:')).toBe(true)
      }
    })

    it.each([
      ['missing', undefined],
      ['empty', ''],
      ['only spaces', '   '],
    ])('leaves out the email line when the address is %s', (_case, address) => {
      vi.stubEnv('VITE_CONTACT_EMAIL', address as string)
      const wrapper = mountFooter()

      expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Email:')
    })

    it('has links large enough to tap on phones', () => {
      for (const link of links(mountFooter())) {
        expect(link.classes()).toContain('min-h-11')
      }
    })

    it('is a labelled navigation landmark inside a footer landmark', () => {
      const wrapper = mountFooter()

      expect(wrapper.element.tagName).toBe('FOOTER')
      expect(wrapper.get('nav').attributes('aria-label')).toBe('Footer')
    })

    it('uses the dark brand colour behind white text', () => {
      expect(mountFooter().classes()).toEqual(
        expect.arrayContaining(['bg-brand-dark', 'text-white']),
      )
    })
  })
})
