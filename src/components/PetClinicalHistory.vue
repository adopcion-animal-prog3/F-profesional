<template>
  <section class="clinical-history" aria-labelledby="clinical-history-title">
    <h2 id="clinical-history-title">Historial clínico</h2>

    <div v-if="isAdmin" class="form-actions">
      <button
        v-if="!isFormOpen"
        class="primary-button small-button"
        type="button"
        @click="isFormOpen = true"
      >
        Nuevo registro clínico
      </button>
    </div>

    <ClinicalRecordForm
      v-if="isAdmin && isFormOpen"
      :pet-id="petId"
      :pet-name="petName"
      @cancel="isFormOpen = false"
    />

    <div v-if="isLoading" class="state-block loading-state" aria-live="polite">
      <div class="spinner" aria-label="Cargando historial clínico"></div>
      <p>Cargando historial clínico...</p>
    </div>

    <div v-else-if="errorMessage" class="state-block error-state" role="alert">
      <h3>No se pudo cargar el historial</h3>
      <p>{{ errorMessage }}</p>
      <button class="primary-button small-button" type="button" @click="loadHistory">
        Reintentar
      </button>
    </div>

    <div v-else-if="records.length === 0" class="state-block empty-state">
      <h3>Sin registros clínicos</h3>
      <p>Esta mascota todavía no tiene registros en su historial.</p>
    </div>

    <ol v-else class="clinical-history-list">
      <li v-for="record in records" :key="record.id">
        <article class="clinical-history-record">
          <time v-if="record.date" :datetime="record.date">{{ formatDate(record.date) }}</time>
          <p>{{ record.description }}</p>
          <p><strong>Veterinario:</strong> {{ record.veterinarian }}</p>
        </article>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { apiGetPetHistory } from '../api/http'
import { getStoredUser } from '../auth/session'
import ClinicalRecordForm from './ClinicalRecordForm.vue'

const props = defineProps({
  petId: {
    type: [Number, String],
    required: true
  },
  petName: {
    type: String,
    required: true
  }
})

const records = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const isFormOpen = ref(false)
const isAdmin = computed(() =>
  String(getStoredUser()?.role || '').trim().toUpperCase() === 'ADMIN'
)
let latestRequest = 0

const normalizeRecord = (record, index) => {
  const veterinarian = record.veterinario ?? record.veterinarian ?? record.doctor
  const veterinarianName = typeof veterinarian === 'string'
    ? veterinarian
    : veterinarian?.nombre || veterinarian?.name

  return {
    id: record.id ?? record._id ?? index,
    date: record.fecha ?? record.date ?? record.fechaRegistro ?? record.createdAt ?? '',
    description: record.descripcion ?? record.description ?? record.detalle ?? 'Sin descripción',
    veterinarian: veterinarianName || record.veterinarioNombre || 'No informado'
  }
}

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

const loadHistory = async () => {
  const requestId = ++latestRequest
  isLoading.value = true
  errorMessage.value = ''

  try {
    const items = await apiGetPetHistory(props.petId)
    if (requestId === latestRequest) records.value = items.map(normalizeRecord)
  } catch (error) {
    if (requestId === latestRequest) {
      records.value = []
      errorMessage.value = error.message || 'No se pudo cargar el historial clínico.'
    }
  } finally {
    if (requestId === latestRequest) isLoading.value = false
  }
}

watch(() => props.petId, loadHistory, { immediate: true })
</script>
