<template>
  <section class="pets-view">
    <div class="section-header">
      <div>
        <p class="eyebrow">Adopciones</p>
        <h1>Todas las mascotas</h1>
        <p class="section-hint">Tocá “Ver detalle” para editar una publicación o cargar su historial clínico.</p>
      </div>

      <div class="header-actions">
        <button class="secondary-button small-button" type="button" @click="load" :disabled="isLoading">
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
      empty-title="Todavía no hay mascotas publicadas"
      empty-text="Usá el botón “Publicar mascota” para cargar la primera."
      @retry="load"
    />

    <div v-if="pets.length > 0" class="pets-grid">
      <PetCard v-for="pet in pets" :key="pet.id" :pet="pet" />
    </div>
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
  load
} = useResourceList(apiGetPets, {
  normalize: (pet, index) => normalizePet(pet, index + 1),
  fallbackError: 'No se pudo cargar la lista de mascotas.'
})

onMounted(load)
</script>
