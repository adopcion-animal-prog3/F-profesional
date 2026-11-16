<template>
  <div class="form-grid">
    <div
      v-for="field in fields"
      :key="field.key"
      class="field-group"
      :class="{ 'field-full': field.full }"
    >
      <label :for="`pet-${field.id}`">{{ field.label }}</label>

      <select
        v-if="field.options"
        :id="`pet-${field.id}`"
        v-model="form[field.key]"
        :class="{ invalid: errors[field.key] }"
      >
        <option v-for="option in field.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <textarea
        v-else-if="field.type === 'textarea'"
        :id="`pet-${field.id}`"
        v-model="form[field.key]"
        rows="5"
        :class="{ invalid: errors[field.key] }"
        :placeholder="field.placeholder"
      ></textarea>

      <input
        v-else
        :id="`pet-${field.id}`"
        v-model="form[field.key]"
        :type="field.type || 'text'"
        v-bind="field.attrs"
        :class="{ invalid: errors[field.key] }"
        :placeholder="field.placeholder"
      />

      <small v-if="errors[field.key]" class="field-error">{{ errors[field.key] }}</small>
    </div>
  </div>
</template>

<script setup>
import { PET_GENDER_OPTIONS, PET_STATUS_OPTIONS } from '../utils/petForm'

defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})

const fields = [
  { key: 'name', id: 'name', label: 'Nombre', placeholder: 'Ej: Luna' },
  { key: 'species', id: 'species', label: 'Especie', placeholder: 'Ej: Perro' },
  { key: 'breed', id: 'breed', label: 'Raza', placeholder: 'Ej: Mestizo' },
  {
    key: 'age',
    id: 'age',
    label: 'Edad',
    type: 'number',
    placeholder: 'Ej: 2',
    attrs: { min: 0, step: 0.5 }
  },
  { key: 'gender', id: 'gender', label: 'Sexo', options: PET_GENDER_OPTIONS },
  { key: 'status', id: 'status', label: 'Estado', options: PET_STATUS_OPTIONS },
  { key: 'location', id: 'location', label: 'Ubicación', placeholder: 'Ej: Córdoba', full: true },
  {
    key: 'description',
    id: 'description',
    label: 'Descripción',
    type: 'textarea',
    full: true,
    placeholder: 'Describe la personalidad, estado de salud y necesidades de la mascota.'
  }
]
</script>
