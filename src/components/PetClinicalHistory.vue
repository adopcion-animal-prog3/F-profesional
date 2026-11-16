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

    <ClinicalRecordForm
      v-if="isAdmin && isFormOpen && editingRecordId === null"
      :pet-id="petId"
      :pet-name="petName"
      :is-submitting="isCreatingRecord"
      :submit-error="createErrorMessage"
      @cancel="isFormOpen = false"
      @submit="createRecord"
    />

    <ResourceStatus
      :is-loading="isLoading || isRefreshing"
      :has-loaded="hasLoadedSuccessfully"
      :error-message="errorMessage"
      :is-empty="records.length === 0"
      resource-name="historial clínico"
      error-title="No se pudo cargar el historial"
      refresh-error-prefix="No se pudo actualizar el historial"
      empty-title="Sin registros clínicos"
      empty-text="Esta mascota todavía no tiene registros en su historial."
      heading-tag="h3"
      @retry="loadHistory"
    />

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
import { isAdminUser } from '../utils/solicitudes'
import { runWithSuccessMessage } from '../utils/successMessage'
import ClinicalRecordForm from './ClinicalRecordForm.vue'
import ClinicalRecordItem from './ClinicalRecordItem.vue'
import ResourceStatus from './ResourceStatus.vue'

const props = defineProps({
  petId: { type: [Number, String], required: true },
  petName: { type: String, required: true }
})

const records = ref([])
const isLoading = ref(false)
const isRefreshing = ref(false)
const hasLoadedSuccessfully = ref(false)
const errorMessage = ref('')
const isFormOpen = ref(false)
const isCreatingRecord = ref(false)
const createErrorMessage = ref('')
const editingRecordId = ref(null)
const isAdmin = computed(() => isAdminUser(getStoredUser()))
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
  isFormOpen.value = true
}

const createRecord = async (recordData) => {
  if (!isAdmin.value || isCreatingRecord.value) return

  isCreatingRecord.value = true
  createErrorMessage.value = ''

  try {
    await runWithSuccessMessage(
      () => apiCreatePetHistory(props.petId, recordData),
      'Registro clínico creado correctamente.'
    )
    isFormOpen.value = false
    await loadHistory()
  } catch (error) {
    createErrorMessage.value = error.message || 'No se pudo crear el registro clínico.'
  } finally {
    isCreatingRecord.value = false
  }
}

const handleRecordUpdated = async () => {
  await loadHistory()
}

const handleRecordDeleted = (recordId) => {
  records.value = records.value.filter((record) => String(record.id) !== String(recordId))
}

watch(() => props.petId, loadHistory, { immediate: true })
</script>
