<script setup lang="ts">
import { computed } from 'vue'

import { useLanguage } from '@/composables/useLanguage'

const { content } = useLanguage()
const solution = computed(() => content.value.solution)
</script>

<template>
  <section id="our-solution" aria-labelledby="our-solution-heading" class="px-4 py-16 sm:py-24">
    <div class="mx-auto max-w-5xl">
      <h2
        id="our-solution-heading"
        class="text-center text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ solution.heading }}
      </h2>
      <ul class="mt-10 grid gap-6 md:grid-cols-3">
        <li
          v-for="benefit in solution.benefits"
          :key="benefit.title"
          class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h3 class="text-xl font-semibold text-emerald-800">{{ benefit.title }}</h3>
          <p class="mt-2 text-stone-700">{{ benefit.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
