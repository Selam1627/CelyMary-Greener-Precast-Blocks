import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import HeroSection from '@/components/sections/HeroSection.vue'
import { en } from '@/content/locales/en'
import type { HeroContent } from '@/content/types'

const { hero } = en

/** Mounts HeroSection with replacement English texts for this section. */
async function mountWithContent(content: HeroContent) {
  vi.resetModules()
  vi.doMock('@/content/locales/en', () => ({ en: { ...en, hero: content } }))
  const { default: Component } = await import('@/components/sections/HeroSection.vue')
  return mount(Component)
}

afterEach(() => {
  vi.doUnmock('@/content/locales/en')
  vi.resetModules()
})

describe('HeroSection', () => {
  describe('normal cases', () => {
    it('shows the company name as the main heading', () => {
      const wrapper = mount(HeroSection)

      expect(wrapper.get('h1').text()).toBe('CelyMary Greener Precast Blocks')
    })

    it('shows the tagline from the content file', () => {
      const wrapper = mount(HeroSection)

      expect(wrapper.text()).toContain(hero.tagline)
    })

    it('has "Work with us" and "Contact" buttons that open their pages', () => {
      const wrapper = mount(HeroSection)

      const buttons = wrapper.findAll('a').map((link) => ({
        label: link.text(),
        href: link.attributes('href'),
      }))

      expect(buttons).toEqual([
        { label: 'Work with us', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ])
    })
  })

  describe('edge cases', () => {
    it('has exactly one main heading', () => {
      const wrapper = mount(HeroSection)

      expect(wrapper.findAll('h1')).toHaveLength(1)
    })

    it('styles only the first button as the primary one', () => {
      const wrapper = mount(HeroSection)
      const [workWithUs, contact] = wrapper.findAll('a')

      expect(workWithUs!.classes()).toContain('bg-emerald-700')
      expect(contact!.classes()).not.toContain('bg-emerald-700')
      expect(contact!.classes()).toContain('border-emerald-700')
    })

    it('keeps visitors on the page: buttons do not open a new tab', () => {
      const wrapper = mount(HeroSection)

      for (const link of wrapper.findAll('a')) {
        expect(link.attributes('target')).toBeUndefined()
      }
    })

    it('stacks the buttons on phones and puts them in a row from the sm breakpoint', () => {
      const wrapper = mount(HeroSection)
      const buttonRow = wrapper.get('a').element.parentElement!

      expect(buttonRow.classList).toContain('flex-col')
      expect(buttonRow.classList).toContain('sm:flex-row')
    })

    it('renders the text from the content file, not hard-coded text', async () => {
      const wrapper = await mountWithContent({
        companyName: 'Test Company',
        companyShortName: 'Test',
        tagline: 'Test tagline.',
        actions: [{ label: 'Test action', href: '/products' }],
      })

      expect(wrapper.get('h1').text()).toBe('Test Company')
      expect(wrapper.text()).toContain('Test tagline.')
      expect(wrapper.get('a').attributes('href')).toBe('/products')
    })

    it("shows no Ge'ez line in English", () => {
      const wrapper = mount(HeroSection)

      expect(wrapper.get('h1').text()).toBe('CelyMary Greener Precast Blocks')
      expect(wrapper.get('h1').find('span').exists()).toBe(false)
    })

    it("shows the Ge'ez name as a second line of the main heading, when there is one", async () => {
      const wrapper = await mountWithContent({ ...hero, companyNameGeez: 'ሰሊሜሪ ሓምለዋይ ብሎኬት' })
      const h1 = wrapper.get('h1')

      expect(h1.text()).toContain('CelyMary Greener Precast Blocks')
      expect(h1.get('span').text()).toBe('ሰሊሜሪ ሓምለዋይ ብሎኬት')
      expect(h1.get('span').classes()).toContain('block')
      expect(wrapper.findAll('h1')).toHaveLength(1)
    })

    it('renders no buttons when the content file lists no actions', async () => {
      const wrapper = await mountWithContent({ ...hero, actions: [] })

      expect(wrapper.findAll('a')).toHaveLength(0)
      expect(wrapper.get('h1').text()).toBe(hero.companyName)
    })

    it('styles every action after the first as secondary', async () => {
      const wrapper = await mountWithContent({
        ...hero,
        actions: [...hero.actions, { label: 'Third', href: '/products' }],
      })
      const third = wrapper.findAll('a')[2]!

      expect(third.classes()).not.toContain('bg-emerald-700')
      expect(third.classes()).toContain('border-emerald-700')
    })
  })
})
