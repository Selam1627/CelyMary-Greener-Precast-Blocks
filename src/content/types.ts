// The shape of the site's texts. Every language file in src/content/locales/
// must provide a complete SiteContent, so TypeScript refuses a language with a
// missing text.
import type { MenuPageId, PagePath } from '../pages.js'

export interface NavigationContent {
  /** First link on every page, shown on keyboard focus: jumps past the menu. */
  skipLink: string
  /** Screen-reader label of the main menu. */
  menuLabel: string
  /** Text of the button that opens the menu on phones. */
  menuButton: string
  /** Each page's name in the menu, also used in the browser tab title. */
  pages: Record<MenuPageId, string>
}

export interface NotFoundContent {
  heading: string
  message: string
  homeLink: string
}

export interface LanguageSwitcherContent {
  /** Screen-reader label of the language buttons. */
  label: string
}

export interface HeroAction {
  label: string
  /** Address of the page the button opens. */
  href: PagePath
}

export interface HeroContent {
  /** The brand name, in Latin letters on every page. Not translated. */
  companyName: string
  /** Shown instead of the full name in the header on phones, where space is short. */
  companyShortName: string
  /**
   * The brand name in Ge'ez script, shown under the Latin name. Only for
   * languages written in Ge'ez (Tigrinya and Amharic).
   */
  companyNameGeez?: string
  tagline: string
  /** The first action is shown as the primary button. */
  actions: readonly HeroAction[]
}

export interface Benefit {
  title: string
  description: string
}

export interface SolutionContent {
  heading: string
  benefits: readonly Benefit[]
}

export type ProductIconName =
  'building-block' | 'solar-ballast' | 'paving' | 'retaining-wall' | 'kerb'

export type ProductId =
  | 'standard-building-blocks'
  | 'solar-panel-ballast-blocks'
  | 'paving-blocks'
  | 'retaining-wall-and-landscaping-blocks'
  | 'kerbs-and-edging'

export interface Product {
  /** Stable identifier, the same in every language. Sent by the contact form. */
  id: ProductId
  name: string
  /** What the block is used for. No technical specifications. */
  description: string
  icon: ProductIconName
}

export interface ProductsContent {
  heading: string
  /** Label shown on every card: all products are still in development. */
  statusLabel: string
  items: readonly Product[]
}

export interface Audience {
  /** Stable identifier, used as the list key. */
  id: string
  title: string
  description: string
}

export interface AudiencesContent {
  heading: string
  items: readonly Audience[]
}

export interface RoadmapStep {
  /** Stable identifier, used as the list key. */
  id: string
  title: string
  /** Small label shown next to the title, such as "Current stage". */
  statusLabel?: string
  /** Short note shown under the title. */
  note?: string
}

export interface RoadmapContent {
  heading: string
  statement: string
  /** In the order the company plans to go through them. */
  steps: readonly RoadmapStep[]
}

export interface TeamMember {
  /** Not translated. */
  name: string
  role: string
  bio: string
}

export interface TeamContent {
  heading: string
  members: readonly TeamMember[]
}

export type VisitorTypeId =
  'architect' | 'engineer' | 'builder' | 'real-estate-developer' | 'investor' | 'partner' | 'other'

export interface VisitorType {
  /** Stable identifier, the same in every language. Sent by the contact form. */
  id: VisitorTypeId
  label: string
}

export interface ContactErrorTexts {
  nameRequired: string
  nameTooLong: string
  emailRequired: string
  emailInvalid: string
  visitorTypeRequired: string
  messageRequired: string
  messageTooLong: string
}

export interface ContactContent {
  heading: string
  labels: {
    name: string
    email: string
    visitorType: string
    product: string
    message: string
  }
  visitorTypes: readonly VisitorType[]
  visitorTypePrompt: string
  productPrompt: string
  submitLabel: string
  /** Replaces the submit label while the message is being sent. */
  sendingLabel: string
  /** Shown after the message has been sent. */
  successMessage: string
  /** Shown when the message could not be sent. */
  failureMessage: string
  /** Followed by the contact address, as a link. */
  directContactPrefix: string
  /**
   * Label of the hidden spam-trap field. Visitors never see it; it only tells
   * anyone who somehow reaches it to leave it empty.
   */
  spamTrapLabel: string
  errors: ContactErrorTexts
}

/** Every text on the site, in one language. */
export interface SiteContent {
  navigation: NavigationContent
  notFound: NotFoundContent
  languageSwitcher: LanguageSwitcherContent
  hero: HeroContent
  solution: SolutionContent
  products: ProductsContent
  audiences: AudiencesContent
  roadmap: RoadmapContent
  team: TeamContent
  contact: ContactContent
}
