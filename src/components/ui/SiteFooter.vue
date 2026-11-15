<script setup lang="ts">
import { computed } from 'vue'

import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useLanguage } from '@/composables/useLanguage'
import { footerPages, type PageId } from '@/pages'
import { companyNameInText } from '@/utils/companyName'
import { pageName } from '@/utils/pageTitle'

defineProps<{
  /** Marked as the current page in the footer links. */
  currentPage: PageId
}>()

const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim()

const { content } = useLanguage()
const footer = computed(() => content.value.footer)

const linkClass =
  'inline-flex min-h-11 items-center rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-[current=page]:font-semibold aria-[current=page]:text-brand-leaf aria-[current=page]:underline'
</script>

<template>
  <footer class="bg-brand-dark px-4 py-12 text-white">
    <div class="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:justify-between">
      <div class="flex flex-col gap-3">
        <p class="flex items-center gap-3 font-bold">
          <!-- Decorative here: the company name is written next to it. -->
          <BrandLogo variant="dark" class="size-10 shrink-0" />
          {{ companyNameInText(content) }}
        </p>
        <p v-if="contactEmail">
          {{ footer.emailLabel }}
          <a
            :href="`mailto:${contactEmail}`"
            class="font-medium wrap-anywhere text-brand-leaf underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >{{ contactEmail }}</a
          >
        </p>
      </div>

      <nav :aria-label="footer.label">
        <ul class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-6 md:flex-col">
          <li v-for="page in footerPages" :key="page.id">
            <a
              :href="page.path"
              :aria-current="page.id === currentPage ? 'page' : undefined"
              :class="linkClass"
            >
              {{ pageName(page.id, content) }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <p class="mx-auto mt-8 max-w-5xl border-t border-white/20 pt-6 text-sm text-stone-300">
      {{ footer.copyright }}
    </p>
  </footer>
</template>
