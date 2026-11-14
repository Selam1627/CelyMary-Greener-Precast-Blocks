import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ContactSection from '@/components/sections/ContactSection.vue'
import { contact } from '@/content/contact'
import { products } from '@/content/products'
import { sendContactMessage } from '@/utils/contactForm'

// Keep the real validation; only the request to the server is faked.
vi.mock('@/utils/contactForm', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/contactForm')>()),
  sendContactMessage: vi.fn(),
}))

const testAddress = 'contact@example.com'

/** The visible fields; the hidden spam trap is left out. */
const visibleFields = 'input:not(#contact-website), select, textarea'

/** Mounted on the page, because moving keyboard focus needs a real document. */
function mountForm() {
  return mount(ContactSection, { attachTo: document.body })
}

type Wrapper = ReturnType<typeof mountForm>

async function fillInRequiredFields(wrapper: Wrapper) {
  await wrapper.get('#contact-name').setValue('Test Visitor')
  await wrapper.get('#contact-email').setValue('visitor@example.com')
  await wrapper.get('#contact-visitor-type').setValue('Architect')
  await wrapper.get('#contact-message').setValue('Test message.')
}

/** Presses Send and waits until the (faked) server has answered. */
async function submit(wrapper: Wrapper) {
  await wrapper.get('form').trigger('submit')
  await flushPromises()
}

function optionsOf(wrapper: Wrapper, selector: string) {
  return wrapper.get(selector).findAll('option')
}

function statusText(wrapper: Wrapper) {
  return wrapper.get('[role="status"]').text()
}

function valueOf(wrapper: Wrapper, selector: string) {
  return (wrapper.get(selector).element as HTMLInputElement).value
}

beforeEach(() => {
  vi.stubEnv('VITE_CONTACT_EMAIL', testAddress)
  vi.mocked(sendContactMessage).mockReset().mockResolvedValue(true)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('ContactSection', () => {
  describe('normal cases', () => {
    it('can be reached at #contact and is labelled by the "Contact us" heading', () => {
      const wrapper = mountForm()
      const section = wrapper.get('section')

      expect(section.attributes('id')).toBe('contact')
      expect(wrapper.get(`#${section.attributes('aria-labelledby')}`).text()).toBe('Contact us')
    })

    it('has a label connected to every field', () => {
      const wrapper = mountForm()
      const fields = wrapper.findAll('input, select, textarea')

      // Five visible fields, plus the hidden spam trap.
      expect(fields).toHaveLength(6)
      for (const field of fields) {
        const label = wrapper.get(`label[for="${field.attributes('id')}"]`)
        expect(label.text()).not.toBe('')
      }
    })

    it('offers the seven visitor types', () => {
      const wrapper = mountForm()

      const choices = optionsOf(wrapper, '#contact-visitor-type')
        .slice(1)
        .map((option) => option.text())

      expect(choices).toEqual([
        'Architect',
        'Engineer',
        'Builder',
        'Real estate developer',
        'Investor',
        'Partner',
        'Other',
      ])
    })

    it('offers the five products, plus the choice of none', () => {
      const wrapper = mountForm()
      const [none, ...choices] = optionsOf(wrapper, '#contact-product')

      expect(none!.text()).toBe('No specific product')
      expect(none!.attributes('value')).toBe('')
      expect(choices.map((option) => option.text())).toEqual(
        products.items.map((product) => product.name),
      )
    })

    it('sends what the visitor wrote to the server once, with an empty spam trap', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-product').setValue('Paving blocks')

      await submit(wrapper)

      expect(sendContactMessage).toHaveBeenCalledTimes(1)
      expect(sendContactMessage).toHaveBeenCalledWith(
        {
          name: 'Test Visitor',
          email: 'visitor@example.com',
          visitorType: 'Architect',
          product: 'Paving blocks',
          message: 'Test message.',
        },
        { website: '', elapsedMs: expect.any(Number) },
      )
    })

    it('sends without a product, because it is optional', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)

      expect(sendContactMessage).toHaveBeenCalledTimes(1)
      expect(vi.mocked(sendContactMessage).mock.calls[0]![0].product).toBe('')
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('thanks the visitor and clears the form once the message is sent', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)

      expect(statusText(wrapper)).toBe(contact.successMessage)
      for (const selector of ['#contact-name', '#contact-email', '#contact-message']) {
        expect(valueOf(wrapper, selector)).toBe('')
      }
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('shows the address as a direct email link', () => {
      const wrapper = mountForm()
      const link = wrapper.get('form a')

      expect(link.attributes('href')).toBe(`mailto:${testAddress}`)
      expect(link.text()).toBe(testAddress)
      expect(link.element.parentElement!.textContent).toContain(
        `Or write to us directly at ${testAddress}`,
      )
    })
  })

  describe('expected errors', () => {
    it('shows no errors or status before the visitor presses Send', () => {
      const wrapper = mountForm()

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
      expect(statusText(wrapper)).toBe('')
    })

    it('shows a clear error for each required field and sends nothing', async () => {
      const wrapper = mountForm()

      await submit(wrapper)

      expect(wrapper.findAll('[role="alert"]').map((error) => error.text())).toEqual([
        'Please enter your name.',
        'Please enter your email address.',
        'Please select who you are.',
        'Please enter a message.',
      ])
      expect(sendContactMessage).not.toHaveBeenCalled()
    })

    it('shows an error for a badly formatted email and sends nothing', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-email').setValue('not-an-email')

      await submit(wrapper)

      expect(wrapper.get('#contact-email-error').text()).toBe(
        'Please enter a valid email address, for example name@example.com.',
      )
      expect(sendContactMessage).not.toHaveBeenCalled()
    })

    it('shows a clear error and keeps what the visitor wrote when sending fails', async () => {
      vi.mocked(sendContactMessage).mockResolvedValue(false)
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)

      expect(statusText(wrapper)).toBe(contact.failureMessage)
      expect(valueOf(wrapper, '#contact-message')).toBe('Test message.')
      expect(wrapper.get('form button').text()).toBe('Send message')
    })

    it('keeps the direct email link as a fallback when sending fails', async () => {
      vi.mocked(sendContactMessage).mockResolvedValue(false)
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)

      expect(wrapper.get('form a').attributes('href')).toBe(`mailto:${testAddress}`)
    })

    it('can try again after a failure, and then succeed', async () => {
      vi.mocked(sendContactMessage).mockResolvedValueOnce(false).mockResolvedValueOnce(true)
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)
      await submit(wrapper)

      expect(sendContactMessage).toHaveBeenCalledTimes(2)
      expect(statusText(wrapper)).toBe(contact.successMessage)
    })

    it.each([
      ['missing', undefined],
      ['empty', ''],
      ['only spaces', '   '],
    ])('hides the direct email line when the address is %s', (_case, address) => {
      vi.stubEnv('VITE_CONTACT_EMAIL', address as string)
      const wrapper = mountForm()

      expect(wrapper.find('form a').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Or write to us directly at')
    })
  })

  describe('edge cases', () => {
    it('shows "Sending…" and ignores extra presses while the message is on its way', async () => {
      let answer!: (sent: boolean) => void
      vi.mocked(sendContactMessage).mockReturnValue(
        new Promise<boolean>((resolve) => {
          answer = resolve
        }),
      )
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await wrapper.get('form').trigger('submit')
      const button = wrapper.get('form button')
      expect(button.text()).toBe('Sending…')
      expect(button.attributes('aria-disabled')).toBe('true')

      await wrapper.get('form').trigger('submit')
      expect(sendContactMessage).toHaveBeenCalledTimes(1)

      answer(true)
      await flushPromises()
      expect(button.text()).toBe('Send message')
      expect(button.attributes('aria-disabled')).toBeUndefined()
    })

    it('clears the previous result when the visitor sends again', async () => {
      vi.mocked(sendContactMessage).mockResolvedValueOnce(false)
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await submit(wrapper)

      await wrapper.get('#contact-name').setValue('')
      await submit(wrapper)

      expect(statusText(wrapper)).toBe('')
    })

    it('tells the server how long the form took to fill in', async () => {
      const now = vi.spyOn(Date, 'now').mockReturnValue(1_000)
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      now.mockReturnValue(9_500)
      await submit(wrapper)

      expect(vi.mocked(sendContactMessage).mock.calls[0]![1].elapsedMs).toBe(8_500)
    })

    it('hides the spam trap from people, keyboards, screen readers and autofill', () => {
      const wrapper = mountForm()
      const trap = wrapper.get('#contact-website')

      expect(trap.element.closest('[aria-hidden="true"]')).not.toBeNull()
      expect(trap.attributes('tabindex')).toBe('-1')
      expect(trap.attributes('autocomplete')).toBe('off')
      expect(trap.element.parentElement!.classList).toContain('absolute')
    })

    it('passes a filled-in spam trap to the server, which decides what to do', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-website').setValue('https://spam.example')

      await submit(wrapper)

      expect(vi.mocked(sendContactMessage).mock.calls[0]![1].website).toBe('https://spam.example')
    })

    it('moves keyboard focus to the first field with a problem', async () => {
      const wrapper = mountForm()
      await wrapper.get('#contact-name').setValue('Test Visitor')
      await wrapper.get('#contact-email').setValue('visitor@example.com')

      await submit(wrapper)

      expect(document.activeElement).toBe(wrapper.get('#contact-visitor-type').element)
    })

    it('connects each error to its field for screen readers', async () => {
      const wrapper = mountForm()

      await submit(wrapper)

      for (const id of [
        'contact-name',
        'contact-email',
        'contact-visitor-type',
        'contact-message',
      ]) {
        const field = wrapper.get(`#${id}`)
        expect(field.attributes('aria-invalid')).toBe('true')
        expect(field.attributes('aria-describedby')).toBe(`${id}-error`)
        expect(wrapper.find(`#${id}-error`).exists()).toBe(true)
      }
    })

    it('clears an error as soon as its field is fixed, leaving the others', async () => {
      const wrapper = mountForm()
      await submit(wrapper)

      await wrapper.get('#contact-name').setValue('Test Visitor')

      const name = wrapper.get('#contact-name')
      expect(wrapper.find('#contact-name-error').exists()).toBe(false)
      expect(name.attributes('aria-invalid')).toBeUndefined()
      expect(name.attributes('aria-describedby')).toBeUndefined()
      expect(wrapper.find('#contact-email-error').exists()).toBe(true)
    })

    it('updates the email error from "empty" to "invalid" while typing', async () => {
      const wrapper = mountForm()
      await submit(wrapper)

      await wrapper.get('#contact-email').setValue('name@')

      expect(wrapper.get('#contact-email-error').text()).toBe(contact.errors.emailInvalid)
    })

    it('does not show errors on other fields while the visitor types', async () => {
      const wrapper = mountForm()

      await wrapper.get('#contact-name').setValue('Test Visitor')
      await wrapper.get('#contact-email').setValue('name@')

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('rejects a message of only spaces', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-message').setValue('   ')

      await submit(wrapper)

      expect(wrapper.get('#contact-message-error').text()).toBe('Please enter a message.')
      expect(sendContactMessage).not.toHaveBeenCalled()
    })

    it('rejects a message that is too long', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-message').setValue('a'.repeat(5001))

      await submit(wrapper)

      expect(wrapper.get('#contact-message-error').text()).toBe(contact.errors.messageTooLong)
      expect(sendContactMessage).not.toHaveBeenCalled()
    })

    it('submits with a real button, so Enter and the keyboard work', () => {
      const wrapper = mountForm()
      const button = wrapper.get('form button')

      expect(button.attributes('type')).toBe('submit')
      expect(button.text()).toBe('Send message')
    })

    it('leaves the checking to the form, not the browser pop-ups', () => {
      expect(mountForm().get('form').attributes('novalidate')).toBeDefined()
    })

    it('marks only the required fields as required', () => {
      const wrapper = mountForm()

      for (const id of [
        'contact-name',
        'contact-email',
        'contact-visitor-type',
        'contact-message',
      ]) {
        expect(wrapper.get(`#${id}`).attributes('required')).toBeDefined()
      }
      expect(wrapper.get('#contact-product').attributes('required')).toBeUndefined()
      expect(wrapper.get('#contact-website').attributes('required')).toBeUndefined()
    })

    it('helps phones: email keyboard, autofill, and text large enough not to zoom', () => {
      const wrapper = mountForm()
      const email = wrapper.get('#contact-email')

      expect(email.attributes('type')).toBe('email')
      expect(email.attributes('autocomplete')).toBe('email')
      expect(wrapper.get('#contact-name').attributes('autocomplete')).toBe('name')
      for (const field of wrapper.findAll(visibleFields)) {
        expect(field.classes()).toContain('text-base')
        expect(field.classes()).toContain('min-h-11')
      }
    })

    it('does not let the visitor pick the visitor-type prompt as an answer', () => {
      const [prompt] = optionsOf(mountForm(), '#contact-visitor-type')

      expect(prompt!.text()).toBe('Select one')
      expect(prompt!.attributes('disabled')).toBeDefined()
    })
  })
})
