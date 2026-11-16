import { ref } from 'vue'

// Estado de un listado: primera carga, actualizaciones posteriores y errores.
export function useResourceList(fetchItems, { normalize = (item) => item, fallbackError }) {
  const items = ref([])
  const isLoading = ref(false)
  const hasLoadedSuccessfully = ref(false)
  const errorMessage = ref('')
  const source = ref('api')

  const load = async () => {
    if (isLoading.value) return

    isLoading.value = true
    errorMessage.value = ''

    try {
      const result = await fetchItems()
      const data = Array.isArray(result?.data) ? result.data : []

      items.value = data.map(normalize)
      source.value = result?.source || 'api'
      hasLoadedSuccessfully.value = true
    } catch (error) {
      errorMessage.value = error.message || fallbackError
    } finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, hasLoadedSuccessfully, errorMessage, source, load }
}
