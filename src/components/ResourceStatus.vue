<template>
  <div v-if="isLoading && !hasLoaded" class="state-block loading-state" aria-live="polite">
    <div class="spinner" :aria-label="`Cargando ${resourceName}`"></div>
    <p>Cargando {{ resourceName }}...</p>
  </div>

  <div v-else-if="errorMessage && !hasLoaded" class="state-block error-state" role="alert">
    <component :is="headingTag">{{ errorTitle }}</component>
    <p>{{ errorMessage }}</p>
    <button class="primary-button small-button" type="button" @click="$emit('retry')">
      Reintentar
    </button>
  </div>

  <p v-if="isLoading && hasLoaded" class="loading-inline" role="status">
    <span class="spinner" aria-hidden="true"></span>
    Actualizando {{ resourceName }}...
  </p>

  <p v-if="errorMessage && hasLoaded" class="error-message" role="alert">
    {{ refreshErrorPrefix }}: {{ errorMessage }}
  </p>

  <div v-if="hasLoaded && isEmpty" class="state-block empty-state">
    <EmptyIllustration />
    <component :is="headingTag">{{ emptyTitle }}</component>
    <p>{{ emptyText }}</p>
  </div>
</template>

<script setup>
import EmptyIllustration from './brand/EmptyIllustration.vue'

defineProps({
  isLoading: { type: Boolean, default: false },
  hasLoaded: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  isEmpty: { type: Boolean, default: false },
  resourceName: { type: String, required: true },
  errorTitle: { type: String, required: true },
  refreshErrorPrefix: { type: String, required: true },
  emptyTitle: { type: String, required: true },
  emptyText: { type: String, required: true },
  headingTag: { type: String, default: 'h2' }
})

defineEmits(['retry'])
</script>
