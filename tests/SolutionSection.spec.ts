import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import SolutionSection from '@/components/sections/SolutionSection.vue'
import { en } from '@/content/locales/en'
import type { SolutionContent } from '@/content/types'

const { solution } = en

/** Mounts SolutionSection with replacement English texts for this section. */
async function mountWithContent(content: SolutionContent) {
  vi.resetModules()
  vi.doMock('@/content/locales/en', () => ({ en: { ...en, solution: content } }))
  const { default: Component } = await import('@/components/sections/SolutionSection.vue')
  return mount(Component)
}

afterEach(() => {
  vi.doUnmock('@/content/locales/en')
  vi.resetModules()
})

describe('SolutionSection', () => {
  describe('normal cases', () => {
    it('shows the "Our solution" heading', () => {
      const wrapper = mount(SolutionSection)

      expect(wrapper.get('h2').text()).toBe('Our solution')
    })

    it('shows exactly the three benefits', () => {
      const wrapper = mount(SolutionSection)

      const titles = wrapper.findAll('li h3').map((title) => title.text())

      expect(titles).toEqual(['Lower carbon', 'Recycled industrial materials', 'Local production'])
    })

    it('shows each benefit description from the content file', () => {
      const wrapper = mount(SolutionSection)

      for (const benefit of solution.benefits) {
        expect(wrapper.text()).toContain(benefit.description)
      }
    })
  })

  describe('edge cases', () => {
    it('is labelled by its own heading for screen readers', () => {
      const wrapper = mount(SolutionSection)
      const section = wrapper.get('section')
      const headingId = section.attributes('aria-labelledby')

      expect(section.attributes('id')).toBe('our-solution')
      expect(headingId).toBeTruthy()
      expect(wrapper.get(`#${headingId}`).text()).toBe('Our solution')
    })

    it('shows each benefit as a list item with a title and a description', () => {
      const wrapper = mount(SolutionSection)
      const items = wrapper.findAll('ul > li')

      expect(items).toHaveLength(3)
      for (const item of items) {
        expect(item.find('h3').text()).not.toBe('')
        expect(item.find('p').text()).not.toBe('')
      }
    })

    it('uses one column on phones and three columns from the md breakpoint', () => {
      const wrapper = mount(SolutionSection)
      const list = wrapper.get('ul')

      expect(list.classes()).toContain('md:grid-cols-3')
      expect(list.classes().filter((name) => name.startsWith('grid-cols-'))).toEqual([])
    })

    it('renders the benefits from the content file, not hard-coded text', async () => {
      const wrapper = await mountWithContent({
        heading: 'Test heading',
        benefits: [{ title: 'Test benefit', description: 'Test description.' }],
      })

      expect(wrapper.get('h2').text()).toBe('Test heading')
      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(wrapper.get('li h3').text()).toBe('Test benefit')
    })

    it('renders an empty list without errors when there are no benefits', async () => {
      const wrapper = await mountWithContent({ heading: 'Our solution', benefits: [] })

      expect(wrapper.findAll('li')).toHaveLength(0)
      expect(wrapper.get('h2').text()).toBe('Our solution')
    })
  })
})
