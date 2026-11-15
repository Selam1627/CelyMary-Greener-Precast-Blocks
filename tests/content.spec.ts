import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import App from '@/App.vue'
import { useLanguage } from '@/composables/useLanguage'
import { languages, type LanguageCode } from '@/content/languages'
import { siteContent } from '@/content/siteContent'
import { allPages as pages, menuPages, type PageId } from '@/pages'

const codes = languages.map((language) => language.code)

const allPages: PageId[] = pages.map((page) => page.id)

/** Mounts one page of the site in one language. */
function mountPage(code: LanguageCode, page: PageId = 'home') {
  useLanguage().setLanguage(code)
  return mount(App, { props: { page } })
}

/** The text of every page of the site, in one language. */
function siteText(code: LanguageCode) {
  return allPages.map((page) => mountPage(code, page).text()).join(' ')
}

afterEach(() => {
  useLanguage().setLanguage('en')
  localStorage.clear()
})

describe('site content', () => {
  describe('normal cases (English)', () => {
    const { hero, solution, products } = siteContent.en

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

  describe.each(codes)('edge cases (%s)', (code) => {
    const { hero, solution, products, audiences, roadmap, team, contact } = siteContent[code]

    it("links every button to one of the site's pages", () => {
      const paths: string[] = menuPages.map((page) => page.path)

      for (const action of hero.actions) {
        expect(paths).toContain(action.href)
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
        // One full stop (Latin "." or Ethiopic "።"), at the end.
        expect(product.description).toMatch(/^[^.።]+[.።]$/u)
        expect(product.description.length).toBeLessThanOrEqual(140)
      }
    })

    it('starts Latin-script product descriptions with a capital letter', () => {
      for (const product of products.items) {
        expect(product.description).toMatch(/^(\p{Lu}|\p{Script=Ethiopic})/u)
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

    it('has unique contact form visitor types and labels (they are used as list keys)', () => {
      for (const values of [
        contact.visitorTypes.map((type) => type.id),
        contact.visitorTypes.map((type) => type.label),
      ]) {
        expect(new Set(values).size).toBe(values.length)
      }
    })

    it('marks exactly one roadmap step, the first, as the current stage', () => {
      const current = roadmap.steps.filter((step) => step.statusLabel !== undefined)

      expect(current.map((step) => step.id)).toEqual(['concept-and-planning'])
    })

    it('keeps the tagline to one short line', () => {
      expect(hero.tagline.length).toBeLessThanOrEqual(80)
      expect(hero.tagline).not.toContain('\n')
    })
  })

  describe('confidentiality and honesty rules (CLAUDE.md)', () => {
    // Generic words only: listing actual materials here would itself reveal them.
    const forbiddenWords: Record<LanguageCode, string[]> = {
      en: [
        'recipe',
        'formula',
        'formulation',
        'ingredient',
        'composition',
        'mix design',
        'production process',
        'manufacturing process',
      ],
      es: [
        'receta',
        'fórmula',
        'formulación',
        'ingrediente',
        'composición',
        'dosificación',
        'proceso de producción',
        'proceso de fabricación',
      ],
      // Formula, ingredient, production process and manufacturing process.
      ti: ['ቀመር', 'ጥረ ነገር', 'መስርሕ ምህርቲ', 'መስርሕ ምፍራይ'],
      am: ['ቀመር', 'ንጥረ ነገር', 'የአመራረት ሂደት', 'የምርት ሂደት'],
    }

    // Generic spec words only; any number is already caught by the next test.
    const specWords: Partial<Record<LanguageCode, string[]>> = {
      en: [
        'strength',
        'density',
        'dimension',
        'weight',
        'thickness',
        'compressive',
        'load rating',
        'specification',
      ],
      es: [
        'resistencia',
        'densidad',
        'dimensi',
        'peso',
        'espesor',
        'compresi',
        'carga admisible',
        'especificaci',
      ],
    }

    it.each(codes)(
      'never mentions recipes, formulations or the production process (%s)',
      (code) => {
        const pageText = siteText(code).toLowerCase()

        for (const word of forbiddenWords[code]) {
          expect(pageText).not.toContain(word)
        }
      },
    )

    it.each(['en', 'es'] as const)(
      'gives no technical specifications for products (%s)',
      (code) => {
        const productText = mountPage(code, 'products').get('#products').text().toLowerCase()

        for (const word of specWords[code]!) {
          expect(productText).not.toContain(word)
        }
      },
    )

    it.each(codes)(
      'contains no figures about the company or its products, so no unverified statistics (%s)',
      (code) => {
        // The company and product content: the main content of the menu pages.
        // Only the footer (the copyright year) and the privacy notice (the
        // retention period, the GDPR article) may contain numbers.
        const contentText = menuPages
          .map((page) => mountPage(code, page.id).get('main').text())
          .join(' ')

        // Any number: Western digits, Ethiopic numerals and others.
        expect(contentText).not.toMatch(/\p{N}/u)
      },
    )

    it.each(codes)('has numbers only in the footer year and the privacy notice (%s)', (code) => {
      const footer = mountPage(code, 'home').get('footer').text()

      expect(footer.match(/\p{N}+/gu)).toEqual(['2026'])
    })

    it.each(codes)('labels every product as in development (%s)', (code) => {
      const { statusLabel, items } = siteContent[code].products
      const cards = mountPage(code, 'products').get('#products').findAll('li')

      expect(cards).toHaveLength(items.length)
      for (const card of cards) {
        expect(card.text()).toContain(statusLabel)
      }
    })
  })
})
