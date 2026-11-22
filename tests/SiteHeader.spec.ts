import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import SiteHeader from '@/components/ui/SiteHeader.vue'
import { useLanguage } from '@/composables/useLanguage'
import { languages } from '@/content/languages'
import { siteContent } from '@/content/siteContent'
import { menuPages, type PageId } from '@/pages'

/** Mounted on the page, because keyboard focus needs a real document. */
function mountHeader(currentPage: PageId = 'home') {
  return mount(SiteHeader, { props: { currentPage }, attachTo: document.body })
}

function menuButton(wrapper: VueWrapper) {
  return wrapper.get('button[aria-controls="site-menu"]')
}

function menu(wrapper: VueWrapper) {
  return wrapper.get('#site-menu')
}

function links(wrapper: VueWrapper) {
  return menu(wrapper).findAll('a')
}

/** Open on phones: the menu has "flex" instead of "hidden". */
function isOpen(wrapper: VueWrapper) {
  return menu(wrapper).classes().includes('flex')
}

afterEach(() => {
  useLanguage().setLanguage('en')
  localStorage.clear()
  document.body.innerHTML = ''
})

describe('SiteHeader', () => {
  describe('normal cases', () => {
    it('lists the four pages in order, with their addresses', () => {
      const wrapper = mountHeader()

      expect(links(wrapper).map((link) => [link.text(), link.attributes('href')])).toEqual([
        ['Home', '/'],
        ['Products', '/products'],
        ['About us', '/about'],
        ['Contact', '/contact'],
      ])
    })

    it.each(menuPages.map((page) => page.id))('marks %s as the current page', (id) => {
      const wrapper = mountHeader(id)
      const current = links(wrapper).filter((link) => link.attributes('aria-current') === 'page')

      expect(current.map((link) => link.attributes('href'))).toEqual([
        menuPages.find((page) => page.id === id)!.path,
      ])
    })

    it('marks no page as current on the 404 page', () => {
      const wrapper = mountHeader('not-found')

      expect(links(wrapper).some((link) => link.attributes('aria-current'))).toBe(false)
    })

    it('shows the company name as a link to Home', () => {
      const home = mountHeader('products').get('header > div > a')

      expect(home.attributes('href')).toBe('/')
      expect(home.findAll('span').map((name) => name.text())).toEqual([
        'CelyMary',
        'CelyMary Greener Precast Blocks',
      ])
    })

    it('shows the colour logo next to the name, with an accessible label', () => {
      const logo = mountHeader().get('header > div > a').get('svg')

      expect(logo.attributes('data-variant')).toBe('color')
      expect(logo.attributes('role')).toBe('img')
      expect(logo.attributes('aria-label')).toBe('CelyMary logo')
    })

    it.each(languages.map((language) => language.code))('labels the logo in %s', async (code) => {
      const wrapper = mountHeader()

      useLanguage().setLanguage(code)
      await nextTick()

      expect(wrapper.get('header svg[role="img"]').attributes('aria-label')).toBe(
        siteContent[code].navigation.logoLabel,
      )
    })

    it('shows the short name on phones only, and the full name on wider screens', () => {
      const [short, full] = mountHeader().get('header > div > a').findAll('span')

      expect(short!.classes()).toEqual(['sm:hidden'])
      expect(full!.classes()).toEqual(['hidden', 'sm:inline'])
    })

    it.each([
      ['en', 'CelyMary', 'CelyMary Greener Precast Blocks'],
      ['es', 'CelyMary', 'CelyMary Greener Precast Blocks'],
      ['ti', 'ሰሊሜሪ', 'ሰሊሜሪ ሓምለዋይ ብሎኬት'],
      ['am', 'ሰሊሜሪ', 'ሰሊሜሪ አረንጓዴ ብሎኬት'],
    ] as const)(
      'uses the short name "%2$s" and the full name "%3$s" in %1$s',
      async (code, short, full) => {
        const wrapper = mountHeader()

        useLanguage().setLanguage(code)
        await nextTick()

        const names = wrapper
          .get('header > div > a')
          .findAll('span')
          .map((name) => name.text())
        expect(names).toEqual([short, full])
      },
    )

    it('includes the language switcher', () => {
      expect(mountHeader().find('#language-menu').exists()).toBe(true)
    })

    it.each(languages.map((language) => language.code))('shows the menu in %s', async (code) => {
      const wrapper = mountHeader()

      useLanguage().setLanguage(code)
      await nextTick()

      const { navigation } = siteContent[code]
      expect(links(wrapper).map((link) => link.text())).toEqual(
        menuPages.map((page) => navigation.pages[page.id]),
      )
      expect(wrapper.get('nav').attributes('aria-label')).toBe(navigation.menuLabel)
      expect(menuButton(wrapper).text()).toBe(navigation.menuButton)
    })
  })

  describe('on phones', () => {
    it('hides the menu behind a menu button', () => {
      const wrapper = mountHeader()

      expect(menuButton(wrapper).classes()).toContain('md:hidden')
      expect(menu(wrapper).classes()).toContain('hidden')
      expect(menu(wrapper).classes()).toContain('md:flex')
      expect(menuButton(wrapper).attributes('aria-expanded')).toBe('false')
    })

    it('opens and closes the menu with the button', async () => {
      const wrapper = mountHeader()

      await menuButton(wrapper).trigger('click')
      expect(isOpen(wrapper)).toBe(true)
      expect(menuButton(wrapper).attributes('aria-expanded')).toBe('true')

      await menuButton(wrapper).trigger('click')
      expect(isOpen(wrapper)).toBe(false)
      expect(menuButton(wrapper).attributes('aria-expanded')).toBe('false')
    })

    it('tells screen readers which menu the button opens', () => {
      expect(menuButton(mountHeader()).attributes('aria-controls')).toBe('site-menu')
    })

    it('closes with Escape and puts focus back on the menu button', async () => {
      const wrapper = mountHeader()
      await menuButton(wrapper).trigger('click')

      await links(wrapper)[1]!.trigger('keydown', { key: 'Escape' })

      expect(isOpen(wrapper)).toBe(false)
      expect(document.activeElement).toBe(menuButton(wrapper).element)
    })

    it('closes on a tap elsewhere on the page', async () => {
      const wrapper = mountHeader()
      await menuButton(wrapper).trigger('click')

      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await nextTick()

      expect(isOpen(wrapper)).toBe(false)
    })

    it('stays open on a tap inside the menu', async () => {
      const wrapper = mountHeader()
      await menuButton(wrapper).trigger('click')

      menu(wrapper).element.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await nextTick()

      expect(isOpen(wrapper)).toBe(true)
    })

    it('closes when keyboard focus leaves the menu', async () => {
      const wrapper = mountHeader()
      const outside = document.createElement('button')
      document.body.append(outside)
      await menuButton(wrapper).trigger('click')

      await links(wrapper)[3]!.trigger('focusout', { relatedTarget: outside })

      expect(isOpen(wrapper)).toBe(false)
    })

    it('closes when the visitor picks a page', async () => {
      const wrapper = mountHeader()
      await menuButton(wrapper).trigger('click')

      await links(wrapper)[1]!.trigger('click')

      expect(isOpen(wrapper)).toBe(false)
    })

    it('keeps the language switcher outside the collapsible menu, always visible', () => {
      const wrapper = mountHeader()

      expect(menu(wrapper).find('#language-menu').exists()).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('uses real links, large enough to tap, that keyboards can reach', () => {
      for (const link of links(mountHeader())) {
        expect(link.element.tagName).toBe('A')
        expect(link.attributes('tabindex')).toBeUndefined()
        expect(link.classes()).toContain('min-h-11')
      }
      expect(menuButton(mountHeader()).classes()).toEqual(
        expect.arrayContaining(['min-h-11', 'min-w-11']),
      )
    })

    it('shows the current page visibly, not only to screen readers', () => {
      const current = links(mountHeader('about'))[2]!

      expect(current.classes()).toContain('aria-[current=page]:bg-emerald-100')
      expect(current.attributes('aria-current')).toBe('page')
    })

    it('hides the menu icon from screen readers', () => {
      expect(menuButton(mountHeader()).get('svg').attributes('aria-hidden')).toBe('true')
    })
  })
})
