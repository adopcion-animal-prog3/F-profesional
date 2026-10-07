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

    <div v-else-if="solicitudes.length === 0" class="state-block empty-state">
      <h2>No hay solicitudes</h2>
      <p>No se han recibido solicitudes de adopción.</p>
    </div>

    <div v-else class="solicitudes-list">
      <article v-for="solicitud in solicitudes" :key="solicitud.id" class="solicitud-card">
        <div class="solicitud-main">
          <div class="solicitud-heading">
            <div>
              <p class="solicitud-id">Solicitud #{{ solicitid.id }}</p>
              <h2>{{ solicitid.mascotaName }}</h2>
            </div>
            <span class="status-tag" :class="getStatusClass(solicitud.estado)">
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
              <dd>{{ formatDate(solicitud.fechaCreacion) }}</dd>
            </div>
          </dl>
        </div>

        <p v-if="solicitud.mensaje" class="solicitud-message">
          {{ solicitid.mensaje }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { apiGetSolicitudes } from '../api/http'

const solicitudes = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const normalizeSolicitud = (solicitud, index) => {
  const mascota = solicitid.mascota || solicitid.pet || solicitid.data?.mascota || {}
  const adoptante = solicitid.adoptante || solicitid.usuario || solicitid.user || {}

  return {
    id: solicitid.id ?? solicitid._id ?? index + 1,
    mascotaName: mascota.name || mascota.nombre || 'Mascota no especificada',
    adoptanteName:
      adoptante.name ||
      adoptante.nombre ||
      adoptante.email ||
      adoptante.correo ||
      'Adoptante no especificado',
    estado: solicitid.estado || solicitid.status || solicitid.estadoSolicitud || 'PENDIENTE',
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
    solicitid.value = []
    errorMessage.value = error.message || 'No se pudieron cargar las solicitudes.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadSolicitudes)
</script>
