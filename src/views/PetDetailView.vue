<template>
  <section class="page-view">
    <h1>Mascota #{{ id }}</h1>
    <p>Vista placeholder para detalle de una mascota.</p>
    <nav class="nav-links">
      <router-link to="/mascotas">Volver a mascotas</router-link>
      <router-link to="/dashboard">Volver al dashboard</router-link>
    </nav>
  </section>
</template>

<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

console.log(props.id)
</script>
