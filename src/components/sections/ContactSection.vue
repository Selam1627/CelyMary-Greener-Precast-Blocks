<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'

import { contact } from '@/content/contact'
import { products } from '@/content/products'
import {
  requiredFields,
  sendContactMessage,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
  type RequiredField,
} from '@/utils/contactForm'

const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim()

const fieldClass =
  'mt-1 block min-h-11 w-full rounded-md border border-stone-500 bg-white px-3 py-2 text-base text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 aria-invalid:border-red-700'
const labelClass = 'block font-medium text-stone-800'
const errorClass = 'mt-1 text-sm font-medium text-red-700'

const fieldIds: Record<RequiredField, string> = {
  name: 'contact-name',
  email: 'contact-email',
  visitorType: 'contact-visitor-type',
  message: 'contact-message',
}

function emptyValues(): ContactFormValues {
  return { name: '', email: '', visitorType: '', product: '', message: '' }
}

const values = reactive<ContactFormValues>(emptyValues())
const errors = ref<ContactFormErrors>({})

type SendStatus = 'idle' | 'sending' | 'sent' | 'failed'
const status = ref<SendStatus>('idle')

// Spam checks: a hidden field that only bots fill in, and how long the form
// took to fill in. The server decides what to do with them.
const spamTrap = ref('')
let shownAt = Date.now()

// Once an error is showing, keep it up to date as the visitor fixes the field.
// Fields without an error stay quiet until the next time Send is pressed.
watch(values, () => {
  const current = validateContactForm(values)
  const updated: ContactFormErrors = {}
  for (const field of requiredFields) {
    if (errors.value[field] && current[field]) {
      updated[field] = current[field]
    }
  }
  errors.value = updated
})

async function handleSubmit() {
  // The button stays focusable while sending, so ignore extra presses.
  if (status.value === 'sending') return

  errors.value = validateContactForm(values)
  status.value = 'idle'

  const firstInvalid = requiredFields.find((field) => errors.value[field])
  if (firstInvalid) {
    await nextTick()
    document.getElementById(fieldIds[firstInvalid])?.focus()
    return
  }

  status.value = 'sending'
  const sent = await sendContactMessage(
    { ...values },
    { website: spamTrap.value, elapsedMs: Date.now() - shownAt },
  )

  if (sent) {
    status.value = 'sent'
    Object.assign(values, emptyValues())
    spamTrap.value = ''
    shownAt = Date.now()
  } else {
    // Keep what the visitor wrote so they can try again.
    status.value = 'failed'
  }
}
</script>

<template>
  <section id="contact" aria-labelledby="contact-heading" class="bg-stone-50 px-4 py-16 sm:py-24">
    <div class="mx-auto max-w-xl">
      <h2
        id="contact-heading"
        class="text-center text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl"
      >
        {{ contact.heading }}
      </h2>

      <form class="relative mt-10 flex flex-col gap-5" novalidate @submit.prevent="handleSubmit">
        <div>
          <label :for="fieldIds.name" :class="labelClass">{{ contact.labels.name }}</label>
          <input
            :id="fieldIds.name"
            v-model="values.name"
            type="text"
            name="name"
            autocomplete="name"
            required
            :class="fieldClass"
            :aria-invalid="errors.name ? 'true' : undefined"
            :aria-describedby="errors.name ? `${fieldIds.name}-error` : undefined"
          />
          <p v-if="errors.name" :id="`${fieldIds.name}-error`" role="alert" :class="errorClass">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label :for="fieldIds.email" :class="labelClass">{{ contact.labels.email }}</label>
          <input
            :id="fieldIds.email"
            v-model="values.email"
            type="email"
            name="email"
            autocomplete="email"
            required
            :class="fieldClass"
            :aria-invalid="errors.email ? 'true' : undefined"
            :aria-describedby="errors.email ? `${fieldIds.email}-error` : undefined"
          />
          <p v-if="errors.email" :id="`${fieldIds.email}-error`" role="alert" :class="errorClass">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label :for="fieldIds.visitorType" :class="labelClass">
            {{ contact.labels.visitorType }}
          </label>
          <select
            :id="fieldIds.visitorType"
            v-model="values.visitorType"
            name="visitorType"
            required
            :class="fieldClass"
            :aria-invalid="errors.visitorType ? 'true' : undefined"
            :aria-describedby="errors.visitorType ? `${fieldIds.visitorType}-error` : undefined"
          >
            <option value="" disabled>{{ contact.visitorTypePrompt }}</option>
            <option v-for="type in contact.visitorTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <p
            v-if="errors.visitorType"
            :id="`${fieldIds.visitorType}-error`"
            role="alert"
            :class="errorClass"
          >
            {{ errors.visitorType }}
          </p>
        </div>

        <div>
          <label for="contact-product" :class="labelClass">{{ contact.labels.product }}</label>
          <select id="contact-product" v-model="values.product" name="product" :class="fieldClass">
            <option value="">{{ contact.productPrompt }}</option>
            <option v-for="product in products.items" :key="product.id" :value="product.name">
              {{ product.name }}
            </option>
          </select>
        </div>

        <div>
          <label :for="fieldIds.message" :class="labelClass">{{ contact.labels.message }}</label>
          <textarea
            :id="fieldIds.message"
            v-model="values.message"
            name="message"
            rows="5"
            required
            :class="fieldClass"
            :aria-invalid="errors.message ? 'true' : undefined"
            :aria-describedby="errors.message ? `${fieldIds.message}-error` : undefined"
          ></textarea>
          <p
            v-if="errors.message"
            :id="`${fieldIds.message}-error`"
            role="alert"
            :class="errorClass"
          >
            {{ errors.message }}
          </p>
        </div>

        <!-- Spam trap: hidden from people and screen readers, filled in by many bots. -->
        <div aria-hidden="true" class="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label for="contact-website">{{ contact.spamTrapLabel }}</label>
          <input
            id="contact-website"
            v-model="spamTrap"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <div>
          <button
            type="submit"
            :aria-disabled="status === 'sending' ? 'true' : undefined"
            class="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 aria-disabled:cursor-wait aria-disabled:opacity-75 sm:w-auto"
          >
            {{ status === 'sending' ? contact.sendingLabel : contact.submitLabel }}
          </button>
          <div role="status">
            <p v-if="status === 'sent'" class="mt-3 font-medium text-emerald-800">
              {{ contact.successMessage }}
            </p>
            <p v-else-if="status === 'failed'" class="mt-3 font-medium text-red-700">
              {{ contact.failureMessage }}
            </p>
          </div>
          <p v-if="contactEmail" class="mt-4 text-stone-700">
            {{ contact.directContactPrefix }}
            <a
              :href="`mailto:${contactEmail}`"
              class="font-medium wrap-anywhere text-emerald-800 underline hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >{{ contactEmail }}</a
            >
          </p>
        </div>
      </form>
    </div>
  </section>
</template>
