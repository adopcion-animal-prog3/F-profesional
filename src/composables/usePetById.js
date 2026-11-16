import { ref, watch } from 'vue'
import { apiGetPetById } from '../api/http'

// Carga una mascota por ID cada vez que cambia el ID observado.
export function usePetById(getPetId, { onLoaded, fallbackError }) {
  const isLoading = ref(true)
  const notFound = ref(false)
  const errorMessage = ref('')

  const load = async () => {
    isLoading.value = true
    notFound.value = false
    errorMessage.value = ''

    try {
      const result = await apiGetPetById(getPetId())

      if (result?.notFound || !result?.data) {
        notFound.value = true
        return
      }

      onLoaded(result.data)
    } catch (error) {
      errorMessage.value = error.message || fallbackError
    } finally {
      isLoading.value = false
    }
  }

  watch(getPetId, load, { immediate: true })

  return { isLoading, notFound, errorMessage, load }
}
