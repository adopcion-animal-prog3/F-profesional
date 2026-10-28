<template>
  <section class="solicitudes-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Adopciones</p>
        <h1>Solicitudes de adopción</h1>
      </div>

      <button
        class="primary-button small-button"
        type="button"
        @click="loadSolicitudes"
        :disabled="isLoading"
      >
        {{ isLoading ? (hasLoadedSuccessfully ? 'Actualizando...' : 'Cargando...') : 'Actualizar' }}
      </button>
    </div>

    <div v-if="isLoading && !hasLoadedSuccessfully" class="state-block loading-state">
      <div class="spinner" aria-label="Cargando solicitudes"></div>
      <p>Cargando solicitudes...</p>
    </div>

    <div v-else-if="errorMessage && !hasLoadedSuccessfully" class="state-block error-state">
      <h2>No se pudieron cargar las solicitudes</h2>
      <p>{{ errorMessage }}</p>
      <button class="primary-button small-button" type="button" @click="loadSolicitudes">
        Reintentar
      </button>
    </div>

    <p v-if="isLoading && hasLoadedSuccessfully" class="loading-inline" role="status">
      <span class="spinner" aria-hidden="true"></span>
      Actualizando solicitudes...
    </p>

    <p v-if="errorMessage && hasLoadedSuccessfully" class="error-message" role="alert">
      No se pudieron actualizar las solicitudes: {{ errorMessage }}
    </p>
    <div v-if="hasLoadedSuccessfully && solicitudes.length === 0" class="state-block empty-state">
      <h2>No hay solicitudes</h2>
      <p>No se han recibido solicitudes de adopción.</p>
    </div>

    <div v-if="solicitudes.length > 0" class="solicitudes-list">
      <article v-for="solicitid in solicitudes" :key="solicitid.id" class="solicitud-card">
        <div class="solicitud-main">
          <div class="solicitud-heading">
            <div>
              <p class="solicitud-id">Solicitud #{{ solicitid.id }}</p>
              <h2>{{ solicitid.mascotaName }}</h2>
            </div>
            <span class="status-tag" :class="getStatusClass(solicitid.estado)">
              {{ solicitid.estado }}
            </span>
          </div>

          <dl class="solicitud-meta">
            <div>
              <dt>Adoptante</dt>
              <dd>{{ solicitid.adoptanteName }}</dd>
            </div>
            <div>
              <dt>Fecha de creación</dt>
              <dd>{{ formatDate(solicitid.fechaCreacion) }}</dd>
            </div>
          </dl>
        </div>

        <p v-if="solicitid.mensaje" class="solicitud-message">
          {{ solicitid.mensaje }}
        </p>

        <div v-if="isAdmin" class="solicitud-admin">
          <label :for="`estado-${solicitid.id}`">Cambiar estado</label>
          <div class="solicitud-admin-controls">
            <select
              :id="`estado-${solicitid.id}`"
              v-model="solicitid.estadoSeleccionado"
              :disabled="updatingSolicitudId !== null"
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="APROBADA">APROBADA</option>
              <option value="RECHAZADA">RECHAZADA</option>
            </select>
            <button
              class="secondary-button small-button"
              type="button"
              :disabled="updatingSolicitudId !== null || solicitid.estadoSeleccionado === solicitid.estado"
              @click="updateSolicitudStatus(solicitid)"
            >
              {{ updatingSolicitudId === solicitid.id ? 'Guardando...' : 'Guardar estado' }}
            </button>
          </div>
          <p
            v-if="feedbackSolicitudId === solicitid.id && statusUpdateError"
            class="status-update-error"
            role="alert"
          >
            {{ statusUpdateError }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { apiGetSolicitudes, apiUpdateSolicitudStatus } from '../api/http'
import { getStoredUser } from '../auth/session'
import { runWithSuccessMessage } from '../utils/successMessage'

const solicitudes = ref([])
const isLoading = ref(false)
const hasLoadedSuccessfully = ref(false)
const errorMessage = ref('')
const updatingSolicitudId = ref(null)
const feedbackSolicitudId = ref(null)
const statusUpdateError = ref('')
const isAdmin = computed(() =>
  String(getStoredUser()?.role || '').trim().toUpperCase() === 'ADMIN'
)
const normalizeSolicitud = (solicitid, index) => {
  const mascota = solicitid.mascota || solicitid.pet || solicitid.data?.mascota || {}
  const adoptante = solicitid.adoptante || solicitid.usuario || solicitid.user || {}
  const estado = solicitid.estado || solicitid.status || solicitid.estadoSolicitud || 'PENDIENTE'

  return {
    id: solicitid.id ?? solicitid._id ?? index + 1,
    mascotaName: mascota.name || mascota.nombre || 'Mascota no especificada',
    adoptanteName:
      adoptante.name ||
      adoptante.nombre ||
      adoptante.email ||
      adoptante.correo ||
      'Adoptante no especificado',
    estado,
    estadoSeleccionado: estado,
    fechaCreacion:
      solicitid.fechaCreacion ||
      solicitid.fecha_creacion ||
      solicitid.createdAt ||
      solicitid.fecha,
    mensaje: solicitid.mensaje || solicitid.descripcion || solicitid.notes || ''
  }
}

const getStatusClass = (status = '') =>
  String(status)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

const formatDate = (value) => {
  if (!value) return 'No disponible'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

const loadSolicitudes = async () => {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await apiGetSolicitudes()
    const items = Array.isArray(result?.data) ? result.data : []
    solicitudes.value = items.map(normalizeSolicitud)
    hasLoadedSuccessfully.value = true
  } catch (error) {
    errorMessage.value = error.message || 'No se pudieron cargar las solicitudes.'
  } finally {
    isLoading.value = false
  }
}

const updateSolicitudStatus = async (solicitud) => {
  if (!isAdmin.value || updatingSolicitudId.value !== null) return

  const estado = solicitud.estadoSeleccionado
  if (estado === solicitud.estado) return

  updatingSolicitudId.value = solicitud.id
  feedbackSolicitudId.value = solicitud.id
  statusUpdateError.value = ''

  try {
    await runWithSuccessMessage(
      () => apiUpdateSolicitudStatus(solicitud.id, estado),
      'Estado de la solicitud actualizado correctamente.'
    )
    solicitud.estado = estado
    solicitud.estadoSeleccionado = estado
  } catch (error) {
    statusUpdateError.value = error.message || 'No se pudo actualizar el estado.'
  } finally {
    updatingSolicitudId.value = null
  }
}

onMounted(loadSolicitudes)
</script>
