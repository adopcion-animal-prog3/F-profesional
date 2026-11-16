<template>
  <div :class="[baseClass, getPetTone(pet)]">
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
