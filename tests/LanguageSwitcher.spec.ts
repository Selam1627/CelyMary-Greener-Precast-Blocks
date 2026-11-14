import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import App from '@/App.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useLanguage } from '@/composables/useLanguage'
import { siteContent } from '@/content/siteContent'

/** Mounted on the page, because keyboard focus needs a real document. */
function mountSwitcher() {
  return mount(LanguageSwitcher, { attachTo: document.body })
}

function mountPage() {
  return mount(App, { attachTo: document.body })
}

type Wrapper = VueWrapper

function toggle(wrapper: Wrapper) {
  return wrapper.get('nav > button')
}

function menu(wrapper: Wrapper) {
  return wrapper.get('#language-menu')
}

function isOpen(wrapper: Wrapper) {
  return (menu(wrapper).element as HTMLElement).style.display !== 'none'
}

function options(wrapper: Wrapper) {
  return menu(wrapper).findAll('button')
}

function option(wrapper: Wrapper, name: string) {
  return options(wrapper).find((item) => item.text() === name)!
}

async function openMenu(wrapper: Wrapper) {
  await toggle(wrapper).trigger('click')
  await nextTick()
}

/** Opens the menu and picks a language by its own name. */
async function choose(wrapper: Wrapper, name: string) {
  await openMenu(wrapper)
  await option(wrapper, name).trigger('click')
}

async function key(wrapper: Wrapper, name: string) {
  await wrapper.get('#language-menu').trigger('keydown', { key: name })
}

afterEach(() => {
  useLanguage().setLanguage('en')
  localStorage.clear()
  document.body.innerHTML = ''
  vi.resetModules()
})

describe('LanguageSwitcher', () => {
  describe('normal cases', () => {
    it('shows a globe and the current language code while closed', () => {
      const wrapper = mountSwitcher()

      expect(toggle(wrapper).find('svg[data-icon="globe"]').exists()).toBe(true)
      expect(toggle(wrapper).text()).toBe('EN')
      expect(isOpen(wrapper)).toBe(false)
    })

    it('lists each language in its own name and script when opened', async () => {
      const wrapper = mountSwitcher()

      await openMenu(wrapper)

      expect(isOpen(wrapper)).toBe(true)
      expect(options(wrapper).map((item) => item.text())).toEqual([
        'English',
        'Español',
        'ትግርኛ',
        'አማርኛ',
      ])
      expect(options(wrapper).map((item) => item.attributes('lang'))).toEqual([
        'en',
        'es',
        'ti',
        'am',
      ])
    })

    it.each([
      ['Español', 'es', 'ES'],
      ['ትግርኛ', 'ti', 'TI'],
      ['አማርኛ', 'am', 'AM'],
    ] as const)('switches the whole page to %s', async (name, code, shortCode) => {
      const wrapper = mountPage()

      await choose(wrapper, name)

      const texts = siteContent[code]
      expect(wrapper.get('h2').text()).toBe(texts.solution.heading)
      expect(wrapper.get('#contact-heading').text()).toBe(texts.contact.heading)
      expect(wrapper.get('a[href="#work-with-us"]').text()).toBe(texts.hero.actions[0]!.label)
      expect(document.documentElement.lang).toBe(code)
      expect(toggle(wrapper).text()).toBe(shortCode)
    })

    it('closes the menu and puts focus back on the button after a choice', async () => {
      const wrapper = mountSwitcher()

      await choose(wrapper, 'Español')

      expect(isOpen(wrapper)).toBe(false)
      expect(document.activeElement).toBe(toggle(wrapper).element)
    })

    it('switches back to English', async () => {
      const wrapper = mountPage()

      await choose(wrapper, 'Español')
      await choose(wrapper, 'English')

      expect(wrapper.get('h2').text()).toBe('Our solution')
      expect(document.documentElement.lang).toBe('en')
      expect(toggle(wrapper).text()).toBe('EN')
    })

    it('remembers the choice when the visitor comes back', async () => {
      await choose(mountPage(), 'አማርኛ')

      // A new visit: the modules load again and read the saved choice.
      document.body.innerHTML = ''
      vi.resetModules()
      const { default: FreshApp } = await import('@/App.vue')
      const wrapper = mount(FreshApp, { attachTo: document.body })

      expect(wrapper.get('h2').text()).toBe(siteContent.am.solution.heading)
      expect(toggle(wrapper).text()).toBe('AM')
      expect(document.documentElement.lang).toBe('am')
    })
  })

  describe('keyboard', () => {
    it('moves focus to the current language when the menu opens', async () => {
      const wrapper = mountSwitcher()

      await openMenu(wrapper)

      expect(document.activeElement).toBe(option(wrapper, 'English').element)
    })

    it('opens with the down arrow key on the button', async () => {
      const wrapper = mountSwitcher()

      await toggle(wrapper).trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(isOpen(wrapper)).toBe(true)
      expect(document.activeElement).toBe(option(wrapper, 'English').element)
    })

    it('moves between languages with the arrow keys, Home and End, wrapping around', async () => {
      const wrapper = mountSwitcher()
      await openMenu(wrapper)
      const focusedText = () => (document.activeElement as HTMLElement).textContent?.trim()

      await key(wrapper, 'ArrowDown')
      expect(focusedText()).toBe('Español')

      await key(wrapper, 'End')
      expect(focusedText()).toBe('አማርኛ')

      await key(wrapper, 'ArrowDown')
      expect(focusedText()).toBe('English')

      await key(wrapper, 'ArrowUp')
      expect(focusedText()).toBe('አማርኛ')

      await key(wrapper, 'Home')
      expect(focusedText()).toBe('English')
    })

    it('closes with Escape, without changing the language, and returns focus', async () => {
      const wrapper = mountSwitcher()
      await openMenu(wrapper)

      await key(wrapper, 'Escape')

      expect(isOpen(wrapper)).toBe(false)
      expect(document.activeElement).toBe(toggle(wrapper).element)
      expect(document.documentElement.lang).toBe('en')
    })

    it('closes when focus leaves the switcher, for example with Tab', async () => {
      const wrapper = mountSwitcher()
      const outside = document.createElement('button')
      document.body.append(outside)
      await openMenu(wrapper)

      await option(wrapper, 'English').trigger('focusout', { relatedTarget: outside })

      expect(isOpen(wrapper)).toBe(false)
    })

    it('uses real buttons that keyboards can reach', async () => {
      const wrapper = mountSwitcher()
      await openMenu(wrapper)

      for (const button of [toggle(wrapper), ...options(wrapper)]) {
        expect(button.element.tagName).toBe('BUTTON')
        expect(button.attributes('type')).toBe('button')
        expect(button.attributes('tabindex')).toBeUndefined()
      }
    })
  })

  describe('edge cases', () => {
    it('closes on a tap or click elsewhere on the page', async () => {
      const wrapper = mountSwitcher()
      await openMenu(wrapper)

      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await nextTick()

      expect(isOpen(wrapper)).toBe(false)
    })

    it('stays open on a tap inside the menu', async () => {
      const wrapper = mountSwitcher()
      await openMenu(wrapper)

      menu(wrapper).element.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await nextTick()

      expect(isOpen(wrapper)).toBe(true)
    })

    it('toggles closed when the button is pressed again', async () => {
      const wrapper = mountSwitcher()
      await openMenu(wrapper)

      await toggle(wrapper).trigger('click')

      expect(isOpen(wrapper)).toBe(false)
    })

    it('tells screen readers whether the menu is open, and which menu it opens', async () => {
      const wrapper = mountSwitcher()
      const button = toggle(wrapper)

      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-controls')).toBe('language-menu')

      await openMenu(wrapper)

      expect(button.attributes('aria-expanded')).toBe('true')
    })

    it('gives the button a full name for screen readers, in the page language', async () => {
      const wrapper = mountSwitcher()
      expect(toggle(wrapper).attributes('aria-label')).toBe('Language: English (EN)')

      await choose(wrapper, 'አማርኛ')

      expect(toggle(wrapper).attributes('aria-label')).toBe('ቋንቋ: አማርኛ (AM)')
    })

    it('is a labelled navigation landmark, translated with the page', async () => {
      const wrapper = mountSwitcher()
      expect(wrapper.get('nav').attributes('aria-label')).toBe('Language')

      await choose(wrapper, 'Español')

      expect(wrapper.get('nav').attributes('aria-label')).toBe('Idioma')
    })

    it('marks the current language in the menu, for screen readers too', async () => {
      const wrapper = mountSwitcher()
      await choose(wrapper, 'ትግርኛ')
      await openMenu(wrapper)

      const current = options(wrapper).filter((item) => item.attributes('aria-current') === 'true')
      expect(current.map((item) => item.text())).toEqual(['ትግርኛ'])
    })

    it('hides the decorative icons from screen readers', () => {
      for (const icon of mountSwitcher().findAll('svg')) {
        expect(icon.attributes('aria-hidden')).toBe('true')
      }
    })

    it('has buttons large enough to tap on phones', async () => {
      const wrapper = mountSwitcher()
      await openMenu(wrapper)

      expect(toggle(wrapper).classes()).toContain('min-h-11')
      expect(toggle(wrapper).classes()).toContain('min-w-11')
      for (const item of options(wrapper)) {
        expect(item.classes()).toContain('min-h-11')
      }
    })

    it('opens the menu below the button, aligned to the right edge so it stays on screen', () => {
      expect(menu(mountSwitcher()).classes()).toEqual(
        expect.arrayContaining(['absolute', 'right-0']),
      )
    })

    it('is shown at the top of the page, before the main content', () => {
      const html = mountPage().html()

      expect(html.indexOf('<header')).toBeGreaterThanOrEqual(0)
      expect(html.indexOf('<nav')).toBeLessThan(html.indexOf('<main'))
    })
  })
})
