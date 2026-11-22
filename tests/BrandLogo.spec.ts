import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BrandLogo from '@/components/ui/BrandLogo.vue'

/** The shapes of the founder's mark, "Leaf on a block", as given. */
const leaf = 'M32 32 C30 18 38 8 55 6 C56 21 47 30 32 32 Z'
const vein = 'M33 31 L49 14'
const lines = 'M8 46 H56 M32 34 V46 M20 46 V58 M44 46 V58'

function parts(variant?: 'color' | 'dark') {
  const svg = mount(BrandLogo, { props: { variant } }).get('svg')
  const paths = svg.findAll('path')
  return {
    svg,
    leaf: paths.find((path) => path.attributes('d') === leaf)!,
    vein: paths.find((path) => path.attributes('d') === vein)!,
    block: svg.get('rect'),
    lines: paths.find((path) => path.attributes('d') === lines)!,
  }
}

describe('BrandLogo', () => {
  describe('normal cases', () => {
    it('draws exactly the leaf, its vein, the block and its lines', () => {
      const { svg, leaf, vein, block, lines } = parts()

      expect(svg.attributes('viewBox')).toBe('0 0 64 64')
      expect(svg.findAll('path')).toHaveLength(3)
      expect(svg.findAll('rect')).toHaveLength(1)
      for (const part of [leaf, vein, lines]) {
        expect(part.exists()).toBe(true)
      }
      expect(block.attributes()).toMatchObject({
        x: '8',
        y: '34',
        width: '48',
        height: '24',
        rx: '4',
      })
      expect(vein.attributes()).toMatchObject({ 'stroke-width': '2', 'stroke-linecap': 'round' })
      expect(lines.attributes('stroke-width')).toBe('2')
    })

    it('uses the colour version by default', () => {
      const { svg, leaf, vein, block, lines } = parts()

      expect(svg.attributes('data-variant')).toBe('color')
      expect(leaf.attributes('fill')).toBe('#3DBE82')
      expect(vein.attributes('stroke')).toBe('#0B5D3B')
      expect(block.attributes('fill')).toBe('#0B5D3B')
      expect(lines.attributes('stroke')).toBe('#FFFFFF')
    })

    it('on dark backgrounds: a white block, dark lines and vein, the same leaf', () => {
      const { svg, leaf, vein, block, lines } = parts('dark')

      expect(svg.attributes('data-variant')).toBe('dark')
      expect(leaf.attributes('fill')).toBe('#3DBE82')
      expect(vein.attributes('stroke')).toBe('#0A2E20')
      expect(block.attributes('fill')).toBe('#FFFFFF')
      expect(lines.attributes('stroke')).toBe('#0A2E20')
    })
  })

  describe('accessibility', () => {
    it('is an image with an accessible name when given a label', () => {
      const svg = mount(BrandLogo, { props: { label: 'CelyMary logo' } }).get('svg')

      expect(svg.attributes('role')).toBe('img')
      expect(svg.attributes('aria-label')).toBe('CelyMary logo')
      expect(svg.attributes('aria-hidden')).toBeUndefined()
    })

    it('is decorative and hidden from screen readers without a label', () => {
      const svg = mount(BrandLogo).get('svg')

      expect(svg.attributes('aria-hidden')).toBe('true')
      expect(svg.attributes('role')).toBeUndefined()
      expect(svg.attributes('aria-label')).toBeUndefined()
    })

    it('is never a keyboard stop', () => {
      expect(mount(BrandLogo).get('svg').attributes('focusable')).toBe('false')
    })
  })
})
