<template>
  <section class="pets-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Adopciones</p>
        <h1>Mascotas disponibles</h1>
      </div>

      <div class="header-actions">
        <router-link class="primary-button small-button" to="/mascotas/nueva">Nueva mascota</router-link>
        <button class="primary-button small-button" type="button" @click="load" :disabled="isLoading">
          {{ isLoading ? (hasLoadedSuccessfully ? 'Actualizando...' : 'Cargando...') : 'Actualizar' }}
        </button>
      </div>
    </div>

    <ResourceStatus
      :is-loading="isLoading"
      :has-loaded="hasLoadedSuccessfully"
      :error-message="errorMessage"
      :is-empty="pets.length === 0"
      resource-name="mascotas"
      error-title="No se pudo cargar la lista"
      refresh-error-prefix="No se pudo actualizar la lista"
      empty-title="No hay mascotas disponibles"
      empty-text="En este momento no registramos animales en adopción."
      @retry="load"
    />

    <div v-if="pets.length > 0" class="pets-grid">
      <PetCard v-for="pet in pets" :key="pet.id" :pet="pet" />
    </div>

    <p v-if="source === 'demo'" class="demo-banner">
      Modo demostración: la API no respondió y se muestran mascotas de ejemplo.
    </p>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { apiGetPets } from '../api/http'
import PetCard from '../components/PetCard.vue'
import ResourceStatus from '../components/ResourceStatus.vue'
import { useResourceList } from '../composables/useResourceList'
import { normalizePet } from '../utils/petDisplay'

const {
  items: pets,
  isLoading,
  hasLoadedSuccessfully,
  errorMessage,
  source,
  load
} = useResourceList(apiGetPets, {
  normalize: (pet, index) => normalizePet(pet, index + 1),
  fallbackError: 'No se pudo cargar la lista de mascotas.'
})

onMounted(load)
</script>
