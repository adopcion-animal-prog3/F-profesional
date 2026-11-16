<template>
  <article class="pet-card">
    <PetAvatar :pet="pet" base-class="pet-image" />

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
</template>

<script setup>
import { getStatusClass } from '../utils/petDisplay'
import PetAvatar from './PetAvatar.vue'

defineProps({
  pet: { type: Object, required: true }
})
</script>
