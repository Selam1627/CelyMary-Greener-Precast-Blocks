import type { SiteContent } from '@/content/types'
import type { PageId } from '@/pages'

/**
 * The browser tab title: the page name, then the company name. The home page
 * uses the company name alone.
 */
export function pageTitle(page: PageId, content: SiteContent): string {
  const company = content.hero.companyName
  if (page === 'home') return company
  const name = page === 'not-found' ? content.notFound.heading : content.navigation.pages[page]
  return `${name} – ${company}`
}
