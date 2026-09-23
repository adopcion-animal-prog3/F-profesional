<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-block">
        <span class="brand-mark">F</span>
        <div>
          <p class="brand-name">F-profesional</p>
          <span class="brand-subtitle">Adopción</span>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Navegación principal">
        <router-link class="nav-item" :to="{ name: 'dashboard' }">Dashboard</router-link>
        <router-link class="nav-item" :to="{ name: 'mascotas' }">Mascotas</router-link>
        <router-link class="nav-item" :to="{ name: 'login' }">Login</router-link>
        <router-link class="nav-item" :to="{ name: 'registro' }">Registro</router-link>
      </nav>
    </aside>

    <div class="app-main">
      <header class="topbar">
        <div>
          <p class="topbar-label">Panel principal</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <button class="topbar-action" type="button">Resumen</button>
      </header>

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  switch (route.name) {
    case 'login':
      return 'Iniciar sesión'
    case 'registro':
      return 'Registro'
    case 'dashboard':
      return 'Dashboard'
    case 'mascotas':
      return 'Mascotas'
    case 'mascota-detalle':
      return `Mascota #${route.params.id || ''}`
    default:
      return 'F-profesional'
  }
})
</script>
