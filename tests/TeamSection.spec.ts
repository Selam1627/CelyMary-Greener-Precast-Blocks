import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import TeamSection from '@/components/sections/TeamSection.vue'
import { en } from '@/content/locales/en'
import type { TeamContent } from '@/content/types'

const { team } = en

/** Mounts TeamSection with replacement English texts for this section. */
async function mountWithContent(content: TeamContent) {
  vi.resetModules()
  vi.doMock('@/content/locales/en', () => ({ en: { ...en, team: content } }))
  const { default: Component } = await import('@/components/sections/TeamSection.vue')
  return mount(Component)
}

afterEach(() => {
  vi.doUnmock('@/content/locales/en')
  vi.resetModules()
})

describe('TeamSection', () => {
  describe('normal cases', () => {
    it('shows the heading', () => {
      expect(mount(TeamSection).get('h2').text()).toBe('Team')
    })

    it('shows the founder with the exact name, role and bio', () => {
      const card = mount(TeamSection).findAll('li')[0]!
      const [role, bio] = card.findAll('p')

      expect(card.get('h3').text()).toBe('Selam Berhe Beyene')
      expect(role!.text()).toBe('Founder')
      expect(bio!.text()).toBe(
        'PhD researcher in cement-sector decarbonisation at the University of Cantabria, developing low-carbon building materials.',
      )
    })

    it('shows the co-founder with the exact name, role and bio', () => {
      const card = mount(TeamSection).findAll('li')[1]!
      const [role, bio] = card.findAll('p')

      expect(card.get('h3').text()).toBe('Meron Gebreselassie Tadesse')
      expect(role!.text()).toBe('Co-founder')
      expect(bio!.text()).toBe('Brings expertise in project management.')
    })
  })

  describe('edge cases', () => {
    it('has exactly two team cards', () => {
      expect(mount(TeamSection).findAll('li')).toHaveLength(2)
    })

    it('shows no photos or logos', () => {
      const wrapper = mount(TeamSection)

      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('svg').exists()).toBe(false)
    })

    it('can be reached at #team and is labelled by its heading', () => {
      const wrapper = mount(TeamSection)
      const section = wrapper.get('section')
      const headingId = section.attributes('aria-labelledby')

      expect(section.attributes('id')).toBe('team')
      expect(wrapper.get(`#${headingId}`).text()).toBe('Team')
    })

    it('uses one column on phones and two columns from the sm breakpoint', () => {
      const list = mount(TeamSection).get('ul')

      expect(list.classes()).toContain('sm:grid-cols-2')
      expect(list.classes().filter((name) => name.startsWith('grid-cols-'))).toEqual([])
    })

    it('renders the members from the content file, not hard-coded text', async () => {
      const wrapper = await mountWithContent({
        heading: 'Test heading',
        members: [{ name: 'Test name', role: 'Test role', bio: 'Test bio.' }],
      })

      expect(wrapper.get('h2').text()).toBe('Test heading')
      expect(wrapper.get('li h3').text()).toBe('Test name')
      expect(wrapper.get('li').text()).toContain('Test role')
      expect(wrapper.get('li').text()).toContain('Test bio.')
    })

    it('renders an empty list without errors when there are no members', async () => {
      const wrapper = await mountWithContent({ ...team, members: [] })

      expect(wrapper.findAll('li')).toHaveLength(0)
      expect(wrapper.get('h2').text()).toBe('Team')
    })
  })
})
