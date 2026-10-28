import { ref } from 'vue'

export const SUCCESS_MESSAGE_DURATION = 4000
export const successMessage = ref('')

let dismissalTimeout = null

export const clearSuccessMessage = () => {
  if (dismissalTimeout !== null) {
    clearTimeout(dismissalTimeout)
    dismissalTimeout = null
  }

  successMessage.value = ''
}

export const showSuccessMessage = (message) => {
  if (typeof message !== 'string' || !message.trim()) {
    throw new TypeError('El mensaje de éxito debe ser un texto no vacío.')
  }

  clearSuccessMessage()
  successMessage.value = message
  dismissalTimeout = setTimeout(clearSuccessMessage, SUCCESS_MESSAGE_DURATION)
}

export const runWithSuccessMessage = async (operation, message) => {
  const result = await operation()
  showSuccessMessage(message)
  return result
}
