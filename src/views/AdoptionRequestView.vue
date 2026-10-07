<template>
  <section class="adoption-request-view">
    <div class="request-page-header">
      <div>
        <p class="eyebrow">Nueva solicitud</p>
        <h1>Solicitar adopción</h1>
        <p>Completa los datos para iniciar una solicitud para la mascota seleccionada.</p>
      </div>
      <router-link class="secondary-button" to="/mascotas">Volver a mascotas</router-link>
    </div>

    <AdoptionRequestForm
      :pet="pet"
      :is-submitting="isSubmitting"
      :submit-error="submitError"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiCreateAdoptionRequest } from '../api/http'
import AdoptionRequestForm from '../components/AdoptionRequestForm.vue'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  pet: {
    type: Object,
    required: false,
    default: null
  }
})

const pet = computed(() => {
  if (props.pet) return props.pet

  const selectedPet = route.state?.pet
  if (selectedPet) return selectedPet

  try {
    const cachedPet = localStorage.getItem('selected_pet')
    if (cachedPet) return JSON.parse(cachedPet)
  } catch (error) {
    console.warn('No se pudo recuperar la mascota seleccionada.', error)
  }

  const petId = route.params.id
  return {
    id: petId,
    name: `Mascota #${petId}`,
    species: 'No especificada',
    breed: 'Sin raza',
    age: 'Edad no informada'
  }
})

const isSubmitting = ref(false)
const submitError = ref('')

const handleSubmit = async (data) => {
  isSubmitting.value = true
  submitError.value = ''

  try {
    await apiCreateAdoptionRequest({ ...data, petId: pet.value.id })
    router.push('/solicitudes', {
      state: { created: true, petName: pet.value.name }
    })
  } catch (error) {
    submitError.value = error.message || 'No se pudo crear la solicitud.'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => router.push(`/mascotas/${pet.value.id}`)
</script>
