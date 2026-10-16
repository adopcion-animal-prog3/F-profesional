<template>
  <form class="pet-form" novalidate @submit.prevent="handleSubmit">
    <div class="selected-pet-card">
      <div>
        <p class="eyebrow">{{ record ? 'Editar registro clínico' : 'Nuevo registro clínico' }}</p>
        <h3>{{ petName }}</h3>
        <p>ID de mascota: {{ petId }}</p>
      </div>
    </div>

    <div class="form-grid">
      <div class="field-group">
        <label for="clinical-date">Fecha del registro</label>
        <input
          v-if="record"
          id="clinical-date"
          v-model="form.fecha_registro"
          type="date"
          required
          :class="{ invalid: errors.fecha_registro }"
          :aria-invalid="Boolean(errors.fecha_registro)"
          :aria-describedby="errors.fecha_registro ? 'clinical-date-error' : undefined"
          :disabled="isSubmitting"
        />
        <p v-else>La asignará el servidor al guardar.</p>
        <p v-if="errors.fecha_registro" id="clinical-date-error" class="field-error" role="alert">{{ errors.fecha_registro }}</p>
      </div>

      <div class="field-group">
        <label for="clinical-veterinarian">Veterinario</label>
        <input
          id="clinical-veterinarian"
          v-model.trim="form.veterinario"
          type="text"
          autocomplete="name"
          :maxlength="record ? undefined : 200"
          :class="{ invalid: errors.veterinario }"
          :aria-invalid="Boolean(errors.veterinario)"
          :aria-describedby="errors.veterinario ? 'clinical-veterinarian-error' : undefined"
          placeholder="Nombre del veterinario"
          :disabled="isSubmitting"
        />
        <p v-if="errors.veterinario" id="clinical-veterinarian-error" class="field-error" role="alert">{{ errors.veterinario }}</p>
      </div>

      <div class="field-group field-full">
        <label for="clinical-description">Descripción <span aria-hidden="true">*</span></label>
        <textarea
          id="clinical-description"
          v-model.trim="form.descripcion"
          rows="4"
          required
          :class="{ invalid: errors.descripcion }"
          :aria-invalid="Boolean(errors.descripcion)"
          :aria-describedby="errors.descripcion ? 'clinical-description-error' : undefined"
          placeholder="Describe la consulta, diagnóstico o tratamiento"
          :disabled="isSubmitting"
        />
        <p v-if="errors.descripcion" id="clinical-description-error" class="field-error" role="alert">{{ errors.descripcion }}</p>
      </div>
    </div>

    <p v-if="submitError" class="submit-message" role="alert">
      {{ submitError }}
    </p>

    <div class="form-actions">
      <button class="primary-button" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando...' : record ? 'Actualizar' : 'Guardar' }}
      </button>
      <button
        class="secondary-button"
        type="button"
        :disabled="isSubmitting"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  petId: {
    type: [Number, String],
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  submitError: {
    type: String,
    default: ''
  },
  record: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancel', 'submit'])

const form = reactive({
  fecha_registro: props.record?.date?.slice(0, 10) || '',
  descripcion: '',
  veterinario: props.record?.veterinarianValue ?? ''
})
form.descripcion = props.record?.description || ''
const errors = ref({})

const handleSubmit = () => {
  if (props.isSubmitting) return

  errors.value = {}

  if (!form.descripcion.trim()) {
    errors.value.descripcion = 'La descripción es obligatoria.'
  }

  if (props.record && (!form.fecha_registro || Number.isNaN(Date.parse(form.fecha_registro)))) {
    errors.value.fecha_registro = 'Introduce una fecha válida.'
  }

  if (!props.record && form.veterinario.trim().length > 200) {
    errors.value.veterinario = 'El nombre del veterinario no puede superar 200 caracteres.'
  }

  if (Object.keys(errors.value).length > 0) return

  const recordData = {
    descripcion: form.descripcion.trim(),
    veterinario: form.veterinario.trim() || null
  }
  if (props.record) recordData.fecha_registro = form.fecha_registro

  emit('submit', recordData)
}
</script>