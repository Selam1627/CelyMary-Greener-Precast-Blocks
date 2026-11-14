<script setup lang="ts">
import { computed } from 'vue'

import { useLanguage } from '@/composables/useLanguage'

const { content } = useLanguage()
const roadmap = computed(() => content.value.roadmap)
</script>

<template>
  <section id="roadmap" aria-labelledby="roadmap-heading" class="bg-stone-50 px-4 py-16 sm:py-24">
    <div class="mx-auto max-w-2xl">
      <h2
        id="roadmap-heading"
        class="text-center text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ roadmap.heading }}
      </h2>
      <p class="mt-4 text-center text-lg text-stone-700">{{ roadmap.statement }}</p>
      <ol
        class="mt-10 list-decimal space-y-6 pl-6 text-xl font-semibold marker:text-emerald-700 sm:pl-8"
      >
        <li v-for="step in roadmap.steps" :key="step.id" class="pl-2">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 class="text-xl font-semibold text-emerald-800">{{ step.title }}</h3>
            <span
              v-if="step.statusLabel"
              class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold whitespace-nowrap text-emerald-900"
            >
              {{ step.statusLabel }}
            </span>
          </div>
          <p v-if="step.note" class="mt-1 text-base font-normal text-stone-700">{{ step.note }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
