<template>
  <section class="pet-form-view">
    <PetLoadState
      v-if="isLoading || notFound || errorMessage"
      :is-loading="isLoading"
      :not-found="notFound"
      :error-message="errorMessage"
      :pet-id="petId"
      loading-label="Cargando mascota para editar"
      loading-text="datos de la mascota"
      not-found-suffix=" para editar"
    />

    <template v-else>
      <div class="section-header">
        <div>
          <p class="eyebrow">Administración</p>
          <h1>Editar mascota</h1>
        </div>
        <router-link class="primary-button small-button" :to="detailRoute">
          Volver al detalle
        </router-link>
      </div>

      <form class="pet-form" @submit.prevent="handleSubmit">
        <PetFormFields :form="form" :errors="errors" />

        <div v-if="submitMessage" class="submit-message" role="alert">
          {{ submitMessage }}
        </div>

        <div class="form-actions">
          <button class="primary-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button
            class="secondary-button"
            type="button"
            :disabled="isLoading || isSubmitting"
            @click="reload"
          >
            {{ isLoading ? 'Cargando...' : 'Recargar' }}
          </button>
        </div>
      </form>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiUpdatePetById } from '../api/http'
import PetFormFields from '../components/PetFormFields.vue'
import PetLoadState from '../components/PetLoadState.vue'
import { usePetById } from '../composables/usePetById'
import { usePetForm } from '../composables/usePetForm'
import { mapPetToForm } from '../utils/petForm'

const route = useRoute()
const router = useRouter()
const petId = computed(() => route.params.id)
const detailRoute = computed(() => ({ name: 'mascota-detalle', params: { id: petId.value } }))
const { form, errors, submitMessage, isSubmitting, submit } = usePetForm()

const { isLoading, notFound, errorMessage, load } = usePetById(() => route.params.id, {
  onLoaded: (pet) => Object.assign(form, mapPetToForm(pet)),
  fallbackError: 'No se pudo cargar la mascota para editar.'
})

const reload = () => {
  if (isLoading.value || isSubmitting.value) return

  submitMessage.value = ''
  errors.value = {}
  load()
}

const handleSubmit = () =>
  submit({
    save: (petData) => apiUpdatePetById(petId.value, petData),
    successMessage: 'Mascota actualizada correctamente.',
    fallbackError: 'No se pudo actualizar la mascota.',
    onSaved: () => router.push(detailRoute.value)
  })
</script>
