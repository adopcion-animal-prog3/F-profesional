<template>
  <div class="form-grid">
    <PetImageField v-model="form.imagen" />

    <div
      v-for="field in fields"
      :key="field.key"
      class="field-group"
      :class="{ 'field-full': field.full }"
    >
      <label :for="`pet-${field.key}`">{{ field.label }}</label>

      <select
        v-if="field.options"
        :id="`pet-${field.key}`"
        v-model="form[field.key]"
        :class="{ invalid: errors[field.key] }"
      >
        <option v-for="option in field.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <textarea
        v-else-if="field.type === 'textarea'"
        :id="`pet-${field.key}`"
        v-model="form[field.key]"
        rows="5"
        :placeholder="field.placeholder"
      ></textarea>

      <input
        v-else
        :id="`pet-${field.key}`"
        v-model="form[field.key]"
        :type="field.type || 'text'"
        v-bind="field.attrs"
        :class="{ invalid: errors[field.key] }"
        :placeholder="field.placeholder"
      />

      <small v-if="errors[field.key]" class="field-error">{{ errors[field.key] }}</small>
    </div>

    <label class="field-group field-checkbox" for="pet-adoptada">
      <input id="pet-adoptada" v-model="form.adoptada" type="checkbox" />
      <span>Ya fue adoptada</span>
    </label>
  </div>
</template>

<script setup>
import PetImageField from './PetImageField.vue'
import { PET_SEXO_OPTIONS } from '../utils/petForm'

defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})

const fields = [
  { key: 'nombre', label: 'Nombre *', placeholder: 'Ej: Luna' },
  { key: 'especie', label: 'Especie *', placeholder: 'Ej: Perro' },
  { key: 'raza', label: 'Raza', placeholder: 'Ej: Mestizo' },
  { key: 'edad', label: 'Edad (años)', type: 'number', placeholder: 'Ej: 2', attrs: { min: 0, step: 1 } },
  { key: 'sexo', label: 'Sexo', options: PET_SEXO_OPTIONS },
  {
    key: 'descripcion',
    label: 'Descripción',
    type: 'textarea',
    full: true,
    placeholder: 'Describí la personalidad, estado de salud y necesidades de la mascota.'
  }
]
</script>
