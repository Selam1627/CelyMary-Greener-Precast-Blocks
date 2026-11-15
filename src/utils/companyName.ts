import type { SiteContent } from '@/content/types'

/**
 * The company name as written in the page's text (header and footer): in
 * Ge'ez script on the Tigrinya and Amharic pages, in Latin letters otherwise.
 * The hero title and the browser tab title always use the Latin name.
 */
export function companyNameInText(content: SiteContent): string {
  return content.hero.companyNameGeez ?? content.hero.companyName
}
