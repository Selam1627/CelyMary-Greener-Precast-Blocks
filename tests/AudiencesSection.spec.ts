import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import AudiencesSection from '@/components/sections/AudiencesSection.vue'
import { en } from '@/content/locales/en'
import type { AudiencesContent } from '@/content/types'

const { audiences } = en

/** Mounts AudiencesSection with replacement English texts for this section. */
async function mountWithContent(content: AudiencesContent) {
  vi.resetModules()
  vi.doMock('@/content/locales/en', () => ({ en: { ...en, audiences: content } }))
  const { default: Component } = await import('@/components/sections/AudiencesSection.vue')
  return mount(Component)
}

afterEach(() => {
  vi.doUnmock('@/content/locales/en')
  vi.resetModules()
})

describe('AudiencesSection', () => {
  describe('normal cases', () => {
    it('shows the "Work with us" heading', () => {
      const wrapper = mount(AudiencesSection)

      expect(wrapper.get('h2').text()).toBe('Work with us')
    })

    it('shows the three audiences in order', () => {
      const wrapper = mount(AudiencesSection)

      const titles = wrapper.findAll('li h3').map((title) => title.text())

      expect(titles).toEqual(['For customers', 'For investors', 'For partners'])
    })

    it('shows the description of each audience next to its title', () => {
      const wrapper = mount(AudiencesSection)
      const blocks = wrapper.findAll('li')

      audiences.items.forEach((audience, index) => {
        expect(blocks[index]!.get('h3').text()).toBe(audience.title)
        expect(blocks[index]!.get('p').text()).toBe(audience.description)
      })
    })

    it('names the four customer groups in the customers block', () => {
      const text = mount(AudiencesSection).get('li').text().toLowerCase()

      for (const group of ['architects', 'engineers', 'builders', 'developers']) {
        expect(text).toContain(group)
      }
    })

    it('tells investors that the company is seeking funding', () => {
      const investors = mount(AudiencesSection).findAll('li')[1]!

      expect(investors.text()).toContain('seeking funding to start research and lab development')
    })
  })

  describe('edge cases', () => {
    it('can be reached at #work-with-us and is labelled by its heading', () => {
      const wrapper = mount(AudiencesSection)
      const section = wrapper.get('section')
      const headingId = section.attributes('aria-labelledby')

      expect(section.attributes('id')).toBe('work-with-us')
      expect(wrapper.get(`#${headingId}`).text()).toBe('Work with us')
    })

    it('uses one column on phones and three columns from the md breakpoint', () => {
      const list = mount(AudiencesSection).get('ul')

      expect(list.classes()).toContain('md:grid-cols-3')
      expect(list.classes().filter((name) => name.startsWith('grid-cols-'))).toEqual([])
    })

    it('renders the audiences from the content file, not hard-coded text', async () => {
      const wrapper = await mountWithContent({
        heading: 'Test heading',
        items: [{ id: 'test', title: 'Test audience', description: 'Test description.' }],
      })

      expect(wrapper.get('h2').text()).toBe('Test heading')
      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(wrapper.get('li h3').text()).toBe('Test audience')
    })

    it('renders an empty list without errors when there are no audiences', async () => {
      const wrapper = await mountWithContent({ ...audiences, items: [] })

      expect(wrapper.findAll('li')).toHaveLength(0)
      expect(wrapper.get('h2').text()).toBe('Work with us')
    })
  })
})
