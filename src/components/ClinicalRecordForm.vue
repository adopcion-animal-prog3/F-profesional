<template>
  <form class="pet-form" novalidate @submit.prevent="handleSubmit">
    <div class="selected-pet-card">
      <div>
        <p class="eyebrow">Nuevo registro clínico</p>
        <h3>{{ petName }}</h3>
        <p>ID de mascota: {{ petId }}</p>
      </div>
    </div>

    <div class="form-grid">
      <div class="field-group">
        <label for="clinical-date">Fecha del registro</label>
        <input id="clinical-date" v-model="form.fecha_registro" type="date" />
      </div>

      <div class="field-group">
        <label for="clinical-veterinarian">Veterinario</label>
        <input
          id="clinical-veterinarian"
          v-model.trim="form.veterinario"
          type="text"
          autocomplete="name"
          placeholder="Nombre del veterinario"
        />
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
        />
        <p
          v-if="errors.descripcion"
          id="clinical-description-error"
          class="field-error"
          role="alert"
        >
          {{ errors.descripcion }}
        </p>
      </div>
    </div>

    <p v-if="feedbackMessage" class="submit-message success" role="status">
      {{ feedbackMessage }}
    </p>

    <div class="form-actions">
      <button class="primary-button" type="submit">Guardar</button>
      <button class="secondary-button" type="button" @click="$emit('cancel')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

defineProps({
  petId: {
    type: [Number, String],
    required: true
  },
  petName: {
    type: String,
    required: true
  }
})

defineEmits(['cancel'])

const form = reactive({
  fecha_registro: '',
  descripcion: '',
  veterinario: ''
})
const errors = ref({})
const feedbackMessage = ref('')

const handleSubmit = () => {
  errors.value = {}
  feedbackMessage.value = ''

  if (!form.descripcion.trim()) {
    errors.value.descripcion = 'La descripción es obligatoria.'
    return
  }

  feedbackMessage.value = 'Datos válidos. El registro todavía no se guardó.'
}
</script>