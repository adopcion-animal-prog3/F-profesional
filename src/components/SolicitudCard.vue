<template>
  <article class="solicitud-card">
    <div class="solicitud-main">
      <div class="solicitud-heading">
        <div>
          <p class="solicitud-id">Solicitud #{{ solicitud.id }}</p>
          <h2>{{ solicitud.mascotaName }}</h2>
        </div>
        <span class="status-tag" :class="getStatusClass(solicitud.estado)">
          {{ solicitud.estado }}
        </span>
      </div>

      <dl class="solicitud-meta">
        <div>
          <dt>Adoptante</dt>
          <dd>{{ solicitud.adoptanteName }}</dd>
        </div>
        <div>
          <dt>Fecha de creación</dt>
          <dd>{{ formatDateTime(solicitud.fechaCreacion, 'No disponible') }}</dd>
        </div>
      </dl>
    </div>

    <p v-if="solicitud.mensaje" class="solicitud-message">
      {{ solicitud.mensaje }}
    </p>

    <router-link
      v-if="solicitud.usuarioId"
      class="secondary-button small-button"
      :to="{ name: 'conversacion', params: { usuarioId: solicitud.usuarioId }, query: { mascotaId: solicitud.mascotaId } }"
    >
      Enviar mensaje al adoptante
    </router-link>

    <div v-if="isAdmin" class="solicitud-admin">
      <label :for="`estado-${solicitud.id}`">Cambiar estado</label>
      <div class="solicitud-admin-controls">
        <select
          :id="`estado-${solicitud.id}`"
          v-model="solicitud.estadoSeleccionado"
          :disabled="isBusy"
        >
          <option v-for="estado in SOLICITUD_STATES" :key="estado" :value="estado">{{ estado }}</option>
        </select>
        <button
          class="secondary-button small-button"
          type="button"
          :disabled="isBusy || solicitud.estadoSeleccionado === solicitud.estado"
          @click="$emit('save', solicitud)"
        >
          {{ isSaving ? 'Guardando...' : 'Guardar estado' }}
        </button>
      </div>
      <p v-if="errorMessage" class="status-update-error" role="alert">
        {{ errorMessage }}
      </p>
    </div>
  </article>
</template>

<script setup>
import { formatDateTime } from '../utils/date'
import { getStatusClass } from '../utils/petDisplay'
import { SOLICITUD_STATES } from '../utils/solicitudes'

defineProps({
  solicitud: { type: Object, required: true },
  isAdmin: { type: Boolean, default: false },
  isBusy: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})

defineEmits(['save'])
</script>
