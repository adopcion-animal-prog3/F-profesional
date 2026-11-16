<template>
  <section class="solicitudes-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Adopciones</p>
        <h1>Solicitudes de adopción</h1>
      </div>

      <button class="primary-button small-button" type="button" @click="load" :disabled="isLoading">
        {{ isLoading ? (hasLoadedSuccessfully ? 'Actualizando...' : 'Cargando...') : 'Actualizar' }}
      </button>
    </div>

    <ResourceStatus
      :is-loading="isLoading"
      :has-loaded="hasLoadedSuccessfully"
      :error-message="errorMessage"
      :is-empty="solicitudes.length === 0"
      resource-name="solicitudes"
      error-title="No se pudieron cargar las solicitudes"
      refresh-error-prefix="No se pudieron actualizar las solicitudes"
      empty-title="No hay solicitudes"
      empty-text="No se han recibido solicitudes de adopción."
      @retry="load"
    />

    <div v-if="solicitudes.length > 0" class="solicitudes-list">
      <SolicitudCard
        v-for="solicitud in solicitudes"
        :key="solicitud.id"
        :solicitud="solicitud"
        :is-admin="isAdmin"
        :is-busy="updatingSolicitudId !== null"
        :is-saving="updatingSolicitudId === solicitud.id"
        :error-message="feedbackSolicitudId === solicitud.id ? statusUpdateError : ''"
        @save="updateSolicitudStatus"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { apiGetSolicitudes, apiUpdateSolicitudStatus } from '../api/http'
import { getStoredUser } from '../auth/session'
import ResourceStatus from '../components/ResourceStatus.vue'
import SolicitudCard from '../components/SolicitudCard.vue'
import { useAsyncAction } from '../composables/useAsyncAction'
import { useResourceList } from '../composables/useResourceList'
import { isAdminUser, normalizeSolicitud } from '../utils/solicitudes'

const {
  items: solicitudes,
  isLoading,
  hasLoadedSuccessfully,
  errorMessage,
  load
} = useResourceList(apiGetSolicitudes, {
  normalize: normalizeSolicitud,
  fallbackError: 'No se pudieron cargar las solicitudes.'
})

const isAdmin = computed(() => isAdminUser(getStoredUser()))
const updatingSolicitudId = ref(null)
const feedbackSolicitudId = ref(null)
const { errorMessage: statusUpdateError, run } = useAsyncAction()

const updateSolicitudStatus = async (solicitud) => {
  const estado = solicitud.estadoSeleccionado
  if (!isAdmin.value || updatingSolicitudId.value !== null || estado === solicitud.estado) return

  updatingSolicitudId.value = solicitud.id
  feedbackSolicitudId.value = solicitud.id

  const updated = await run({
    operation: () => apiUpdateSolicitudStatus(solicitud.id, estado),
    successMessage: 'Estado de la solicitud actualizado correctamente.',
    fallbackError: 'No se pudo actualizar el estado.'
  })

  if (updated) solicitud.estado = estado
  updatingSolicitudId.value = null
}

onMounted(load)
</script>
