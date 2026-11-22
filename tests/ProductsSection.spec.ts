import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ProductsSection from '@/components/sections/ProductsSection.vue'
import { en } from '@/content/locales/en'
import type { ProductsContent } from '@/content/types'

const { products } = en

/** Mounts ProductsSection with replacement English texts for this section. */
async function mountWithContent(content: ProductsContent) {
  vi.resetModules()
  vi.doMock('@/content/locales/en', () => ({ en: { ...en, products: content } }))
  const { default: Component } = await import('@/components/sections/ProductsSection.vue')
  return mount(Component)
}

afterEach(() => {
  vi.doUnmock('@/content/locales/en')
  vi.resetModules()
})

describe('ProductsSection', () => {
  describe('normal cases', () => {
    it('shows the section heading', () => {
      const wrapper = mount(ProductsSection)

      expect(wrapper.get('h2').text()).toBe('Our planned products')
    })

    it('shows the five planned products in order', () => {
      const wrapper = mount(ProductsSection)

      const names = wrapper.findAll('li h3').map((name) => name.text())

      expect(names).toEqual([
        'Standard building blocks',
        'Solar panel ballast blocks',
        'Paving blocks',
        'Retaining wall and landscaping blocks',
        'Kerbs and edging',
      ])
    })

    it('shows the description of each product next to its name', () => {
      const wrapper = mount(ProductsSection)
      const cards = wrapper.findAll('li')

      products.items.forEach((product, index) => {
        expect(cards[index]!.get('h3').text()).toBe(product.name)
        expect(cards[index]!.get('p').text()).toBe(product.description)
      })
    })

    it('labels every card "In development"', () => {
      const wrapper = mount(ProductsSection)

      for (const card of wrapper.findAll('li')) {
        expect(card.text()).toContain('In development')
      }
    })

    it('shows the matching icon on each card', () => {
      const wrapper = mount(ProductsSection)
      const cards = wrapper.findAll('li')

      products.items.forEach((product, index) => {
        expect(cards[index]!.get('svg').attributes('data-icon')).toBe(product.icon)
      })
    })
  })

  describe('edge cases', () => {
    it('can be reached at #products and is labelled by its heading', () => {
      const wrapper = mount(ProductsSection)
      const section = wrapper.get('section')
      const headingId = section.attributes('aria-labelledby')

      expect(section.attributes('id')).toBe('products')
      expect(wrapper.get(`#${headingId}`).text()).toBe('Our planned products')
    })

    it('hides the decorative icons from screen readers', () => {
      const wrapper = mount(ProductsSection)

      for (const icon of wrapper.findAll('svg')) {
        expect(icon.attributes('aria-hidden')).toBe('true')
      }
    })

    it('has exactly one icon and one badge per card', () => {
      const wrapper = mount(ProductsSection)

      for (const card of wrapper.findAll('li')) {
        expect(card.findAll('svg')).toHaveLength(1)
        expect(card.text().match(/In development/g)).toHaveLength(1)
      }
    })

    it('uses one column on phones, two on tablets and three on wide screens', () => {
      const wrapper = mount(ProductsSection)
      const list = wrapper.get('ul')

      expect(list.classes()).toContain('sm:grid-cols-2')
      expect(list.classes()).toContain('lg:grid-cols-3')
      expect(list.classes().filter((name) => name.startsWith('grid-cols-'))).toEqual([])
    })

    it('renders the products from the content file, not hard-coded text', async () => {
      const wrapper = await mountWithContent({
        heading: 'Test heading',
        statusLabel: 'Test status',
        items: [
          { id: 'paving-blocks', name: 'Test block', description: 'Test use.', icon: 'paving' },
        ],
      })

      expect(wrapper.get('h2').text()).toBe('Test heading')
      expect(wrapper.findAll('li')).toHaveLength(1)
      expect(wrapper.get('li h3').text()).toBe('Test block')
      expect(wrapper.get('li').text()).toContain('Test status')
    })

    it('renders an empty list without errors when there are no products', async () => {
      const wrapper = await mountWithContent({ ...products, items: [] })

      expect(wrapper.findAll('li')).toHaveLength(0)
      expect(wrapper.get('h2').text()).toBe('Our planned products')
    })
  })

  describe('heading level', () => {
    it('uses a section heading by default', () => {
      const wrapper = mount(ProductsSection)

      expect(wrapper.find('h1').exists()).toBe(false)
      expect(wrapper.get('h2').text()).toBe('Our planned products')
    })

    it('can be the main heading, when the section opens its page', () => {
      const wrapper = mount(ProductsSection, { props: { headingLevel: 'h1' } })
      const heading = wrapper.get('h1')

      expect(heading.text()).toBe('Our planned products')
      expect(wrapper.find('h2').exists()).toBe(false)
      expect(wrapper.get('section').attributes('aria-labelledby')).toBe(heading.attributes('id'))
    })
  })
})
