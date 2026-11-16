<template>
  <section class="pet-detail-view">
    <PetLoadState
      v-if="isLoading || notFound || errorMessage"
      :is-loading="isLoading"
      :not-found="notFound"
      :error-message="errorMessage"
      :pet-id="route.params.id"
      loading-label="Cargando detalle de mascota"
      loading-text="detalle de la mascota"
    />

    <article v-else-if="pet" class="detail-card">
      <PetAvatar :pet="pet" base-class="detail-hero" />

      <div class="detail-body">
        <PetProfile :pet="pet" />

        <PetClinicalHistory :pet-id="pet.id" :pet-name="pet.name" />

        <div class="nav-links detail-actions">
          <router-link to="/mascotas">Volver al listado</router-link>
          <router-link :to="{ name: 'mascota-editar', params: { id: pet.id } }">Editar mascota</router-link>
          <router-link
            :to="{ name: 'solicitud-adopcion', params: { id: pet.id } }"
            :state="{ pet }"
            class="primary-button small-button"
          >
            Solicitar adopción
          </router-link>
          <button class="danger-button" type="button" :disabled="isDeleting" @click="handleDelete">
            {{ isDeleting ? 'Eliminando...' : 'Eliminar mascota' }}
          </button>
          <router-link to="/dashboard">Ir al dashboard</router-link>
        </div>

        <p v-if="deleteError" class="error-message" role="alert">
          {{ deleteError }}
        </p>
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiDeletePetById } from '../api/http'
import PetAvatar from '../components/PetAvatar.vue'
import PetClinicalHistory from '../components/PetClinicalHistory.vue'
import PetLoadState from '../components/PetLoadState.vue'
import PetProfile from '../components/PetProfile.vue'
import { useAsyncAction } from '../composables/useAsyncAction'
import { usePetById } from '../composables/usePetById'
import { normalizePet } from '../utils/petDisplay'

const route = useRoute()
const router = useRouter()
const pet = ref(null)

const { isLoading, notFound, errorMessage } = usePetById(() => route.params.id, {
  onLoaded: (data) => {
    pet.value = normalizePet(data, route.params.id)
    localStorage.setItem('selected_pet', JSON.stringify(pet.value))
  },
  fallbackError: 'No se pudo cargar la mascota solicitada.'
})

const { isRunning: isDeleting, errorMessage: deleteError, run } = useAsyncAction()

const handleDelete = async () => {
  if (!pet.value?.id || isDeleting.value) return

  const confirmed = window.confirm(
    `¿Seguro que querés eliminar a ${pet.value.name}? Esta acción no se puede deshacer.`
  )
  if (!confirmed) return

  const deleted = await run({
    operation: () => apiDeletePetById(pet.value.id),
    successMessage: 'Mascota eliminada correctamente.',
    fallbackError: 'No se pudo eliminar la mascota.'
  })

  if (deleted) router.push('/mascotas')
}
</script>
