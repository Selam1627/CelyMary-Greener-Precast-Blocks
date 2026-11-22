import { computed, readonly, ref, watch } from 'vue'

import { defaultLanguage, isLanguageCode, type LanguageCode } from '@/content/languages'
import { siteContent } from '@/content/siteContent'

/** Where the visitor's choice is remembered in the browser. */
export const languageStorageKey = 'celymary-language'

/** The saved choice, or English when there is none, it is unknown, or storage is blocked. */
function readSavedLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(languageStorageKey)
    if (isLanguageCode(saved)) return saved
  } catch {
    // Storage can be blocked (private windows, strict privacy settings).
  }
  return defaultLanguage
}

function saveLanguage(code: LanguageCode) {
  try {
    localStorage.setItem(languageStorageKey, code)
  } catch {
    // The choice still applies to this visit; it just won't be remembered.
  }
}

// One language for the whole page, read before the first render so the page
// never flashes in English for a visitor who chose another language.
const current = ref<LanguageCode>(readSavedLanguage())
const content = computed(() => siteContent[current.value])

// Screen readers, fonts and browser translation all rely on the lang attribute.
watch(
  current,
  (code) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code
    }
  },
  { immediate: true },
)

function setLanguage(code: LanguageCode) {
  current.value = code
  saveLanguage(code)
}

/** The current language, its texts, and a way to change it. */
export function useLanguage() {
  return {
    language: readonly(current),
    content,
    setLanguage,
  }
}
