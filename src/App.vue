<script setup lang="ts">
import { watchEffect } from 'vue'

import AudiencesSection from '@/components/sections/AudiencesSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import NotFoundSection from '@/components/sections/NotFoundSection.vue'
import PrivacySection from '@/components/sections/PrivacySection.vue'
import ProductsSection from '@/components/sections/ProductsSection.vue'
import RoadmapSection from '@/components/sections/RoadmapSection.vue'
import SolutionSection from '@/components/sections/SolutionSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
import SiteFooter from '@/components/ui/SiteFooter.vue'
import SiteHeader from '@/components/ui/SiteHeader.vue'
import { useLanguage } from '@/composables/useLanguage'
import type { PageId } from '@/pages'
import { pageTitle } from '@/utils/pageTitle'

const props = withDefaults(
  defineProps<{
    /** Which page to show. Set by main.ts from the page's HTML file. */
    page?: PageId
  }>(),
  { page: 'home' },
)

const { content } = useLanguage()

// The HTML file has the English title; this keeps it in the chosen language.
watchEffect(() => {
  document.title = pageTitle(props.page, content.value)
})
</script>

<template>
  <!-- First stop for keyboard users: jumps past the header and menu. -->
  <a
    href="#main-content"
    class="sr-only z-30 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
  >
    {{ content.navigation.skipLink }}
  </a>

  <SiteHeader :current-page="page" />

  <main id="main-content" tabindex="-1" class="min-h-screen bg-white focus:outline-none">
    <template v-if="page === 'home'">
      <HeroSection />
      <SolutionSection />
    </template>

    <ProductsSection v-else-if="page === 'products'" heading-level="h1" />

    <template v-else-if="page === 'about'">
      <AudiencesSection heading-level="h1" />
      <RoadmapSection />
      <TeamSection />
    </template>

    <ContactSection v-else-if="page === 'contact'" heading-level="h1" />

    <PrivacySection v-else-if="page === 'privacy'" />

    <NotFoundSection v-else />
  </main>

  <SiteFooter :current-page="page" />
</template>
