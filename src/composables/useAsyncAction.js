import { ref } from 'vue'
import { runWithSuccessMessage } from '../utils/successMessage'

// Ejecuta una operación con estado "en curso", mensaje de éxito y mensaje de error.
export function useAsyncAction() {
  const isRunning = ref(false)
  const errorMessage = ref('')

  const run = async ({ operation, successMessage, fallbackError }) => {
    if (isRunning.value) return false

    isRunning.value = true
    errorMessage.value = ''

    try {
      await runWithSuccessMessage(operation, successMessage)
      return true
    } catch (error) {
      errorMessage.value = error.message || fallbackError
      return false
    } finally {
      isRunning.value = false
    }
  }

  return { isRunning, errorMessage, run }
}
