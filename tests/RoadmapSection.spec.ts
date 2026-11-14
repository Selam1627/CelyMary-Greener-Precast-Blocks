import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import RoadmapSection from '@/components/sections/RoadmapSection.vue'
import { en } from '@/content/locales/en'
import type { RoadmapContent } from '@/content/types'

const { roadmap } = en

/** Mounts RoadmapSection with replacement English texts for this section. */
async function mountWithContent(content: RoadmapContent) {
  vi.resetModules()
  vi.doMock('@/content/locales/en', () => ({ en: { ...en, roadmap: content } }))
  const { default: Component } = await import('@/components/sections/RoadmapSection.vue')
  return mount(Component)
}

afterEach(() => {
  vi.doUnmock('@/content/locales/en')
  vi.resetModules()
})

describe('RoadmapSection', () => {
  describe('normal cases', () => {
    it('shows the heading and says clearly that the company is early-stage', () => {
      const wrapper = mount(RoadmapSection)

      expect(wrapper.get('h2').text()).toBe('Stage and roadmap')
      expect(wrapper.text()).toContain(
        'We are an early-stage company, currently at the concept stage.',
      )
    })

    it('shows the three steps in order, as an ordered list', () => {
      const wrapper = mount(RoadmapSection)

      const titles = wrapper.findAll('ol > li h3').map((title) => title.text())

      expect(titles).toEqual([
        'Concept and planning',
        'Research and lab development',
        'Pilot production',
      ])
    })

    it('marks only "Concept and planning" as the current stage', () => {
      const wrapper = mount(RoadmapSection)
      const [concept, research, pilot] = wrapper.findAll('ol > li')

      expect(concept!.text()).toContain('Current stage')
      expect(research!.text()).not.toContain('Current stage')
      expect(pilot!.text()).not.toContain('Current stage')
    })

    it('shows the funding note only on "Research and lab development"', () => {
      const wrapper = mount(RoadmapSection)
      const [concept, research, pilot] = wrapper.findAll('ol > li')

      expect(research!.get('p').text()).toBe('Seeking funding to start this phase.')
      expect(concept!.find('p').exists()).toBe(false)
      expect(pilot!.find('p').exists()).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('can be reached at #roadmap and is labelled by its heading', () => {
      const wrapper = mount(RoadmapSection)
      const section = wrapper.get('section')
      const headingId = section.attributes('aria-labelledby')

      expect(section.attributes('id')).toBe('roadmap')
      expect(wrapper.get(`#${headingId}`).text()).toBe('Stage and roadmap')
    })

    it('shows no dates or figures: step numbers come from the list, not the text', () => {
      const wrapper = mount(RoadmapSection)

      expect(wrapper.text()).not.toMatch(/\d/)
      expect(wrapper.get('ol').classes()).toContain('list-decimal')
    })

    it('lets the title and label wrap on narrow phones', () => {
      const wrapper = mount(RoadmapSection)
      const titleRow = wrapper.get('ol > li h3').element.parentElement!

      expect(titleRow.classList).toContain('flex-wrap')
    })

    it('renders the steps from the content file, not hard-coded text', async () => {
      const wrapper = await mountWithContent({
        heading: 'Test heading',
        statement: 'Test statement.',
        steps: [{ id: 'test', title: 'Test step', statusLabel: 'Test label', note: 'Test note.' }],
      })

      expect(wrapper.get('h2').text()).toBe('Test heading')
      expect(wrapper.text()).toContain('Test statement.')
      expect(wrapper.get('li h3').text()).toBe('Test step')
      expect(wrapper.get('li').text()).toContain('Test label')
      expect(wrapper.get('li p').text()).toBe('Test note.')
    })

    it('renders a step with no label and no note', async () => {
      const wrapper = await mountWithContent({
        ...roadmap,
        steps: [{ id: 'test', title: 'Test step' }],
      })

      expect(wrapper.find('li span').exists()).toBe(false)
      expect(wrapper.find('li p').exists()).toBe(false)
    })

    it('renders an empty list without errors when there are no steps', async () => {
      const wrapper = await mountWithContent({ ...roadmap, steps: [] })

      expect(wrapper.findAll('li')).toHaveLength(0)
      expect(wrapper.get('h2').text()).toBe('Stage and roadmap')
    })
  })
})
