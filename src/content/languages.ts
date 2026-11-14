// The languages the site is available in. Shared by the website and the
// server (which names the visitor's language in the email), so imports in
// src/content use relative paths ending in ".js".

export const languages = [
  { code: 'en', nativeName: 'English', englishName: 'English', draft: false },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', draft: true },
  { code: 'ti', nativeName: 'ትግርኛ', englishName: 'Tigrinya', draft: true },
  { code: 'am', nativeName: 'አማርኛ', englishName: 'Amharic', draft: true },
] as const

export type Language = (typeof languages)[number]

/** Also used as the page's lang attribute. */
export type LanguageCode = Language['code']

export const defaultLanguage: LanguageCode = 'en'

export function isLanguageCode(value: unknown): value is LanguageCode {
  return languages.some((language) => language.code === value)
}

export function findLanguage(code: LanguageCode): Language {
  return languages.find((language) => language.code === code)!
}
