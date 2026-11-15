import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import App from '@/App.vue'
import { useLanguage } from '@/composables/useLanguage'
import { languages } from '@/content/languages'
import { siteContent } from '@/content/siteContent'
import { menuPages, notFoundPage, pathOf, type PageId } from '@/pages'
import { pageTitle } from '@/utils/pageTitle'

const allPages: PageId[] = [...menuPages.map((page) => page.id), notFoundPage.id]
const codes = languages.map((language) => language.code)

function mountPage(page: PageId) {
  return mount(App, { props: { page } })
}

/** The ids of the sections in the main content, in order. */
function sectionIds(page: PageId) {
  return mountPage(page)
    .get('main')
    .findAll('main > section')
    .map((section) => section.attributes('id') ?? section.attributes('aria-labelledby'))
}

afterEach(() => {
  useLanguage().setLanguage('en')
  localStorage.clear()
  document.title = ''
})

describe('pages', () => {
  describe('normal cases', () => {
    it('Home shows the hero and "Our solution"', () => {
      const wrapper = mountPage('home')

      expect(wrapper.get('main h1').text()).toBe('CelyMary Greener Precast Blocks')
      expect(sectionIds('home')).toEqual([undefined, 'our-solution'])
      expect(wrapper.get('main h2').text()).toBe('Our solution')
    })

    it('Products shows the planned products', () => {
      expect(sectionIds('products')).toEqual(['products'])
      expect(mountPage('products').get('h1').text()).toBe('Our planned products')
    })

    it('About us shows work with us, the roadmap and the team', () => {
      expect(sectionIds('about')).toEqual(['work-with-us', 'roadmap', 'team'])
      expect(mountPage('about').get('h1').text()).toBe('Work with us')
    })

    it('Contact shows the contact form', () => {
      const wrapper = mountPage('contact')

      expect(sectionIds('contact')).toEqual(['contact'])
      expect(wrapper.get('h1').text()).toBe('Contact us')
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('the 404 page says the page was not found and links to Home', () => {
      const wrapper = mountPage('not-found')
      const link = wrapper.get('main a')

      expect(wrapper.get('h1').text()).toBe('Page not found')
      expect(wrapper.text()).toContain("Sorry, we couldn't find the page you were looking for.")
      expect(link.text()).toBe('Go to the home page')
      expect(link.attributes('href')).toBe('/')
    })

    it('shows each section on exactly one page', () => {
      const all = menuPages.flatMap((page) => sectionIds(page.id)).filter(Boolean)

      expect(new Set(all).size).toBe(all.length)
      expect(all).toHaveLength(6)
    })

    it.each([
      ['Work with us', '/about'],
      ['Contact', '/contact'],
    ])('the hero button "%s" opens %s', (label, path) => {
      const button = mountPage('home')
        .get('main')
        .findAll('a')
        .find((link) => link.text() === label)!

      expect(button.attributes('href')).toBe(path)
    })
  })

  describe('edge cases', () => {
    it.each(allPages)(
      'the %s page has exactly one main heading, inside the main content',
      (page) => {
        const wrapper = mountPage(page)

        expect(wrapper.findAll('h1')).toHaveLength(1)
        expect(wrapper.find('main h1').exists()).toBe(true)
      },
    )

    it.each(allPages)('the %s page has a single header, menu and language switcher', (page) => {
      const wrapper = mountPage(page)

      expect(wrapper.findAll('header')).toHaveLength(1)
      expect(wrapper.findAll('#site-menu')).toHaveLength(1)
      expect(wrapper.findAll('#language-menu')).toHaveLength(1)
    })

    it('keeps the headings that follow the first one as section headings', () => {
      const headings = mountPage('about')
        .findAll('main h1, main h2')
        .map((heading) => `${heading.element.tagName}: ${heading.text()}`)

      expect(headings).toEqual(['H1: Work with us', 'H2: Stage and roadmap', 'H2: Team'])
    })
  })

  describe('browser tab titles', () => {
    it.each([
      ['home', 'CelyMary Greener Precast Blocks'],
      ['products', 'Products – CelyMary Greener Precast Blocks'],
      ['about', 'About us – CelyMary Greener Precast Blocks'],
      ['contact', 'Contact – CelyMary Greener Precast Blocks'],
      ['not-found', 'Page not found – CelyMary Greener Precast Blocks'],
    ] as const)('the %s page is titled "%s"', (page, title) => {
      mountPage(page)

      expect(document.title).toBe(title)
    })

    it.each(codes)('every page has its own title in %s', (code) => {
      useLanguage().setLanguage(code)

      const titles = allPages.map((page) => {
        mountPage(page)
        return document.title
      })

      expect(titles).toEqual(allPages.map((page) => pageTitle(page, siteContent[code])))
      expect(new Set(titles).size).toBe(titles.length)
    })

    it('changes the title when the visitor changes language', async () => {
      mountPage('products')

      useLanguage().setLanguage('ti')
      await nextTick()

      expect(document.title).toBe('ፍርያት – CelyMary Greener Precast Blocks')
    })
  })

  describe('in every language', () => {
    it.each(codes)('every page shows its texts in %s', (code) => {
      useLanguage().setLanguage(code)
      const texts = siteContent[code]

      expect(mountPage('home').get('main h2').text()).toBe(texts.solution.heading)
      expect(mountPage('products').get('h1').text()).toBe(texts.products.heading)
      expect(mountPage('about').get('h1').text()).toBe(texts.audiences.heading)
      expect(mountPage('contact').get('h1').text()).toBe(texts.contact.heading)
      expect(mountPage('not-found').get('h1').text()).toBe(texts.notFound.heading)
    })
  })

  describe('pathOf', () => {
    it('gives each page its address', () => {
      expect(menuPages.map((page) => pathOf(page.id))).toEqual([
        '/',
        '/products',
        '/about',
        '/contact',
      ])
    })
  })
})
