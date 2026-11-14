<script setup lang="ts">
import { computed } from 'vue'

import { useLanguage } from '@/composables/useLanguage'

const { content } = useLanguage()
const team = computed(() => content.value.team)
</script>

<template>
  <section id="team" aria-labelledby="team-heading" class="px-4 py-16 sm:py-24">
    <div class="mx-auto max-w-3xl">
      <h2
        id="team-heading"
        class="text-center text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ team.heading }}
      </h2>
      <ul class="mt-10 grid gap-6 sm:grid-cols-2">
        <li
          v-for="member in team.members"
          :key="member.name"
          class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h3 class="text-xl font-semibold text-emerald-800">{{ member.name }}</h3>
          <p class="mt-1 font-medium text-stone-600">{{ member.role }}</p>
          <p class="mt-3 text-stone-700">{{ member.bio }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
