import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Closes a pop-up (a dropdown or the phone menu) when the visitor taps
 * anywhere else on the page, or moves keyboard focus out of it with Tab.
 * Bind the returned onFocusOut to the pop-up's outer element.
 */
export function useDismiss(
  root: Readonly<Ref<HTMLElement | null>>,
  isOpen: () => boolean,
  close: () => void,
) {
  function onDocumentPointerDown(event: PointerEvent) {
    if (isOpen() && !root.value?.contains(event.target as Node)) close()
  }

  function onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (next && !root.value?.contains(next)) close()
  }

  onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))

  return { onFocusOut }
}
