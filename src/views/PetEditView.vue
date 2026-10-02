<template>
  <section class="pet-form-view">
    <div v-if="isLoading" class="state-block loading-state">
      <div class="spinner" aria-label="Cargando mascota para editar"></div>
      <p>Cargando datos de la mascota...</p>
    </div>

    <div v-else-if="notFound" class="state-block empty-state">
      <h1>Mascota no encontrada</h1>
      <p>No existe ninguna mascota con el ID {{ route.params.id }} para editar.</p>
      <div class="nav-links">
        <router-link to="/mascotas">Volver al listado</router-link>
      </div>
    </div>

    <div v-else-if="errorMessage" class="state-block error-state">
      <h1>No se pudo cargar la mascota</h1>
      <p>{{ errorMessage }}</p>
      <div class="nav-links">
        <router-link to="/mascotas">Volver al listado</router-link>
      </div>
    </div>

    <template v-else>
      <div class="section-header">
        <div>
          <p class="eyebrow">Administración</p>
          <h1>Editar mascota</h1>
        </div>
        <router-link
          class="primary-button small-button"
          :to="{ name: 'mascota-detalle', params: { id: route.params.id } }"
        >
          Volver al detalle
        </router-link>
      </div>

      <form class="pet-form" @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="field-group">
            <label for="pet-name">Nombre</label>
            <input id="pet-name" v-model="form.name" type="text" :class="{ invalid: errors.name }" />
            <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
          </div>

          <div class="field-group">
            <label for="pet-species">Especie</label>
            <input id="pet-species" v-model="form.species" type="text" :class="{ invalid: errors.species }" />
            <small v-if="errors.species" class="field-error">{{ errors.species }}</small>
          </div>

          <div class="field-group">
            <label for="pet-breed">Raza</label>
            <input id="pet-breed" v-model="form.breed" type="text" :class="{ invalid: errors.breed }" />
            <small v-if="errors.breed" class="field-error">{{ errors.breed }}</small>
          </div>

          <div class="field-group">
            <label for="pet-age">Edad</label>
            <input id="pet-age" v-model="form.age" type="number" min="0" step="0.5" :class="{ invalid: errors.age }" />
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
            <input id="pet-location" v-model="form.location" type="text" :class="{ invalid: errors.location }" />
            <small v-if="errors.location" class="field-error">{{ errors.location }}</small>
          </div>

          <div class="field-group field-full">
            <label for="pet-description">Descripción</label>
            <textarea
              id="pet-description"
              v-model="form.description"
              rows="5"
              :class="{ invalid: errors.description }"
            ></textarea>
            <small v-if="errors.description" class="field-error">{{ errors.description }}</small>
          </div>
        </div>

        <div v-if="submitMessage" :class="['submit-message', { success: isSaveSuccess }]">
          {{ submitMessage }}
        </div>

        <div class="form-actions">
          <button class="primary-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button class="secondary-button" type="button" @click="loadPet">Recargar</button>
        </div>
      </form>
    </template>
  </section>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGetPetById, apiUpdatePetById } from '../api/http'

const route = useRoute()
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
const isSaveSuccess = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)
const notFound = ref(false)
const errorMessage = ref('')

const parseAge = (value) => {
  if (value === null || value === undefined || value === '') return ''

  if (typeof value === 'number') return String(value)

  const clean = String(value).replace(/[^\d.]/g, '')
  return clean || ''
}

const mapFormValues = (pet) => ({
  name: pet.name ?? '',
  species: pet.species ?? '',
  breed: pet.breed ?? '',
  age: parseAge(pet.age),
  gender: pet.gender ?? '',
  status: pet.status ?? 'Disponible',
  location: pet.location ?? '',
  description: pet.description ?? ''
})

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

const loadPet = async () => {
  isLoading.value = true
  notFound.value = false
  errorMessage.value = ''
  submitMessage.value = ''
  isSaveSuccess.value = false
  errors.value = {}

  try {
    const result = await apiGetPetById(route.params.id)

    if (result?.notFound || !result?.data) {
      notFound.value = true
      return
    }

    Object.assign(form, mapFormValues(result.data))
  } catch (error) {
    errorMessage.value = error.message || 'No se pudo cargar la mascota para editar.'
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  const nextErrors = validateForm()
  errors.value = nextErrors

  if (Object.keys(nextErrors).length > 0) {
    isSaveSuccess.value = false
    submitMessage.value = 'Corrige los campos marcados para continuar.'
    return
  }

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    await apiUpdatePetById(route.params.id, {
      ...form,
      age: Number(form.age)
    })

    isSaveSuccess.value = true
    submitMessage.value = 'Mascota actualizada correctamente.'

    setTimeout(() => {
      router.push({ name: 'mascota-detalle', params: { id: route.params.id } })
    }, 800)
  } catch (error) {
    isSaveSuccess.value = false
    submitMessage.value = error.message || 'No se pudo actualizar la mascota.'
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => route.params.id,
  () => loadPet(),
  { immediate: true }
)
</script>
