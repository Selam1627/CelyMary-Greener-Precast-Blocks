// The site's pages. Each one is a real HTML file at the project root, built by
// Vite (vite.config.ts) and served by Vercel at a clean address ("cleanUrls"
// in vercel.json). There is no router and no rewrite: an address without a
// file gets a real 404 status, with the page in 404.html.
//
// Also imported by vite.config.ts, so no "@/" imports here.

/** The pages in the header menu, in order. */
export const menuPages = [
  { id: 'home', path: '/', file: 'index.html' },
  { id: 'products', path: '/products', file: 'products.html' },
  { id: 'about', path: '/about', file: 'about.html' },
  { id: 'contact', path: '/contact', file: 'contact.html' },
] as const

/** Linked from the footer and the contact form, not from the header menu. */
export const privacyPage = { id: 'privacy', path: '/privacy', file: 'privacy.html' } as const

/** The pages in the footer, in order. */
export const footerPages = [...menuPages, privacyPage] as const

/** The page Vercel shows, with a 404 status, for any address without a file. */
export const notFoundPage = { id: 'not-found', file: '404.html' } as const

/** Every page, each with its HTML file. */
export const allPages = [...footerPages, notFoundPage] as const

export type MenuPageId = (typeof menuPages)[number]['id']
/** Pages with their own address. */
export type AddressedPageId = (typeof footerPages)[number]['id']
export type PageId = (typeof allPages)[number]['id']
export type PagePath = (typeof footerPages)[number]['path']

/** Every HTML file Vite builds, by name. */
export const htmlFiles = allPages.map((page) => page.file)

export function isPageId(value: unknown): value is PageId {
  return allPages.some((page) => page.id === value)
}

export function pathOf(id: AddressedPageId): PagePath {
  return footerPages.find((page) => page.id === id)!.path
}
