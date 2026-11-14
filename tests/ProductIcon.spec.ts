import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProductIcon from '@/components/ui/ProductIcon.vue'
import type { ProductIconName } from '@/content/types'

const iconNames: ProductIconName[] = [
  'building-block',
  'solar-ballast',
  'paving',
  'retaining-wall',
  'kerb',
]

describe('ProductIcon', () => {
  describe('normal cases', () => {
    it.each(iconNames)('draws the "%s" icon', (name) => {
      const wrapper = mount(ProductIcon, { props: { name } })
      const svg = wrapper.get('svg')

      expect(svg.attributes('data-icon')).toBe(name)
      expect(svg.element.children.length).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('draws a different shape for every icon', () => {
      const drawings = iconNames.map(
        (name) => mount(ProductIcon, { props: { name } }).get('svg').element.innerHTML,
      )

      expect(new Set(drawings).size).toBe(iconNames.length)
    })

    it('is decorative: hidden from screen readers and not focusable', () => {
      const svg = mount(ProductIcon, { props: { name: 'paving' } }).get('svg')

      expect(svg.attributes('aria-hidden')).toBe('true')
      expect(svg.attributes('focusable')).toBe('false')
    })

    it('uses the text color, so the card can set the icon color', () => {
      const svg = mount(ProductIcon, { props: { name: 'kerb' } }).get('svg')

      expect(svg.attributes('stroke')).toBe('currentColor')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('contains no text, only shapes', () => {
      for (const name of iconNames) {
        expect(mount(ProductIcon, { props: { name } }).text()).toBe('')
      }
    })
  })
})
