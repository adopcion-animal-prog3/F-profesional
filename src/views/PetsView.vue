<template>
  <section class="pets-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Adopciones</p>
        <h1>Mascotas disponibles</h1>
      </div>

      <button class="primary-button small-button" type="button" @click="loadPets" :disabled="isLoading">
        {{ isLoading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <div v-if="isLoading" class="state-block loading-state">
      <div class="spinner" aria-label="Cargando mascotas"></div>
      <p>Cargando mascotas...</p>
    </div>

    <div v-else-if="errorMessage" class="state-block error-state">
      <h2>No se pudo cargar la lista</h2>
      <p>{{ errorMessage }}</p>
      <button class="primary-button small-button" type="button" @click="loadPets">
        Reintentar
      </button>
    </div>

    <div v-else-if="pets.length === 0" class="state-block empty-state">
      <h2>No hay mascotas disponibles</h2>
      <p>En este momento no registramos animales en adopción.</p>
    </div>

    <div v-else class="pets-grid">
      <article v-for="pet in pets" :key="pet.id" class="pet-card">
        <div class="pet-image" :class="getPetTone(pet)">
          <span>{{ getPetInitials(pet.name) }}</span>
        </div>

        <div class="pet-body">
          <div class="pet-header">
            <h2>{{ pet.name }}</h2>
            <span class="status-tag" :class="getStatusClass(pet.status)">{{ pet.status }}</span>
          </div>

          <ul class="pet-meta">
            <li><strong>Especie:</strong> {{ pet.species }}</li>
            <li><strong>Raza:</strong> {{ pet.breed }}</li>
            <li><strong>Edad:</strong> {{ pet.age }}</li>
            <li><strong>Sexo:</strong> {{ pet.gender }}</li>
            <li><strong>Ubicación:</strong> {{ pet.location }}</li>
          </ul>

          <p class="pet-description">{{ pet.description }}</p>

          <router-link class="text-link" :to="{ name: 'mascota-detalle', params: { id: pet.id } }">
            Ver detalle
          </router-link>
        </div>
      </article>
    </div>

    <p v-if="isDemoMode" class="demo-banner">
      Modo demostración: la API no respondió y se muestran mascotas de ejemplo.
    </p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { apiGetPets } from '../api/http'

const pets = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const isDemoMode = ref(false)

const normalizePet = (pet, index) => ({
  id: pet.id ?? pet._id ?? index + 1,
  name: pet.name ?? pet.nombre ?? 'Mascota sin nombre',
  species: pet.species ?? pet.especie ?? pet.type ?? 'No especificada',
  breed: pet.breed ?? pet.raza ?? 'Sin raza',
  age: pet.age ?? pet.edad ?? 'Edad no informada',
  gender: pet.gender ?? pet.sexo ?? 'No informado',
  status: pet.status ?? pet.estado ?? 'Disponible',
  location: pet.location ?? pet.ubicacion ?? pet.city ?? pet.ciudad ?? 'Sin ubicación',
  description:
    pet.description ??
    pet.descripcion ??
    'Mascota en adopción con seguimiento veterinario.'
})

const getPetInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const getPetTone = (pet) => {
  const species = (pet.species || '').toLowerCase()

  if (species.includes('perro')) return 'tone-dog'
  if (species.includes('gato')) return 'tone-cat'
  if (species.includes('conejo')) return 'tone-rabbit'

  return 'tone-default'
}

const getStatusClass = (status = '') =>
  status
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

const loadPets = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await apiGetPets()
    const items = Array.isArray(result?.data) ? result.data : []

    pets.value = items.map(normalizePet)
    isDemoMode.value = result?.source === 'demo'
  } catch (error) {
    pets.value = []
    errorMessage.value = error.message || 'No se pudo cargar la lista de mascotas.'
    isDemoMode.value = false
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPets)
</script>
