import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import App from '@/App.vue'
import { useLanguage } from '@/composables/useLanguage'

afterEach(() => {
  useLanguage().setLanguage('en')
  localStorage.clear()
  document.body.innerHTML = ''
})

describe('App', () => {
  it('shows the home page when no page is given', () => {
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('CelyMary Greener Precast Blocks')
    expect(wrapper.get('h2').text()).toBe('Our solution')
  })

  it('puts the header with the menu before the main content', () => {
    const html = mount(App).html()

    expect(html.indexOf('<header')).toBeGreaterThanOrEqual(0)
    expect(html.indexOf('<header')).toBeLessThan(html.indexOf('<main'))
  })

  it('has a single main landmark that the skip link can move focus to', () => {
    const wrapper = mount(App)
    const main = wrapper.get('main')

    expect(wrapper.findAll('main')).toHaveLength(1)
    expect(main.attributes('id')).toBe('main-content')
    expect(main.attributes('tabindex')).toBe('-1')
  })

  describe('skip link', () => {
    it('is the first link on the page and jumps to the main content', () => {
      const first = mount(App).get('a')

      expect(first.text()).toBe('Skip to main content')
      expect(first.attributes('href')).toBe('#main-content')
    })

    it('is hidden until it gets keyboard focus', () => {
      const classes = mount(App).get('a').classes()

      expect(classes).toContain('sr-only')
      expect(classes).toContain('focus:not-sr-only')
    })

    it('is translated with the page', async () => {
      const wrapper = mount(App)

      useLanguage().setLanguage('am')
      await wrapper.vm.$nextTick()

      expect(wrapper.get('a').text()).toBe('ወደ ዋናው ይዘት ይዝለሉ')
    })
  })
})
