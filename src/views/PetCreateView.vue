<template>
  <section class="pet-form-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Administración</p>
        <h1>Registrar mascota</h1>
      </div>
      <router-link class="primary-button small-button" to="/mascotas">Volver al listado</router-link>
    </div>

    <form class="pet-form" @submit.prevent="handleSubmit">
      <div class="form-grid">
        <div class="field-group">
          <label for="pet-name">Nombre</label>
          <input
            id="pet-name"
            v-model="form.name"
            type="text"
            :class="{ invalid: errors.name }"
            placeholder="Ej: Luna"
          />
          <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
        </div>

        <div class="field-group">
          <label for="pet-species">Especie</label>
          <input
            id="pet-species"
            v-model="form.species"
            type="text"
            :class="{ invalid: errors.species }"
            placeholder="Ej: Perro"
          />
          <small v-if="errors.species" class="field-error">{{ errors.species }}</small>
        </div>

        <div class="field-group">
          <label for="pet-breed">Raza</label>
          <input
            id="pet-breed"
            v-model="form.breed"
            type="text"
            :class="{ invalid: errors.breed }"
            placeholder="Ej: Mestizo"
          />
          <small v-if="errors.breed" class="field-error">{{ errors.breed }}</small>
        </div>

        <div class="field-group">
          <label for="pet-age">Edad</label>
          <input
            id="pet-age"
            v-model="form.age"
            type="number"
            min="0"
            step="0.5"
            :class="{ invalid: errors.age }"
            placeholder="Ej: 2"
          />
          <small v-if="errors.age" class="field-error">{{ errors.age }}</small>
        </div>

        <div class="field-group">
          <label for="pet-gender">Sexo</label>
          <select id="pet-gender" v-model="form.gender" :class="{ invalid: errors.gender }">
            <option value="">Seleccionar</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
            <option value="No informado">No informado</option>
          </select>
          <small v-if="errors.gender" class="field-error">{{ errors.gender }}</small>
        </div>

        <div class="field-group">
          <label for="pet-status">Estado</label>
          <select id="pet-status" v-model="form.status" :class="{ invalid: errors.status }">
            <option value="Disponible">Disponible</option>
            <option value="En tratamiento">En tratamiento</option>
            <option value="Adoptado">Adoptado</option>
          </select>
          <small v-if="errors.status" class="field-error">{{ errors.status }}</small>
        </div>

        <div class="field-group field-full">
          <label for="pet-location">Ubicación</label>
          <input
            id="pet-location"
            v-model="form.location"
            type="text"
            :class="{ invalid: errors.location }"
            placeholder="Ej: Córdoba"
          />
          <small v-if="errors.location" class="field-error">{{ errors.location }}</small>
        </div>

        <div class="field-group field-full">
          <label for="pet-description">Descripción</label>
          <textarea
            id="pet-description"
            v-model="form.description"
            rows="5"
            :class="{ invalid: errors.description }"
            placeholder="Describe la personalidad, estado de salud y necesidades de la mascota."
          ></textarea>
          <small v-if="errors.description" class="field-error">{{ errors.description }}</small>
        </div>
      </div>

      <div v-if="submitMessage" :class="['submit-message', { success: isValidSubmission }]">
        {{ submitMessage }}
      </div>

      <div class="form-actions">
        <button class="primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Guardando...' : 'Guardar mascota' }}
        </button>
        <button class="secondary-button" type="button" @click="resetForm">Limpiar</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiCreatePet } from '../api/http'

const router = useRouter()

const initialForm = {
  name: '',
  species: '',
  breed: '',
  age: '',
  gender: '',
  status: 'Disponible',
  location: '',
  description: ''
}

const form = reactive({ ...initialForm })
const errors = ref({})
const submitMessage = ref('')
const isValidSubmission = ref(false)
const isSubmitting = ref(false)

const resetForm = () => {
  Object.assign(form, initialForm)
  errors.value = {}
  submitMessage.value = ''
  isValidSubmission.value = false
}

const validateForm = () => {
  const nextErrors = {}

  if (!form.name.trim()) {
    nextErrors.name = 'El nombre es obligatorio.'
  } else if (form.name.trim().length < 2) {
    nextErrors.name = 'El nombre debe tener al menos 2 caracteres.'
  }

  if (!form.species.trim()) {
    nextErrors.species = 'La especie es obligatoria.'
  }

  if (!form.breed.trim()) {
    nextErrors.breed = 'La raza es obligatoria.'
  }

  if (!form.age && form.age !== 0) {
    nextErrors.age = 'La edad es obligatoria.'
  } else if (Number(form.age) <= 0) {
    nextErrors.age = 'La edad debe ser mayor que 0.'
  }

  if (!form.gender) {
    nextErrors.gender = 'Debe seleccionar el sexo.'
  }

  if (!form.status) {
    nextErrors.status = 'Debe seleccionar el estado.'
  }

  if (!form.location.trim()) {
    nextErrors.location = 'La ubicación es obligatoria.'
  }

  if (!form.description.trim()) {
    nextErrors.description = 'La descripción es obligatoria.'
  } else if (form.description.trim().length < 10) {
    nextErrors.description = 'La descripción debe tener al menos 10 caracteres.'
  }

  return nextErrors
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  const nextErrors = validateForm()

  errors.value = nextErrors

  if (Object.keys(nextErrors).length > 0) {
    isValidSubmission.value = false
    submitMessage.value = 'Corrige los campos marcados para continuar.'
    return
  }

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    await apiCreatePet({
      ...form,
      age: Number(form.age)
    })

    isValidSubmission.value = true
    submitMessage.value = 'Mascota creada correctamente.'

    setTimeout(() => {
      router.push('/mascotas')
    }, 800)
  } catch (error) {
    isValidSubmission.value = false
    submitMessage.value = error.message || 'No se pudo registrar la mascota.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
