<script setup lang="ts">
import { computed } from 'vue'

export interface TextLink {
  text: string
  /** Without an address, the text is shown without a link. */
  href?: string
}

const props = defineProps<{
  /** A translated sentence with placeholders such as "{email}". */
  text: string
  /** The link for each placeholder, by name. */
  links: Record<string, TextLink>
}>()

// Word order differs between languages, so each translation decides where
// the link goes in its sentence.
const parts = computed(() =>
  props.text
    .split(/(\{\w+\})/)
    .filter((part) => part !== '')
    .map((part) => {
      const name = /^\{(\w+)\}$/.exec(part)?.[1]
      const link = name === undefined ? undefined : props.links[name]
      return link ? { link } : { text: part }
    }),
)
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <a
      v-if="part.link?.href"
      :href="part.link.href"
      class="font-medium wrap-anywhere underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      >{{ part.link.text }}</a
    ><template v-else-if="part.link">{{ part.link.text }}</template
    ><template v-else>{{ part.text }}</template>
  </template>
</template>
