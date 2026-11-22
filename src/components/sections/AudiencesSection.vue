<script setup lang="ts">
import { computed } from 'vue'

import { useLanguage } from '@/composables/useLanguage'

const { content } = useLanguage()
const audiences = computed(() => content.value.audiences)

withDefaults(
  defineProps<{
    /** "h1" when this section opens its page; otherwise a section heading. */
    headingLevel?: 'h1' | 'h2'
  }>(),
  { headingLevel: 'h2' },
)
</script>

<template>
  <section id="work-with-us" aria-labelledby="work-with-us-heading" class="px-4 py-16 sm:py-24">
    <div class="mx-auto max-w-5xl">
      <component
        :is="headingLevel"
        id="work-with-us-heading"
        class="text-center text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ audiences.heading }}
      </component>
      <ul class="mt-10 grid gap-6 md:grid-cols-3">
        <li
          v-for="audience in audiences.items"
          :key="audience.id"
          class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h3 class="text-xl font-semibold text-emerald-800">{{ audience.title }}</h3>
          <p class="mt-2 text-stone-700">{{ audience.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
