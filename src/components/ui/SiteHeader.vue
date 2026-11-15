<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'

import BrandLogo from '@/components/ui/BrandLogo.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useDismiss } from '@/composables/useDismiss'
import { useLanguage } from '@/composables/useLanguage'
import { menuPages, type PageId } from '@/pages'
import { companyNameInText } from '@/utils/companyName'

defineProps<{
  /** Marked as the current page in the menu. */
  currentPage: PageId
}>()

const { content } = useLanguage()
const navigation = computed(() => content.value.navigation)

const menuId = 'site-menu'
const open = ref(false)
const nav = useTemplateRef<HTMLElement>('nav')
const toggle = useTemplateRef<HTMLButtonElement>('toggle')

function closeMenu({ returnFocus = false } = {}) {
  open.value = false
  if (returnFocus) toggle.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    closeMenu({ returnFocus: true })
  }
}

const { onFocusOut } = useDismiss(
  nav,
  () => open.value,
  () => closeMenu(),
)
</script>

<template>
  <header class="relative border-b border-stone-200 bg-white">
    <div class="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 sm:gap-4">
      <a
        href="/"
        class="mr-auto flex items-center gap-2 rounded-md py-2 leading-tight font-bold text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        <BrandLogo :label="navigation.logoLabel" class="size-9 shrink-0" />
        <!-- Phones get the short name; from the sm breakpoint, the full name. -->
        <span class="sm:hidden">{{ content.hero.companyShortName }}</span>
        <span class="hidden sm:inline">{{ companyNameInText(content) }}</span>
      </a>

      <nav ref="nav" :aria-label="navigation.menuLabel" @focusout="onFocusOut" @keydown="onKeydown">
        <!-- Phones only: from the md breakpoint the menu is always shown. -->
        <button
          ref="toggle"
          type="button"
          :aria-expanded="open ? 'true' : 'false'"
          :aria-controls="menuId"
          class="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 md:hidden"
          @click="open = !open"
        >
          <!-- Three lines while closed, a cross while open. Decorative. -->
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
            focusable="false"
            class="size-5 shrink-0"
          >
            <path v-if="open" d="M6 6l12 12M18 6 6 18" />
            <path v-else d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          {{ navigation.menuButton }}
        </button>

        <ul
          :id="menuId"
          class="absolute inset-x-0 top-full z-20 flex-col gap-1 border-b border-stone-200 bg-white px-4 py-2 shadow-md md:static md:flex md:flex-row md:border-0 md:p-0 md:shadow-none"
          :class="open ? 'flex' : 'hidden'"
        >
          <li v-for="page in menuPages" :key="page.id">
            <a
              :href="page.path"
              :aria-current="page.id === currentPage ? 'page' : undefined"
              class="flex min-h-11 items-center rounded-md px-3 font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 aria-[current=page]:bg-emerald-100 aria-[current=page]:font-semibold aria-[current=page]:text-emerald-900"
              @click="closeMenu()"
            >
              {{ navigation.pages[page.id] }}
            </a>
          </li>
        </ul>
      </nav>

      <LanguageSwitcher />
    </div>
  </header>
</template>
