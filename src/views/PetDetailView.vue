<template>
  <section class="pet-detail-view">
    <div v-if="isLoading" class="state-block loading-state">
      <div class="spinner" aria-label="Cargando detalle de mascota"></div>
      <p>Cargando detalle de la mascota...</p>
    </div>

    <div v-else-if="notFound" class="state-block empty-state">
      <h1>Mascota no encontrada</h1>
      <p>No existe ninguna mascota con el ID {{ route.params.id }}.</p>
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

    <article v-else class="detail-card">
      <div class="detail-hero" :class="getPetTone(pet)">
        <span>{{ getPetInitials(pet.name) }}</span>
      </div>

      <div class="detail-body">
        <div class="detail-header">
          <div>
            <p class="eyebrow">Ficha de mascota</p>
            <h1>{{ pet.name }}</h1>
          </div>
          <span class="status-tag" :class="getStatusClass(pet.status)">{{ pet.status }}</span>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">Especie</span>
            <strong>{{ pet.species }}</strong>
          </div>
          <div class="detail-item">
            <span class="label">Raza</span>
            <strong>{{ pet.breed }}</strong>
          </div>
          <div class="detail-item">
            <span class="label">Edad</span>
            <strong>{{ pet.age }}</strong>
          </div>
          <div class="detail-item">
            <span class="label">Sexo</span>
            <strong>{{ pet.gender }}</strong>
          </div>
          <div class="detail-item wide">
            <span class="label">Ubicación</span>
            <strong>{{ pet.location }}</strong>
          </div>
        </div>

        <div class="detail-description">
          <h2>Descripción</h2>
          <p>{{ pet.description }}</p>
        </div>

        <div class="nav-links detail-actions">
          <router-link to="/mascotas">Volver al listado</router-link>
          <router-link :to="{ name: 'mascota-editar', params: { id: pet.id } }">Editar mascota</router-link>
          <button class="danger-button" type="button" :disabled="isDeleting" @click="handleDelete">
            {{ isDeleting ? 'Eliminando...' : 'Eliminar mascota' }}
          </button>
          <router-link to="/dashboard">Ir al dashboard</router-link>
        </div>

        <p v-if="deleteMessage" :class="['delete-message', { error: deleteMessage.includes('No se pudo') }]">
          {{ deleteMessage }}
        </p>
      </div>
    </article>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiDeletePetById, apiGetPetById } from '../api/http'

const route = useRoute()
const router = useRouter()
const pet = ref(null)
const isLoading = ref(true)
const notFound = ref(false)
const errorMessage = ref('')
const isDeleting = ref(false)
const deleteMessage = ref('')

const normalizePet = (item) => ({
  id: item.id ?? item._id ?? route.params.id,
  name: item.name ?? item.nombre ?? 'Mascota sin nombre',
  species: item.species ?? item.especie ?? item.type ?? 'No especificada',
  breed: item.breed ?? item.raza ?? 'Sin raza',
  age: item.age ?? item.edad ?? 'Edad no informada',
  gender: item.gender ?? item.sexo ?? 'No informado',
  status: item.status ?? item.estado ?? 'Disponible',
  location: item.location ?? item.ubicacion ?? item.city ?? item.ciudad ?? 'Sin ubicación',
  description:
    item.description ??
    item.descripcion ??
    'Mascota en adopción con seguimiento veterinario.'
})

const getPetInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const getPetTone = (item) => {
  const species = (item?.species || '').toLowerCase()

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

const loadPet = async () => {
  const petId = route.params.id

  isLoading.value = true
  notFound.value = false
  errorMessage.value = ''
  pet.value = null

  try {
    const result = await apiGetPetById(petId)

    if (result?.notFound || !result?.data) {
      notFound.value = true
      return
    }

    pet.value = normalizePet(result.data)
  } catch (error) {
    errorMessage.value = error.message || 'No se pudo cargar la mascota solicitada.'
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async () => {
  if (!pet.value?.id || isDeleting.value) return

  const confirmed = window.confirm(
    `¿Seguro que querés eliminar a ${pet.value.name}? Esta acción no se puede deshacer.`
  )

  if (!confirmed) {
    deleteMessage.value = 'La eliminación fue cancelada.'
    return
  }

  isDeleting.value = true
  deleteMessage.value = ''

  try {
    await apiDeletePetById(pet.value.id)
    deleteMessage.value = 'Mascota eliminada correctamente.'
    router.push('/mascotas')
  } catch (error) {
    deleteMessage.value = error.message || 'No se pudo eliminar la mascota.'
  } finally {
    isDeleting.value = false
  }
}

watch(
  () => route.params.id,
  () => loadPet(),
  { immediate: true }
)

onMounted(loadPet)
</script>
