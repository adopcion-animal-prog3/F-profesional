<template>
  <p v-if="messages.length === 0" class="empty-hint" role="status">
    Todavía no hay mensajes. Escribí el primero.
  </p>
  <ol v-else class="message-thread" aria-label="Mensajes de la conversación">
    <li
      v-for="message in messages"
      :key="message.id"
      class="message"
      :class="isOwnMessage(message, userId) ? 'message-own' : 'message-received'"
    >
      <p>{{ message.contenido }}</p>
      <small>
        {{ isOwnMessage(message, userId) ? 'Vos' : 'Recibido' }} · {{ formatMessageDate(message.created_at) }}
      </small>
    </li>
  </ol>
</template>

<script setup>
import { formatMessageDate, isOwnMessage } from '../utils/mensajes'

defineProps({
  messages: { type: Array, required: true },
  userId: { type: [Number, String], default: null }
})
</script>
