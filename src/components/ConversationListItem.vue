<template>
  <router-link
    class="conversation-item"
    :to="{ name: 'conversacion', params: { usuarioId: conversation.usuario.id } }"
  >
    <div class="conversation-heading">
      <strong>{{ conversation.usuario.nombre }}</strong>
      <span class="conversation-role">{{ ROLE_LABELS[conversation.usuario.rol] || conversation.usuario.rol }}</span>
      <span
        v-if="conversation.no_leidos > 0"
        class="conversation-badge"
        :aria-label="`${conversation.no_leidos} sin leer`"
      >
        {{ conversation.no_leidos }}
      </span>
    </div>
    <p class="conversation-preview">{{ conversation.ultimo_mensaje.contenido }}</p>
    <small>{{ formatMessageDate(conversation.ultimo_mensaje.created_at) }}</small>
  </router-link>
</template>

<script setup>
import { formatMessageDate, ROLE_LABELS } from '../utils/mensajes'

defineProps({
  conversation: { type: Object, required: true }
})
</script>
