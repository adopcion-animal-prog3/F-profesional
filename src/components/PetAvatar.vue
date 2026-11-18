<template>
  <img v-if="pet?.imagen" :class="[baseClass, 'pet-photo']" :src="pet.imagen" :alt="`Foto de ${pet.name}`" loading="lazy" />
  <div v-else :class="[baseClass, getPetTone(pet)]">
    <span>{{ getPetInitials(pet?.name) }}</span>
  </div>
</template>

<script setup>
import { getPetInitials, getPetTone } from '../utils/petDisplay'

defineProps({
  pet: { type: Object, required: true },
  baseClass: { type: String, default: 'pet-image' }
})
</script>
