<script setup lang="ts">
import { computed } from 'vue'

import { useLanguage } from '@/composables/useLanguage'
import { pathOf } from '@/pages'

const { content } = useLanguage()
const notFound = computed(() => content.value.notFound)
</script>

<template>
  <section aria-labelledby="not-found-heading" class="px-4 py-20 sm:py-28">
    <div class="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
      <h1
        id="not-found-heading"
        class="text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ notFound.heading }}
      </h1>
      <p class="text-lg text-stone-700">{{ notFound.message }}</p>
      <a
        :href="pathOf('home')"
        class="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        {{ notFound.homeLink }}
      </a>
    </div>
  </section>
</template>
