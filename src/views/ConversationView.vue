<template>
  <section class="conversation-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Mensajes</p>
        <h1>{{ contact ? `Conversación con ${contact.nombre}` : 'Conversación' }}</h1>
      </div>
      <router-link class="primary-button small-button" :to="{ name: 'mensajes' }">Volver a mensajes</router-link>
    </div>

    <p v-if="isLoading" class="empty-hint" role="status">Cargando conversación...</p>
    <div v-else-if="errorMessage" class="error-message" role="alert">
      {{ errorMessage }}
      <button class="secondary-button small-button" type="button" @click="load">Reintentar</button>
    </div>
    <div v-else class="conversation-panel">
      <MessageThread :messages="messages" :user-id="currentUser?.id" />
      <MessageComposer :send="send" :is-sending="isSending" :error-message="sendError" />
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { getStoredUser } from '../auth/session'
import MessageComposer from '../components/MessageComposer.vue'
import MessageThread from '../components/MessageThread.vue'
import { useConversation } from '../composables/useConversation'

const route = useRoute()
const currentUser = getStoredUser()

const { contact, messages, isLoading, errorMessage, sendError, isSending, load, send } = useConversation(
  () => route.params.usuarioId,
  () => route.query.mascotaId
)
</script>
