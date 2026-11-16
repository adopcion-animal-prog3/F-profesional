<template>
  <div v-if="isLoading" class="state-block loading-state">
    <div class="spinner" :aria-label="loadingLabel"></div>
    <p>Cargando {{ loadingText }}...</p>
  </div>

  <div v-else-if="notFound" class="state-block empty-state">
    <h1>Mascota no encontrada</h1>
    <p>No existe ninguna mascota con el ID {{ petId }}{{ notFoundSuffix }}.</p>
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
</template>

<script setup>
defineProps({
  isLoading: { type: Boolean, default: false },
  notFound: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  petId: { type: [String, Number], default: '' },
  loadingLabel: { type: String, default: 'Cargando mascota' },
  loadingText: { type: String, default: 'la mascota' },
  notFoundSuffix: { type: String, default: '' }
})
</script>
