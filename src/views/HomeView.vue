<template>
  <main class="page">
    <section class="hero">
      <span class="eyebrow">Frontend base</span>
      <h1>F-profesional</h1>
      <p>
        Plataforma base para la adopción y gestión de salud animal.
      </p>
    </section>

    <section class="env-panel">
      <p class="env-label">URL base del backend</p>
      <strong>{{ apiUrl }}</strong>
    </section>

    <section class="grid">
      <FeatureCard
        title="Estructura inicial"
        description="Proyecto Vue.js preparado con una base clara para continuar desarrollando las vistas del sistema."
      />
      <FeatureCard
        title="Componentes"
        description="Se deja una separación organizada entre componentes y vistas para facilitar futuras implementaciones."
      />
      <FeatureCard
        title="Desarrollo limpio"
        description="La aplicación queda lista para ejecutarse en modo desarrollo sin lógicas de negocio ni dependencias innecesarias."
      />
    </section>
  </main>
</template>

<script setup>
import FeatureCard from '../components/FeatureCard.vue'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
</script>
