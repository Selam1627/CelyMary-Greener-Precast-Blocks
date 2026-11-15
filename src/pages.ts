// The site's pages. Each one is a real HTML file at the project root, built by
// Vite (vite.config.ts) and served by Vercel at a clean address ("cleanUrls"
// in vercel.json). There is no router and no rewrite: an address without a
// file gets a real 404 status, with the page in 404.html.
//
// Also imported by vite.config.ts, so no "@/" imports here.

export const menuPages = [
  { id: 'home', path: '/', file: 'index.html' },
  { id: 'products', path: '/products', file: 'products.html' },
  { id: 'about', path: '/about', file: 'about.html' },
  { id: 'contact', path: '/contact', file: 'contact.html' },
] as const

/** The page Vercel shows, with a 404 status, for any address without a file. */
export const notFoundPage = { id: 'not-found', file: '404.html' } as const

export type MenuPageId = (typeof menuPages)[number]['id']
export type PageId = MenuPageId | typeof notFoundPage.id
export type PagePath = (typeof menuPages)[number]['path']

/** Every HTML file Vite builds, by name. */
export const htmlFiles = [...menuPages, notFoundPage].map((page) => page.file)

export function isPageId(value: unknown): value is PageId {
  return value === notFoundPage.id || menuPages.some((page) => page.id === value)
}

export function pathOf(id: MenuPageId): PagePath {
  return menuPages.find((page) => page.id === id)!.path
}
