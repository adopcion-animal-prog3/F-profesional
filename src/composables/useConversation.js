import { ref, watch } from 'vue'
import { apiGetConversation, apiMarkConversationRead, apiSendMessage } from '../api/mensajes'
import { buildMessagePayload, validateMessage } from '../utils/mensajes'

// Hilo de mensajes con otra cuenta: carga, marca como leídos y envía respuestas.
export function useConversation(getUserId, getPetId) {
  const contact = ref(null)
  const messages = ref([])
  const isLoading = ref(true)
  const errorMessage = ref('')
  const sendError = ref('')
  const isSending = ref(false)

  const load = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const conversation = await apiGetConversation(getUserId())
      contact.value = conversation.usuario
      messages.value = conversation.mensajes
      await apiMarkConversationRead(getUserId())
    } catch (error) {
      errorMessage.value = error.message || 'No se pudo cargar la conversación.'
    } finally {
      isLoading.value = false
    }
  }

  const send = async (content) => {
    sendError.value = validateMessage(content)
    if (sendError.value || isSending.value) return false

    isSending.value = true
    try {
      const payload = buildMessagePayload({ recipientId: getUserId(), petId: getPetId(), content })
      messages.value = [...messages.value, await apiSendMessage(payload)]
      return true
    } catch (error) {
      sendError.value = error.message || 'No se pudo enviar el mensaje.'
      return false
    } finally {
      isSending.value = false
    }
  }

  watch(getUserId, load, { immediate: true })

  return { contact, messages, isLoading, errorMessage, sendError, isSending, load, send }
}
