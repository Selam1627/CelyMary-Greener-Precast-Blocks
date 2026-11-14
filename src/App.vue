<script setup lang="ts">
import AudiencesSection from '@/components/sections/AudiencesSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProductsSection from '@/components/sections/ProductsSection.vue'
import RoadmapSection from '@/components/sections/RoadmapSection.vue'
import SolutionSection from '@/components/sections/SolutionSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
</script>

<template>
  <header class="bg-emerald-50 px-4 pt-4">
    <div class="mx-auto flex max-w-5xl justify-end">
      <LanguageSwitcher />
    </div>
  </header>
  <main class="min-h-screen bg-white">
    <HeroSection />
    <SolutionSection />
    <ProductsSection />
    <AudiencesSection />
    <RoadmapSection />
    <TeamSection />
    <ContactSection />
  </main>
</template>
