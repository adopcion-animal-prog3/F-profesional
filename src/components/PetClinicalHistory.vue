<template>
  <section class="clinical-history" aria-labelledby="clinical-history-title">
    <h2 id="clinical-history-title">Historial clínico</h2>

    <button
      v-if="isAdmin && !isFormOpen && editingRecordId === null"
      class="primary-button small-button"
      type="button"
      @click="openCreateForm"
    >
      Nuevo registro clínico
    </button>

    <p v-if="createSuccessMessage" class="submit-message success" role="status">
      {{ createSuccessMessage }}
    </p>
    <p v-if="editSuccessMessage" class="submit-message success" role="status">
      {{ editSuccessMessage }}
    </p>
    <p v-if="deleteSuccessMessage" class="submit-message success" role="status">
      {{ deleteSuccessMessage }}
    </p>

    <ClinicalRecordForm
      v-if="isAdmin && isFormOpen && editingRecordId === null"
      :pet-id="petId"
      :pet-name="petName"
      :is-submitting="isCreatingRecord"
      :submit-error="createErrorMessage"
      @cancel="isFormOpen = false"
      @submit="createRecord"
    />

    <div v-if="isLoading && !hasLoadedSuccessfully" class="state-block loading-state" aria-live="polite">
      <div class="spinner" aria-label="Cargando historial clínico"></div>
      <p>Cargando historial clínico...</p>
    </div>

    <div v-else-if="errorMessage && !hasLoadedSuccessfully" class="state-block error-state" role="alert">
      <h3>No se pudo cargar el historial</h3>
      <p>{{ errorMessage }}</p>
      <button class="primary-button small-button" type="button" @click="loadHistory">
        Reintentar
      </button>
    </div>

    <p v-if="isRefreshing" class="loading-inline" role="status">
      <span class="spinner" aria-hidden="true"></span>
      Actualizando historial clínico...
    </p>
    <p v-if="errorMessage && hasLoadedSuccessfully" class="error-message" role="alert">
      No se pudo actualizar el historial: {{ errorMessage }}
    </p>

    <div v-if="hasLoadedSuccessfully && records.length === 0" class="state-block empty-state">
      <h3>Sin registros clínicos</h3>
      <p>Esta mascota todavía no tiene registros en su historial.</p>
    </div>

    <ol v-if="records.length > 0" class="clinical-history-list">
      <li v-for="record in records" :key="record.id">
        <ClinicalRecordItem
          :record="record"
          :pet-id="petId"
          :pet-name="petName"
          :is-admin="isAdmin"
          :is-editing="editingRecordId === record.id"
          @edit="editingRecordId = record.id"
          @cancel-edit="editingRecordId = null"
          @updated="handleRecordUpdated"
          @deleted="handleRecordDeleted"
        />
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { apiCreatePetHistory, apiGetPetHistory } from '../api/http'
import { getStoredUser } from '../auth/session'
import { normalizeClinicalHistoryRecord } from '../utils/clinicalHistory'
import ClinicalRecordForm from './ClinicalRecordForm.vue'
import ClinicalRecordItem from './ClinicalRecordItem.vue'

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
const isLoading = ref(false)
const isRefreshing = ref(false)
const hasLoadedSuccessfully = ref(false)
const errorMessage = ref('')
const isFormOpen = ref(false)
const isCreatingRecord = ref(false)
const createErrorMessage = ref('')
const createSuccessMessage = ref('')
const editingRecordId = ref(null)
const editSuccessMessage = ref('')
const deleteSuccessMessage = ref('')
const isAdmin = computed(() => String(getStoredUser()?.role || '').trim().toUpperCase() === 'ADMIN')
let latestRequest = 0

const loadHistory = async () => {
  if (isLoading.value || isRefreshing.value) return

  const requestId = ++latestRequest
  isLoading.value = !hasLoadedSuccessfully.value
  isRefreshing.value = hasLoadedSuccessfully.value
  errorMessage.value = ''

  try {
    const items = await apiGetPetHistory(props.petId)
    if (requestId === latestRequest) {
      records.value = items.map(normalizeClinicalHistoryRecord)
      hasLoadedSuccessfully.value = true
    }
  } catch (error) {
    if (requestId === latestRequest) {
      errorMessage.value = error.message || 'No se pudo cargar el historial clínico.'
    }
  } finally {
    if (requestId === latestRequest) {
      isLoading.value = false
      isRefreshing.value = false
    }
  }
}

const openCreateForm = () => {
  createErrorMessage.value = ''
  createSuccessMessage.value = ''
  editSuccessMessage.value = ''
  isFormOpen.value = true
}

const createRecord = async (recordData) => {
  if (!isAdmin.value || isCreatingRecord.value) return

  isCreatingRecord.value = true
  createErrorMessage.value = ''
  createSuccessMessage.value = ''

  try {
    await apiCreatePetHistory(props.petId, recordData)
    isFormOpen.value = false
    createSuccessMessage.value = 'Registro clínico creado correctamente.'
    await loadHistory()
  } catch (error) {
    createErrorMessage.value = error.message || 'No se pudo crear el registro clínico.'
  } finally {
    isCreatingRecord.value = false
  }
}

const handleRecordUpdated = async () => {
  editSuccessMessage.value = 'Registro clínico actualizado correctamente.'
  await loadHistory()
}

const handleRecordDeleted = (recordId) => {
  records.value = records.value.filter((record) => String(record.id) !== String(recordId))
  deleteSuccessMessage.value = 'Registro clínico eliminado correctamente.'
}

watch(() => props.petId, loadHistory, { immediate: true })
</script>
