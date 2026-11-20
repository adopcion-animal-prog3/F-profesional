import apiClient from './http'

const conversationPath = (userId) => `/api/mensajes/conversaciones/${encodeURIComponent(userId)}`
const unwrap = (response) => response?.data?.data

export const apiGetConversations = async () => {
  const conversations = unwrap(await apiClient.get('/api/mensajes/conversaciones'))
  return { source: 'api', data: Array.isArray(conversations) ? conversations : [] }
}

export const apiGetConversation = async (userId) => {
  const conversation = unwrap(await apiClient.get(conversationPath(userId)))
  if (!Array.isArray(conversation?.mensajes)) {
    throw new Error('La API devolvió la conversación con un formato inválido.')
  }
  return conversation
}

export const apiMarkConversationRead = (userId) => apiClient.put(`${conversationPath(userId)}/leidos`)

export const apiSendMessage = async (payload) => unwrap(await apiClient.post('/api/mensajes', payload))
