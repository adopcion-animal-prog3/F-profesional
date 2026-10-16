<template>
  <article class="clinical-history-record">
    <template v-if="!isEditing">
      <time v-if="record.date" :datetime="record.date">{{ formatClinicalHistoryDate(record.date) }}</time>
      <p>{{ record.description }}</p>
      <p><strong>Veterinario:</strong> {{ record.veterinarian }}</p>
      <div v-if="isAdmin" class="form-actions">
        <button
          class="secondary-button small-button"
          type="button"
          :disabled="isDeleting"
          @click="$emit('edit')"
        >
          Editar
        </button>
        <button
          class="danger-button small-button"
          type="button"
          :disabled="isDeleting"
          @click="deleteRecord"
        >
          {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </template>

    <ClinicalRecordForm
      v-else
      :pet-id="petId"
      :pet-name="petName"
      :record="record"
      :is-submitting="isSubmitting"
      :submit-error="errorMessage"
      @cancel="$emit('cancel-edit')"
      @submit="saveRecord"
    />

    <p v-if="deleteError" class="submit-message" role="alert">{{ deleteError }}</p>

  </article>
</template>

<script setup>
import { ref } from 'vue'
import { apiDeleteClinicalHistory, apiUpdateClinicalHistory } from '../api/http'
import { formatClinicalHistoryDate } from '../utils/clinicalHistory'
import ClinicalRecordForm from './ClinicalRecordForm.vue'

const props = defineProps({
  record: { type: Object, required: true },
  petId: { type: [Number, String], required: true },
  petName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'cancel-edit', 'updated', 'deleted'])
const isSubmitting = ref(false)
const errorMessage = ref('')
const isDeleting = ref(false)
const deleteError = ref('')

const saveRecord = async (recordData) => {
  if (!props.isAdmin || isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await apiUpdateClinicalHistory(props.record.id, recordData)
    emit('cancel-edit')
    emit('updated')
  } catch (error) {
    errorMessage.value = error.message || 'No se pudo actualizar el registro clínico.'
  } finally {
    isSubmitting.value = false
  }
}

const deleteRecord = async () => {
  if (!props.isAdmin || isDeleting.value) return

  const confirmed = window.confirm(
    `¿Eliminar el registro clínico "${props.record.description}"? Esta acción no se puede deshacer.`
  )
  if (!confirmed) return

  isDeleting.value = true
  deleteError.value = ''

  try {
    await apiDeleteClinicalHistory(props.record.id)
    emit('deleted', props.record.id)
  } catch (error) {
    deleteError.value = error.message || 'No se pudo eliminar el registro clínico.'
  } finally {
    isDeleting.value = false
  }
}
</script>