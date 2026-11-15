import { describe, expect, it } from 'vitest'

import { defaultLanguage, languages, type LanguageCode } from '@/content/languages'
import { siteContent } from '@/content/siteContent'

/** Values that must be identical in every language: links, ids, icons and names. */
function isSameInEveryLanguage(path: string): boolean {
  return (
    /(^|\.)(id|href|icon)$/.test(path) ||
    path === 'hero.companyName' ||
    /^team\.members\[\d+\]\.name$/.test(path)
  )
}

const translations = languages
  .map((language) => language.code)
  .filter((code): code is Exclude<LanguageCode, 'en'> => code !== 'en')

/** Lists every text in the content as [path, value], for clear failure messages. */
function texts(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, index) => texts(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      texts(item, path ? `${path}.${key}` : key),
    )
  }
  return []
}

/** Texts only some languages have, so they are left out of the structure check. */
const onlyInSomeLanguages = new Set(['hero.companyNameGeez'])

/** The structure without the texts: the same for every complete translation. */
function shape(value: unknown, path = ''): unknown {
  if (typeof value === 'string') return isSameInEveryLanguage(path) ? value : 'text'
  if (Array.isArray(value)) return value.map((item, index) => shape(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !onlyInSomeLanguages.has(path ? `${path}.${key}` : key))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, shape(item, path ? `${path}.${key}` : key)]),
    )
  }
  return value
}

describe('languages', () => {
  it('offers English, Spanish, Tigrinya and Amharic, with English as the default', () => {
    expect(languages.map((language) => language.code)).toEqual(['en', 'es', 'ti', 'am'])
    expect(defaultLanguage).toBe('en')
  })

  it('has a complete set of texts for every language, and no others', () => {
    expect(Object.keys(siteContent).sort()).toEqual(
      languages.map((language) => language.code).sort(),
    )
  })

  it('never marks the English reference texts as a draft', () => {
    expect(languages.find((language) => language.code === 'en')!.draft).toBe(false)
  })
})

describe.each(translations)('the %s texts', (code) => {
  const content = siteContent[code]

  it('have every text the English has, in the same structure', () => {
    expect(shape(content)).toEqual(shape(siteContent.en))
  })

  it('keep the same links, ids, icons and names as the English', () => {
    // Covered by the structure check; listed separately so a failure is easy to read.
    const fixed = (all: [string, string][]) => all.filter(([path]) => isSameInEveryLanguage(path))

    expect(fixed(texts(content))).toEqual(fixed(texts(siteContent.en)))
  })

  it('have no empty texts and no spaces around them', () => {
    for (const [path, text] of texts(content)) {
      expect(text.trim(), path).not.toBe('')
      expect(text, path).toBe(text.trim())
    }
  })

  it('are actually translated: headings differ from the English', () => {
    const headings = (all: [string, string][]) =>
      all.filter(([path]) => path.endsWith('.heading')).map(([, text]) => text)

    const translated = headings(texts(content))
    headings(texts(siteContent.en)).forEach((english, index) => {
      expect(translated[index]).not.toBe(english)
    })
  })
})

describe.each(['ti', 'am'] as const)('the %s texts', (code) => {
  it('are written in Ethiopic script, apart from names', () => {
    for (const [path, text] of texts(siteContent[code])) {
      if (isSameInEveryLanguage(path)) continue
      expect(text, path).toMatch(/\p{Script=Ethiopic}/u)
    }
  })
})

describe('the company name', () => {
  it.each(languages.map((language) => language.code))(
    'stays "CelyMary Greener Precast Blocks" in Latin letters (%s)',
    (code) => {
      expect(siteContent[code].hero.companyName).toBe('CelyMary Greener Precast Blocks')
    },
  )

  it("has a second line in Ge'ez script only on the Tigrinya and Amharic pages", () => {
    expect(siteContent.en.hero.companyNameGeez).toBeUndefined()
    expect(siteContent.es.hero.companyNameGeez).toBeUndefined()
    expect(siteContent.ti.hero.companyNameGeez).toMatch(/^\p{Script=Ethiopic}/u)
    expect(siteContent.am.hero.companyNameGeez).toMatch(/^\p{Script=Ethiopic}/u)
  })
})

describe("the founder's own wording", () => {
  // Written by the founder: these must stay exactly as they are.
  it.each([
    ['ti', 'ሰሊሜሪ ሓምለዋይ ብሎኬት', 'ዝተሓተ ካርቦን ዘለዎ ብሎኬት ንሓምለዋይ ህንፃታት'],
    ['am', 'ሰሊሜሪ አረንጓዴ ብሎኬት', 'ዝቅተኛ ካርቦን ያለው ብሎኬት ለአረንጓዴ ሕንፃዎች'],
  ] as const)('is kept exactly for the %s company name and tagline', (code, name, tagline) => {
    expect(siteContent[code].hero.companyNameGeez).toBe(name)
    expect(siteContent[code].hero.tagline).toBe(tagline)
  })

  it('is kept exactly for the English tagline', () => {
    expect(siteContent.en.hero.tagline).toBe('Low-carbon precast blocks for sustainable buildings.')
  })
})

describe('Tigrinya spelling', () => {
  // Ethiopian Tigrinya writes this sound with the ፀ series, not the ጸ series.
  const tsadaiSeries = [...'ጸጹጺጻጼጽጾጿ']

  it('uses the ፀ series instead of the ጸ series in every text', () => {
    for (const [path, text] of texts(siteContent.ti)) {
      for (const letter of tsadaiSeries) {
        expect(text, `${path} contains ${letter}`).not.toContain(letter)
      }
    }
  })
})

describe("the founder's wording in the menu", () => {
  it.each([
    ['ti', 'መእተዊ'],
    ['am', 'መግቢያ'],
  ] as const)('uses "%2$s" for Home in %1$s', (code, home) => {
    expect(siteContent[code].navigation.pages.home).toBe(home)
  })

  it.each([
    ['ti', 'መእተዊ'],
    ['am', 'መግቢያ'],
  ] as const)('uses the same word for Home in the 404 page link in %s', (code, home) => {
    expect(siteContent[code].notFound.homeLink).toContain(home)
  })
})
