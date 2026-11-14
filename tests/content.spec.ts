import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '@/App.vue'
import { audiences } from '@/content/audiences'
import { contact } from '@/content/contact'
import { hero } from '@/content/hero'
import { products } from '@/content/products'
import { roadmap } from '@/content/roadmap'
import { solution } from '@/content/solution'
import { team } from '@/content/team'

const allTexts = [
  hero.companyName,
  hero.tagline,
  ...hero.actions.map((action) => action.label),
  solution.heading,
  ...solution.benefits.flatMap((benefit) => [benefit.title, benefit.description]),
  products.heading,
  products.statusLabel,
  ...products.items.flatMap((product) => [product.id, product.name, product.description]),
  audiences.heading,
  ...audiences.items.flatMap((audience) => [audience.id, audience.title, audience.description]),
  roadmap.heading,
  roadmap.statement,
  ...roadmap.steps.flatMap((step) => [
    step.id,
    step.title,
    ...(step.statusLabel === undefined ? [] : [step.statusLabel]),
    ...(step.note === undefined ? [] : [step.note]),
  ]),
  team.heading,
  ...team.members.flatMap((member) => [member.name, member.role, member.bio]),
  contact.heading,
  ...Object.values(contact.labels),
  ...contact.visitorTypes,
  contact.visitorTypePrompt,
  contact.productPrompt,
  contact.submitLabel,
  contact.sendingLabel,
  contact.successMessage,
  contact.failureMessage,
  contact.spamTrapLabel,
  contact.directContactPrefix,
  ...Object.values(contact.errors),
  ...Object.values(contact.email),
]

describe('site content', () => {
  describe('normal cases', () => {
    it('hero has exactly the two buttons from the acceptance criteria', () => {
      expect(hero.actions.map((action) => action.label)).toEqual(['Work with us', 'Contact'])
    })

    it('solution has exactly the three benefits from the acceptance criteria', () => {
      expect(solution.benefits.map((benefit) => benefit.title)).toEqual([
        'Lower carbon',
        'Recycled industrial materials',
        'Local production',
      ])
    })

    it('products are exactly the five from the acceptance criteria', () => {
      expect(products.items.map((product) => product.name)).toEqual([
        'Standard building blocks',
        'Solar panel ballast blocks',
        'Paving blocks',
        'Retaining wall and landscaping blocks',
        'Kerbs and edging',
      ])
    })

    it('labels the products "In development"', () => {
      expect(products.statusLabel).toBe('In development')
    })
  })

  describe('edge cases', () => {
    it('has no empty or whitespace-only texts', () => {
      for (const text of allTexts) {
        expect(text.trim()).not.toBe('')
      }
    })

    it('has no leading or trailing spaces in texts', () => {
      for (const text of allTexts) {
        expect(text).toBe(text.trim())
      }
    })

    it('uses in-page anchors with valid section ids for every button', () => {
      for (const action of hero.actions) {
        expect(action.href).toMatch(/^#[a-z][a-z0-9-]*$/)
      }
    })

    it('has unique button targets and benefit titles (they are used as list keys)', () => {
      const hrefs = hero.actions.map((action) => action.href)
      const titles = solution.benefits.map((benefit) => benefit.title)

      expect(new Set(hrefs).size).toBe(hrefs.length)
      expect(new Set(titles).size).toBe(titles.length)
    })

    it('has unique product ids, names and icons', () => {
      for (const field of ['id', 'name', 'icon'] as const) {
        const values = products.items.map((product) => product[field])
        expect(new Set(values).size).toBe(values.length)
      }
    })

    it('uses lowercase, hyphenated product ids', () => {
      for (const product of products.items) {
        expect(product.id).toMatch(/^[a-z][a-z0-9-]*$/)
      }
    })

    it('keeps product descriptions to one short sentence', () => {
      for (const product of products.items) {
        expect(product.description).toMatch(/^[A-Z][^.]*\.$/)
        expect(product.description.length).toBeLessThanOrEqual(120)
      }
    })

    it('has unique audience ids, roadmap step ids and team member names', () => {
      for (const values of [
        audiences.items.map((audience) => audience.id),
        roadmap.steps.map((step) => step.id),
        team.members.map((member) => member.name),
      ]) {
        expect(new Set(values).size).toBe(values.length)
      }
    })

    it('has unique contact form visitor types (they are used as list keys)', () => {
      expect(new Set(contact.visitorTypes).size).toBe(contact.visitorTypes.length)
    })

    it('marks exactly one roadmap step as the current stage', () => {
      const current = roadmap.steps.filter((step) => step.statusLabel === 'Current stage')

      expect(current.map((step) => step.title)).toEqual(['Concept and planning'])
    })

    it('keeps the tagline to one short line', () => {
      expect(hero.tagline.length).toBeLessThanOrEqual(80)
      expect(hero.tagline).not.toContain('\n')
    })
  })

  describe('confidentiality and honesty rules (CLAUDE.md)', () => {
    // Generic words only: listing actual materials here would itself reveal them.
    const forbiddenWords = [
      'recipe',
      'formula',
      'formulation',
      'ingredient',
      'composition',
      'mix design',
      'production process',
      'manufacturing process',
    ]

    it('never mentions recipes, formulations or the production process on the page', () => {
      const pageText = mount(App).text().toLowerCase()

      for (const word of forbiddenWords) {
        expect(pageText).not.toContain(word)
      }
    })

    it('gives no technical specifications for products', () => {
      // Generic spec words only; any number is already caught by the next test.
      const specWords = [
        'strength',
        'density',
        'dimension',
        'weight',
        'thickness',
        'compressive',
        'load rating',
        'specification',
      ]
      const productText = mount(App).get('#products').text().toLowerCase()

      for (const word of specWords) {
        expect(productText).not.toContain(word)
      }
    })

    it('contains no figures, so no unverified statistics', () => {
      const pageText = mount(App).text()

      expect(pageText).not.toMatch(/\d/)
    })
  })
})
