<script setup lang="ts">
import { computed } from 'vue'

import ProductIcon from '@/components/ui/ProductIcon.vue'
import { useLanguage } from '@/composables/useLanguage'

const { content } = useLanguage()
const products = computed(() => content.value.products)

withDefaults(
  defineProps<{
    /** "h1" when this section opens its page; otherwise a section heading. */
    headingLevel?: 'h1' | 'h2'
  }>(),
  { headingLevel: 'h2' },
)
</script>

<template>
  <section id="products" aria-labelledby="products-heading" class="bg-stone-50 px-4 py-16 sm:py-24">
    <div class="mx-auto max-w-5xl">
      <component
        :is="headingLevel"
        id="products-heading"
        class="text-center text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ products.heading }}
      </component>
      <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="product in products.items"
          :key="product.id"
          class="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <ProductIcon :name="product.icon" class="size-12 shrink-0 text-emerald-700" />
            <span
              class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold whitespace-nowrap text-amber-900"
            >
              {{ products.statusLabel }}
            </span>
          </div>
          <h3 class="text-xl font-semibold text-emerald-800">{{ product.name }}</h3>
          <p class="text-stone-700">{{ product.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
