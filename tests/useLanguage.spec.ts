import { afterEach, describe, expect, it, vi } from 'vitest'

import { siteContent } from '@/content/siteContent'

/** Loads the composable as on a fresh page visit, so it reads the saved choice again. */
async function freshVisit() {
  vi.resetModules()
  const { useLanguage, languageStorageKey } = await import('@/composables/useLanguage')
  return { ...useLanguage(), languageStorageKey }
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.lang = 'en'
})

describe('useLanguage', () => {
  describe('normal cases', () => {
    it('starts in English when the visitor has not chosen a language', async () => {
      const { language, content } = await freshVisit()

      expect(language.value).toBe('en')
      expect(content.value).toEqual(siteContent.en)
      expect(document.documentElement.lang).toBe('en')
    })

    it('switches the texts and the page lang attribute', async () => {
      const { language, content, setLanguage } = await freshVisit()

      setLanguage('am')
      await Promise.resolve()

      expect(language.value).toBe('am')
      expect(content.value).toEqual(siteContent.am)
      expect(document.documentElement.lang).toBe('am')
    })

    it('remembers the choice for the next visit', async () => {
      const first = await freshVisit()
      first.setLanguage('ti')
      expect(localStorage.getItem(first.languageStorageKey)).toBe('ti')

      const next = await freshVisit()

      expect(next.language.value).toBe('ti')
      expect(next.content.value).toEqual(siteContent.ti)
      expect(document.documentElement.lang).toBe('ti')
    })

    it('shares one language across the whole page', async () => {
      vi.resetModules()
      const { useLanguage } = await import('@/composables/useLanguage')

      useLanguage().setLanguage('es')

      expect(useLanguage().language.value).toBe('es')
    })
  })

  describe('expected errors', () => {
    it.each(['fr', '', 'EN', 'english'])(
      'ignores a saved value that is not a site language (%j)',
      async (saved) => {
        localStorage.setItem('celymary-language', saved)

        const { language } = await freshVisit()

        expect(language.value).toBe('en')
      },
    )

    it('starts in English when browser storage is blocked', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError')
      })

      const { language } = await freshVisit()

      expect(language.value).toBe('en')
    })

    it('still switches language when the choice cannot be saved', async () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })
      const { language, setLanguage } = await freshVisit()

      expect(() => setLanguage('es')).not.toThrow()
      expect(language.value).toBe('es')
    })
  })
})
