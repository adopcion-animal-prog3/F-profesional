<template>
  <article class="feature-card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </article>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>
