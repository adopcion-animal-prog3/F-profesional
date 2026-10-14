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
        {{ isLoading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <div v-if="isLoading" class="state-block loading-state">
      <div class="spinner" aria-label="Cargando solicitudes"></div>
      <p>Cargando solicitudes...</p>
    </div>

    <div v-else-if="errorMessage" class="state-block error-state">
      <h2>No se pudieron cargar las solicitudes</h2>
      <p>{{ errorMessage }}</p>
      <button class="primary-button small-button" type="button" @click="loadSolicitudes">
        Reintentar
      </button>
    </div>

    <div v-else-if="createdMessage" class="state-block success-state" role="status">
      <h2>Solicitud creada correctamente</h2>
      <p>{{ createdMessage }}</p>
      <button class="secondary-button small-button" type="button" @click="createdMessage = ''">
        Cerrar
      </button>
    </div>

    <div v-else-if="solicitudes.length === 0" class="state-block empty-state">
      <h2>No hay solicitudes</h2>
      <p>No se han recibido solicitudes de adopción.</p>
    </div>

    <div v-else class="solicitudes-list">
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
            v-if="feedbackSolicitudId === solicitid.id && statusUpdateMessage"
            class="status-update-success"
            role="status"
          >
            {{ statusUpdateMessage }}
          </p>
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
import { useRoute } from 'vue-router'
import { apiGetSolicitudes, apiUpdateSolicitudStatus } from '../api/http'
import { getStoredUser } from '../auth/session'

const route = useRoute()
const solicitudes = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const updatingSolicitudId = ref(null)
const feedbackSolicitudId = ref(null)
const statusUpdateMessage = ref('')
const statusUpdateError = ref('')
const isAdmin = computed(() =>
  String(getStoredUser()?.role || '').trim().toUpperCase() === 'ADMIN'
)
const createdMessage = ref(route.state?.created
  ? `La solicitud para ${route.state.petName} se creó correctamente.`
  : '')

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
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await apiGetSolicitudes()
    const items = Array.isArray(result?.data) ? result.data : []
    solicitudes.value = items.map(normalizeSolicitud)
  } catch (error) {
    solicitudes.value = []
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
  statusUpdateMessage.value = ''
  statusUpdateError.value = ''

  try {
    await apiUpdateSolicitudStatus(solicitud.id, estado)
    solicitud.estado = estado
    solicitud.estadoSeleccionado = estado
    statusUpdateMessage.value = 'Estado actualizado correctamente.'
  } catch (error) {
    statusUpdateError.value = error.message || 'No se pudo actualizar el estado.'
  } finally {
    updatingSolicitudId.value = null
  }
}

onMounted(loadSolicitudes)
</script>
