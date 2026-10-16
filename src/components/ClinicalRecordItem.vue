<template>
  <article class="clinical-history-record">
    <template v-if="!isEditing">
      <time v-if="record.date" :datetime="record.date">{{ formatClinicalHistoryDate(record.date) }}</time>
      <p>{{ record.description }}</p>
      <p><strong>Veterinario:</strong> {{ record.veterinarian }}</p>
      <button
        v-if="isAdmin"
        class="secondary-button small-button"
        type="button"
        @click="$emit('edit')"
      >
        Editar
      </button>
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

  </article>
</template>

<script setup>
import { ref } from 'vue'
import { apiUpdateClinicalHistory } from '../api/http'
import { formatClinicalHistoryDate } from '../utils/clinicalHistory'
import ClinicalRecordForm from './ClinicalRecordForm.vue'

const props = defineProps({
  record: { type: Object, required: true },
  petId: { type: [Number, String], required: true },
  petName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'cancel-edit', 'updated'])
const isSubmitting = ref(false)
const errorMessage = ref('')

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
</script>