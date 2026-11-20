<template>
  <section class="messages-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Comunicación</p>
        <h1>Mensajes</h1>
      </div>
      <button class="primary-button small-button" type="button" :disabled="isLoading" @click="load">
        {{ isLoading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <p class="empty-hint">
      Los adoptantes te escriben desde el portal de adopción. También podés iniciar una conversación
      desde una solicitud de adopción.
    </p>

    <ResourceStatus
      :is-loading="isLoading"
      :has-loaded="hasLoadedSuccessfully"
      :error-message="errorMessage"
      :is-empty="conversations.length === 0"
      resource-name="mensajes"
      error-title="No se pudieron cargar los mensajes"
      refresh-error-prefix="No se pudieron actualizar los mensajes"
      empty-title="Sin conversaciones"
      empty-text="Todavía no recibiste ni enviaste mensajes."
      @retry="load"
    />

    <div v-if="conversations.length > 0" class="conversation-list">
      <ConversationListItem
        v-for="conversation in conversations"
        :key="conversation.usuario.id"
        :conversation="conversation"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { apiGetConversations } from '../api/mensajes'
import ConversationListItem from '../components/ConversationListItem.vue'
import ResourceStatus from '../components/ResourceStatus.vue'
import { useResourceList } from '../composables/useResourceList'

const {
  items: conversations,
  isLoading,
  hasLoadedSuccessfully,
  errorMessage,
  load
} = useResourceList(apiGetConversations, { fallbackError: 'No se pudieron cargar los mensajes.' })

onMounted(load)
</script>
