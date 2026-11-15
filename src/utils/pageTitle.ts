import type { SiteContent } from '@/content/types'
import type { PageId } from '@/pages'

/** The page's name in the visitor's language. */
export function pageName(page: PageId, content: SiteContent): string {
  if (page === 'not-found') return content.notFound.heading
  if (page === 'privacy') return content.footer.privacyLink
  return content.navigation.pages[page]
}

/**
 * The browser tab title: the page name, then the company name. The home page
 * uses the company name alone.
 */
export function pageTitle(page: PageId, content: SiteContent): string {
  const company = content.hero.companyName
  if (page === 'home') return company
  return `${pageName(page, content)} – ${company}`
}
