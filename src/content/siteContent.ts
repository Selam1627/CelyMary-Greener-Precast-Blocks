// All site texts, by language. Used by the website only; the server imports
// just the English texts it needs.
import type { LanguageCode } from './languages.js'
import { am } from './locales/am.js'
import { en } from './locales/en.js'
import { es } from './locales/es.js'
import { ti } from './locales/ti.js'
import type { SiteContent } from './types.js'

export const siteContent: Record<LanguageCode, SiteContent> = { en, es, ti, am }
