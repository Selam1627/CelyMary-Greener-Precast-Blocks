<script setup lang="ts">
import type { ProductIconName } from '@/content/types'

defineProps<{
  name: ProductIconName
}>()
</script>

<template>
  <!-- Decorative: the product name is always shown next to the icon. -->
  <svg
    :data-icon="name"
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- A small wall of stacked blocks -->
    <template v-if="name === 'building-block'">
      <rect x="6" y="12" width="36" height="27" rx="1" />
      <path d="M6 21h36M6 30h36M18 12v9M30 12v9M12 21v9M24 21v9M36 21v9M18 30v9M30 30v9" />
    </template>

    <!-- A tilted solar panel resting on two blocks -->
    <template v-else-if="name === 'solar-ballast'">
      <rect x="6" y="34" width="14" height="8" rx="1" />
      <rect x="28" y="34" width="14" height="8" rx="1" />
      <path d="M10 28 36 10l6 6-26 18Z" />
      <path d="M23 19l6 6M38 17v17" />
    </template>

    <!-- Paving bricks seen from above, laid in an offset (staggered) pattern -->
    <template v-else-if="name === 'paving'">
      <rect x="4" y="5" width="12" height="8" rx="1" />
      <rect x="18" y="5" width="12" height="8" rx="1" />
      <rect x="32" y="5" width="12" height="8" rx="1" />
      <rect x="4" y="15" width="5" height="8" rx="1" />
      <rect x="11" y="15" width="12" height="8" rx="1" />
      <rect x="25" y="15" width="12" height="8" rx="1" />
      <rect x="39" y="15" width="5" height="8" rx="1" />
      <rect x="4" y="25" width="12" height="8" rx="1" />
      <rect x="18" y="25" width="12" height="8" rx="1" />
      <rect x="32" y="25" width="12" height="8" rx="1" />
      <rect x="4" y="35" width="5" height="8" rx="1" />
      <rect x="11" y="35" width="12" height="8" rx="1" />
      <rect x="25" y="35" width="12" height="8" rx="1" />
      <rect x="39" y="35" width="5" height="8" rx="1" />
    </template>

    <!-- A stepped wall holding back a slope, with a small plant -->
    <template v-else-if="name === 'retaining-wall'">
      <path d="M4 42h40" />
      <rect x="10" y="34" width="10" height="8" />
      <rect x="14" y="26" width="10" height="8" />
      <rect x="18" y="18" width="10" height="8" />
      <path d="M28 18c6-2 10-3 16-4" />
      <path d="M36 15V8M36 11c-3-1-4-3-4-5 3 0 4 2 4 5M36 12c3-1 4-3 4-5-3 0-4 2-4 5" />
    </template>

    <!-- Side view: a raised kerb stone between a lower road (left) and the
         pavement (right), which sits level with the top of the kerb -->
    <template v-else-if="name === 'kerb'">
      <path d="M4 40h40" />
      <path d="M4 32h14" />
      <path d="M18 40V22l3-3h7v21" />
      <rect x="28" y="19" width="16" height="6" rx="1" />
    </template>
  </svg>
</template>
