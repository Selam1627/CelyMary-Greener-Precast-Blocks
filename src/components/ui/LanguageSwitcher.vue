<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

import { useLanguage } from '@/composables/useLanguage'
import { findLanguage, languages, type LanguageCode } from '@/content/languages'

const { content, language, setLanguage } = useLanguage()

const menuId = 'language-menu'
const open = ref(false)
const root = useTemplateRef<HTMLElement>('root')
const toggle = useTemplateRef<HTMLButtonElement>('toggle')
const options = useTemplateRef<HTMLButtonElement[]>('options')

const currentCode = computed(() => language.value.toUpperCase())

// The visible text is only the code ("EN"), so screen readers get the full
// name too. The code stays in the name for people who use voice control.
const toggleLabel = computed(
  () =>
    `${content.value.languageSwitcher.label}: ${findLanguage(language.value).nativeName} (${currentCode.value})`,
)

/** Moves keyboard focus to one of the languages in the open menu. */
function focusOption(index: number) {
  const items = options.value ?? []
  if (items.length === 0) return
  items[(index + items.length) % items.length]!.focus()
}

function currentIndex() {
  return languages.findIndex((option) => option.code === language.value)
}

async function openMenu() {
  open.value = true
  await nextTick()
  focusOption(currentIndex())
}

function closeMenu({ returnFocus = false } = {}) {
  open.value = false
  if (returnFocus) toggle.value?.focus()
}

function toggleMenu() {
  if (open.value) {
    closeMenu()
  } else {
    void openMenu()
  }
}

function choose(code: LanguageCode) {
  setLanguage(code)
  closeMenu({ returnFocus: true })
}

/** Arrow keys, Home and End move between languages; Escape closes the menu. */
function onMenuKeydown(event: KeyboardEvent) {
  const items = options.value ?? []
  const focused = items.indexOf(document.activeElement as HTMLButtonElement)

  switch (event.key) {
    case 'ArrowDown':
      focusOption(focused + 1)
      break
    case 'ArrowUp':
      focusOption(focused - 1)
      break
    case 'Home':
      focusOption(0)
      break
    case 'End':
      focusOption(items.length - 1)
      break
    case 'Escape':
      closeMenu({ returnFocus: true })
      break
    default:
      return
  }
  event.preventDefault()
}

/** Opening with the arrow keys, as in most dropdowns. */
function onToggleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    void openMenu()
  }
}

/** Closes the menu when focus moves elsewhere, for example with Tab. */
function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !root.value?.contains(next)) closeMenu()
}

/** Closes the menu on a tap or click anywhere else on the page. */
function onDocumentPointerDown(event: PointerEvent) {
  if (open.value && !root.value?.contains(event.target as Node)) closeMenu()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<template>
  <nav
    ref="root"
    :aria-label="content.languageSwitcher.label"
    class="relative"
    @focusout="onFocusOut"
  >
    <button
      ref="toggle"
      type="button"
      :aria-label="toggleLabel"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="menuId"
      class="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-emerald-700 bg-white px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      @click="toggleMenu"
      @keydown="onToggleKeydown"
    >
      <!-- A globe: the usual sign for "language". Decorative. -->
      <svg
        data-icon="globe"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
        class="size-5 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </svg>
      <span lang="en">{{ currentCode }}</span>
      <!-- A small arrow that points up while the menu is open. Decorative. -->
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        class="size-4 shrink-0 transition-transform motion-reduce:transition-none"
        :class="{ 'rotate-180': open }"
      >
        <path
          d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"
        />
      </svg>
    </button>

    <ul
      v-show="open"
      :id="menuId"
      class="absolute right-0 z-10 mt-2 w-max min-w-40 rounded-md border border-stone-200 bg-white py-1 shadow-lg"
      @keydown="onMenuKeydown"
    >
      <li v-for="option in languages" :key="option.code">
        <!-- Each name is written in its own language and script. -->
        <button
          ref="options"
          type="button"
          :lang="option.code"
          :aria-current="option.code === language ? 'true' : undefined"
          class="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 px-4 text-left text-base text-stone-800 hover:bg-emerald-50 focus-visible:bg-emerald-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-700 aria-[current=true]:font-semibold aria-[current=true]:text-emerald-900"
          @click="choose(option.code)"
        >
          {{ option.nativeName }}
          <!-- A tick next to the current language. Decorative: aria-current says it. -->
          <svg
            v-if="option.code === language"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            class="size-4 shrink-0 text-emerald-700"
          >
            <path
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
            />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>
