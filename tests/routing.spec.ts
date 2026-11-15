// @vitest-environment node
// Page addresses and real 404s: the files Vite builds and the Vercel settings
// that serve them. What Vercel itself does with these settings is checked on
// a preview deployment before each release.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { en } from '@/content/locales/en'
import { htmlFiles, isPageId, menuPages, notFoundPage, type PageId } from '@/pages'
import { pageTitle } from '@/utils/pageTitle'

import viteConfig from '../vite.config'

const root = fileURLToPath(new URL('../', import.meta.url))

function read(file: string) {
  return readFileSync(`${root}${file}`, 'utf8')
}

const vercel = JSON.parse(read('vercel.json')) as Record<string, unknown>

const allPages: { id: PageId; file: string }[] = [...menuPages, notFoundPage]

describe('page addresses on Vercel', () => {
  it('serves each page at a clean address, such as /products', () => {
    expect(vercel.cleanUrls).toBe(true)
  })

  it('sends /products/ to /products, so each page has one address', () => {
    expect(vercel.trailingSlash).toBe(false)
  })

  it('has no rewrites, routes or redirects, so unknown addresses stay real 404s (v0.1.1)', () => {
    for (const key of ['rewrites', 'routes', 'redirects']) {
      expect(vercel).not.toHaveProperty(key)
    }
  })

  it('builds the site into dist/, where Vercel looks for it', () => {
    expect(vercel.outputDirectory).toBe('dist')
  })
})

describe('page files', () => {
  it('gives every page an HTML file, and the address is the file name', () => {
    for (const page of menuPages) {
      expect(existsSync(`${root}${page.file}`)).toBe(true)
      const expected = page.id === 'home' ? '/' : `/${page.file.replace(/\.html$/, '')}`
      expect(page.path).toBe(expected)
    }
  })

  it('has a 404.html, which Vercel shows with a 404 status for unknown addresses', () => {
    expect(notFoundPage.file).toBe('404.html')
    expect(existsSync(`${root}404.html`)).toBe(true)
  })

  it('builds every page file, and nothing else', () => {
    const input = viteConfig.build?.rolldownOptions?.input as Record<string, string>

    expect(Object.keys(input).sort()).toEqual(['404', 'about', 'contact', 'index', 'products'])
    for (const file of htmlFiles) {
      expect(Object.values(input).some((path) => path.endsWith(file))).toBe(true)
    }
  })

  it('runs as several pages, with no fallback to the home page in development', () => {
    expect(viteConfig.appType).toBe('mpa')
  })

  it.each(allPages)('$file says which page it is and loads the site script', ({ id, file }) => {
    const html = read(file)

    expect(html).toContain(`<div id="app" data-page="${id}"></div>`)
    expect(html).toContain('<script type="module" src="/src/main.ts"></script>')
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('name="viewport"')
  })

  it.each(allPages)('$file has the English title, before the script runs', ({ id, file }) => {
    expect(read(file)).toContain(`<title>${pageTitle(id, en)}</title>`)
  })

  it.each(menuPages)('$file has a description for search engines', ({ file }) => {
    expect(read(file)).toMatch(/<meta\s+name="description"\s+content="[^"]+"/)
  })

  it('keeps the 404 page out of search results', () => {
    expect(read('404.html')).toContain('<meta name="robots" content="noindex" />')
  })
})

describe('isPageId', () => {
  it('accepts every page', () => {
    for (const page of allPages) {
      expect(isPageId(page.id)).toBe(true)
    }
  })

  it.each([undefined, '', 'Home', 'blog', '404'])('refuses %j', (value) => {
    expect(isPageId(value)).toBe(false)
  })
})
