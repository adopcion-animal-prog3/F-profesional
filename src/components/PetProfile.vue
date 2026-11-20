<template>
  <div class="detail-header">
    <div>
      <p class="eyebrow">Ficha de mascota</p>
      <h1>{{ pet.name }}</h1>
    </div>
    <span class="status-tag" :class="getStatusClass(pet.status)">{{ pet.status }}</span>
  </div>

  <div class="detail-grid">
    <div
      v-for="item in details"
      :key="item.key"
      class="detail-item"
      :class="{ wide: item.wide }"
    >
      <span class="label">{{ item.label }}</span>
      <strong>{{ pet[item.key] }}</strong>
    </div>
  </div>

  <div class="detail-description">
    <h2>Descripción</h2>
    <p>{{ pet.description }}</p>
  </div>
</template>

<script setup>
import { getStatusClass } from '../utils/petDisplay'

defineProps({
  pet: { type: Object, required: true }
})

const details = [
  { key: 'species', label: 'Especie' },
  { key: 'breed', label: 'Raza' },
  { key: 'age', label: 'Edad' },
  { key: 'gender', label: 'Sexo' }
]
</script>
