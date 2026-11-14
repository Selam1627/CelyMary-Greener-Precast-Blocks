/**
 * Type-level tests: they check that TypeScript rejects invalid content in
 * src/content before it can reach the page. Vitest checks them with vue-tsc
 * (see vitest.config.ts); this code never runs.
 */
import { describe, expectTypeOf, it } from 'vitest'

import type { LanguageCode } from '@/content/languages'
import { en } from '@/content/locales/en'
import type {
  Audience,
  Benefit,
  ContactErrorTexts,
  HeroAction,
  HeroContent,
  Product,
  RoadmapContent,
  RoadmapStep,
  SiteContent,
  SolutionContent,
  TeamMember,
  VisitorType,
} from '@/content/types'
import type { ContactFormErrors, ContactFormValues } from '@/utils/contactForm'

const { contact, hero, products, solution, team } = en

describe('content types: expected errors', () => {
  it('rejects a button link that is not an in-page anchor', () => {
    // @ts-expect-error: href must start with "#"
    const external: HeroAction = { label: 'Work with us', href: 'https://example.com' }

    // @ts-expect-error: href must start with "#"
    const bare: HeroAction = { label: 'Contact', href: 'contact' }

    expectTypeOf(external).toEqualTypeOf<HeroAction>()
    expectTypeOf(bare).toEqualTypeOf<HeroAction>()
  })

  it('rejects a button without a label', () => {
    // @ts-expect-error: label is required
    const action: HeroAction = { href: '#contact' }

    expectTypeOf(action).toEqualTypeOf<HeroAction>()
  })

  it('rejects hero content without a tagline', () => {
    // @ts-expect-error: tagline is required
    const content: HeroContent = { companyName: 'CelyMary Greener Precast Blocks', actions: [] }

    expectTypeOf(content).toEqualTypeOf<HeroContent>()
  })

  it('rejects a benefit without a description', () => {
    // @ts-expect-error: description is required
    const benefit: Benefit = { title: 'Lower carbon' }

    expectTypeOf(benefit).toEqualTypeOf<Benefit>()
  })

  it('rejects a benefit with a number instead of text', () => {
    // @ts-expect-error: description must be a string
    const benefit: Benefit = { title: 'Lower carbon', description: 42 }

    expectTypeOf(benefit).toEqualTypeOf<Benefit>()
  })

  it('rejects a product with an icon that does not exist', () => {
    const product: Product = {
      id: 'paving-blocks',
      name: 'Test block',
      description: 'Test use.',
      // @ts-expect-error: icon must be one of the drawn icons
      icon: 'brick',
    }

    expectTypeOf(product).toEqualTypeOf<Product>()
  })

  it('rejects a product without a description', () => {
    // @ts-expect-error: description is required
    const product: Product = { id: 'paving-blocks', name: 'Test block', icon: 'paving' }

    expectTypeOf(product).toEqualTypeOf<Product>()
  })

  it('rejects an audience without a description', () => {
    // @ts-expect-error: description is required
    const audience: Audience = { id: 'test', title: 'For test' }

    expectTypeOf(audience).toEqualTypeOf<Audience>()
  })

  it('rejects a roadmap without steps', () => {
    // @ts-expect-error: steps is required
    const content: RoadmapContent = { heading: 'Test', statement: 'Test.' }

    expectTypeOf(content).toEqualTypeOf<RoadmapContent>()
  })

  it('rejects a roadmap step without a title, but allows no label or note', () => {
    // @ts-expect-error: title is required
    const invalid: RoadmapStep = { id: 'test' }
    const minimal: RoadmapStep = { id: 'test', title: 'Test step' }

    expectTypeOf(invalid).toEqualTypeOf<RoadmapStep>()
    expectTypeOf(minimal).toEqualTypeOf<RoadmapStep>()
  })

  it('rejects a team member without a bio', () => {
    // @ts-expect-error: bio is required
    const member: TeamMember = { name: 'Test name', role: 'Test role' }

    expectTypeOf(member).toEqualTypeOf<TeamMember>()
  })

  it('rejects contact form values without a message', () => {
    // @ts-expect-error: message is required
    const values: ContactFormValues = { name: '', email: '', visitorType: '', product: '' }

    expectTypeOf(values).toEqualTypeOf<ContactFormValues>()
  })

  it('rejects an error for a field that is not required', () => {
    // @ts-expect-error: product is optional, so it never has an error
    const errors: ContactFormErrors = { product: 'nameRequired' }

    expectTypeOf(errors).toEqualTypeOf<ContactFormErrors>()
  })

  it('rejects an error that is not one of the translated error texts', () => {
    // @ts-expect-error: errors are keys of the error texts, not free text
    const errors: ContactFormErrors = { name: 'Please enter your name.' }

    expectTypeOf(errors).toEqualTypeOf<ContactFormErrors>()
  })

  it('rejects a language with a section missing', () => {
    const withoutContact: Omit<SiteContent, 'contact'> = en

    // @ts-expect-error: every language must have every section
    const content: SiteContent = withoutContact

    expectTypeOf(content).toEqualTypeOf<SiteContent>()
  })

  it('rejects a language with an error text missing', () => {
    const errors: Omit<ContactErrorTexts, 'messageTooLong'> = en.contact.errors

    // @ts-expect-error: every language must have every error text
    const content: SiteContent = { ...en, contact: { ...en.contact, errors } }

    expectTypeOf(content).toEqualTypeOf<SiteContent>()
  })

  it('rejects a visitor type or product id the form does not offer', () => {
    // @ts-expect-error: visitor type ids are fixed
    const type: VisitorType = { id: 'robot', label: 'Robot' }

    const product: Product = {
      // @ts-expect-error: product ids are fixed
      id: 'mystery-block',
      name: 'Test block',
      description: 'Test use.',
      icon: 'paving',
    }

    expectTypeOf(type).toEqualTypeOf<VisitorType>()
    expectTypeOf(product).toEqualTypeOf<Product>()
  })

  it('rejects a language the site does not offer', () => {
    // @ts-expect-error: only en, es, ti and am
    const code: LanguageCode = 'fr'

    expectTypeOf(code).toEqualTypeOf<LanguageCode>()
  })

  it('does not allow adding visitor types from code at runtime', () => {
    // @ts-expect-error: visitorTypes is read-only
    contact.visitorTypes.push({ id: 'other', label: 'Test' })

    expectTypeOf(contact.visitorTypes).toEqualTypeOf<readonly VisitorType[]>()
  })

  it('does not allow adding team members from code at runtime', () => {
    // @ts-expect-error: members is read-only
    team.members.push({ name: 'X', role: 'X', bio: 'X.' })

    expectTypeOf(team.members).toEqualTypeOf<readonly TeamMember[]>()
  })

  it('does not allow adding products from code at runtime', () => {
    // @ts-expect-error: items is read-only
    products.items.push({ id: 'paving-blocks', name: 'X', description: 'X.', icon: 'paving' })

    expectTypeOf(products.items).toEqualTypeOf<readonly Product[]>()
  })

  it('does not allow adding buttons or benefits from code at runtime', () => {
    // @ts-expect-error: actions is read-only
    hero.actions.push({ label: 'Extra', href: '#extra' })

    // @ts-expect-error: benefits is read-only
    solution.benefits.push({ title: 'Extra', description: 'Extra.' })

    expectTypeOf(solution).toEqualTypeOf<SolutionContent>()
  })
})
