<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** "color" on light backgrounds, "dark" on dark backgrounds. */
    variant?: 'color' | 'dark'
    /** Accessible name. Without one, the logo is decorative and hidden from screen readers. */
    label?: string
  }>(),
  { variant: 'color', label: undefined },
)

// The founder's chosen mark, "Leaf on a block". Keep the shapes and colours exactly.
const colors = computed(() =>
  props.variant === 'dark'
    ? { leaf: '#3DBE82', vein: '#0A2E20', block: '#FFFFFF', lines: '#0A2E20' }
    : { leaf: '#3DBE82', vein: '#0B5D3B', block: '#0B5D3B', lines: '#FFFFFF' },
)
</script>

<template>
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    :data-variant="variant"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
  >
    <path d="M32 32 C30 18 38 8 55 6 C56 21 47 30 32 32 Z" :fill="colors.leaf" />
    <path d="M33 31 L49 14" :stroke="colors.vein" stroke-width="2" stroke-linecap="round" />
    <rect x="8" y="34" width="48" height="24" rx="4" :fill="colors.block" />
    <path d="M8 46 H56 M32 34 V46 M20 46 V58 M44 46 V58" :stroke="colors.lines" stroke-width="2" />
  </svg>
</template>
