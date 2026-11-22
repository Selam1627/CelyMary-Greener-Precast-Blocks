<script setup lang="ts">
import { computed } from 'vue'

import { useLanguage } from '@/composables/useLanguage'

const { content } = useLanguage()
const hero = computed(() => content.value.hero)
</script>

<template>
  <section class="bg-emerald-50 px-4 py-20 sm:py-28">
    <div class="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-emerald-900 sm:text-6xl">
        {{ hero.companyName }}
        <span
          v-if="hero.companyNameGeez"
          class="mt-3 block text-2xl font-semibold tracking-normal sm:text-4xl"
        >
          {{ hero.companyNameGeez }}
        </span>
      </h1>
      <p class="text-lg text-stone-700 sm:text-xl">
        {{ hero.tagline }}
      </p>
      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <a
          v-for="(action, index) in hero.actions"
          :key="action.href"
          :href="action.href"
          class="inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          :class="
            index === 0
              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
              : 'border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-100'
          "
        >
          {{ action.label }}
        </a>
      </div>
    </div>
  </section>
</template>
