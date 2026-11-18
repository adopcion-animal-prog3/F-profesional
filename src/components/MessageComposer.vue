<template>
  <form class="message-composer" novalidate @submit.prevent="handleSubmit">
    <label for="message-content">Nuevo mensaje</label>
    <textarea
      id="message-content"
      v-model="content"
      rows="3"
      :maxlength="MAX_MESSAGE_LENGTH"
      :disabled="isSending"
    ></textarea>
    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
    <button class="primary-button" type="submit" :disabled="isSending">
      {{ isSending ? 'Enviando...' : 'Enviar mensaje' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { MAX_MESSAGE_LENGTH } from '../utils/mensajes'

const props = defineProps({
  send: { type: Function, required: true },
  isSending: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})

const content = ref('')

const handleSubmit = async () => {
  if (await props.send(content.value)) content.value = ''
}
</script>
