<script setup lang="ts">
import { computed } from 'vue'

import LinkedText, { type TextLink } from '@/components/ui/LinkedText.vue'
import { useLanguage } from '@/composables/useLanguage'

const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim()

const { content } = useLanguage()
const privacy = computed(() => content.value.privacy)

/** What the placeholders in the privacy texts stand for. */
const links = computed<Record<string, TextLink>>(() => ({
  email: contactEmail
    ? { text: contactEmail, href: `mailto:${contactEmail}` }
    : { text: privacy.value.emailFallback },
  aepd: { text: 'www.aepd.es', href: 'https://www.aepd.es' },
}))
</script>

<template>
  <section id="privacy" aria-labelledby="privacy-heading" class="px-4 py-16 sm:py-24">
    <div class="mx-auto max-w-2xl">
      <h1
        id="privacy-heading"
        class="text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ privacy.heading }}
      </h1>
      <p class="mt-4 text-lg text-stone-700">{{ privacy.intro }}</p>

      <section
        v-for="part in privacy.sections"
        :key="part.id"
        :aria-labelledby="`privacy-${part.id}`"
        class="mt-10"
      >
        <h2 :id="`privacy-${part.id}`" class="text-xl font-semibold text-emerald-800">
          {{ part.heading }}
        </h2>
        <p v-for="(paragraph, index) in part.paragraphs" :key="index" class="mt-3 text-stone-700">
          <LinkedText :text="paragraph" :links="links" />
        </p>
      </section>
    </div>
  </section>
</template>
