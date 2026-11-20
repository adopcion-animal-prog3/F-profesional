export const MAX_MESSAGE_LENGTH = 2000

export const ROLE_LABELS = { ADMIN: 'Profesional', ADOPTANTE: 'Adoptante' }

export const validateMessage = (content) => {
  const text = String(content ?? '').trim()
  if (!text) return 'Escribí un mensaje antes de enviarlo.'
  if (text.length > MAX_MESSAGE_LENGTH) return `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres.`
  return ''
}

const positiveIdOrNull = (value) => {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export const buildMessagePayload = ({ recipientId, petId, content }) => {
  const destinatario = positiveIdOrNull(recipientId)
  if (!destinatario) throw new Error('El destinatario del mensaje no es válido.')
  return {
    destinatario_id: destinatario,
    mascota_id: positiveIdOrNull(petId),
    contenido: String(content).trim()
  }
}

export const isOwnMessage = (message, userId) => String(message?.remitente_id) === String(userId)

export const formatMessageDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}
