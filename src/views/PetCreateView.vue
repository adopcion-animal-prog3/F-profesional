<template>
  <section class="pet-form-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Nueva publicación</p>
        <h2>Completá los datos de la mascota</h2>
        <p class="section-hint">Los campos con * son obligatorios. Una buena foto ayuda a que la adopten más rápido.</p>
      </div>
      <router-link class="primary-button small-button" to="/mascotas">Volver al listado</router-link>
    </div>

    <form class="pet-form" @submit.prevent="handleSubmit">
      <PetFormFields :form="form" :errors="errors" />

      <div v-if="submitMessage" class="submit-message" role="alert">
        {{ submitMessage }}
      </div>

      <div class="form-actions">
        <button class="primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Guardando...' : 'Guardar mascota' }}
        </button>
        <button class="secondary-button" type="button" :disabled="isSubmitting" @click="resetForm">
          Limpiar
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { apiCreatePet } from '../api/http'
import PetFormFields from '../components/PetFormFields.vue'
import { usePetForm } from '../composables/usePetForm'
import { createEmptyPetForm } from '../utils/petForm'

const router = useRouter()
const { form, errors, submitMessage, isSubmitting, submit } = usePetForm()

const resetForm = () => {
  if (isSubmitting.value) return

  Object.assign(form, createEmptyPetForm())
  errors.value = {}
  submitMessage.value = ''
}

const handleSubmit = () =>
  submit({
    save: (petData) => apiCreatePet(petData),
    successMessage: 'Mascota creada correctamente.',
    fallbackError: 'No se pudo registrar la mascota.',
    onSaved: () => router.push('/mascotas')
  })
</script>
