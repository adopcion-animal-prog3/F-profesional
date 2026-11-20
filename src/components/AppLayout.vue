<template>
  <slot v-if="isAuthRoute" />

  <div v-else class="app-shell">
    <aside class="app-sidebar">
      <router-link class="brand-block" :to="{ name: user ? 'dashboard' : 'login' }">
        <BrandLogo :size="42" background="#ffffff" foreground="#15803d" />
        <div>
          <p class="brand-name">Huellitas</p>
          <span class="brand-subtitle">Portal profesional</span>
        </div>
      </router-link>

      <nav class="sidebar-nav" aria-label="Navegación principal">
        <template v-if="user">
          <router-link v-for="item in privateLinks" :key="item.name" class="nav-item" :to="{ name: item.name }">
            <AppIcon :name="item.icon" />
            <span>{{ item.label }}</span>
          </router-link>
        </template>
        <router-link v-else class="nav-item" :to="{ name: 'login' }">
          <AppIcon name="login" /><span>Iniciar sesión</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <a class="nav-item portal-link" :href="adoptionPortalUrl">
          <AppIcon name="external" :size="18" /><span>Portal de adopción</span>
        </a>
        <button v-if="user" class="nav-item nav-button" type="button" @click="logout">
          <AppIcon name="logout" :size="18" /><span>Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <div class="app-main">
      <header class="topbar">
        <div>
          <p class="topbar-label">{{ user ? `Hola, ${user.nombre}` : 'Portal profesional' }}</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <router-link v-if="user && route.name !== 'mascota-nueva'" class="primary-button" :to="{ name: 'mascota-nueva' }">
          <AppIcon name="plus" /> Publicar mascota
        </router-link>
      </header>

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearSession, getStoredUser, isAuthenticated } from '../auth/session'
import AppIcon from './brand/AppIcon.vue'
import BrandLogo from './brand/BrandLogo.vue'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const adoptionPortalUrl = import.meta.env.VITE_PERSONAL_URL || '/'
const isAuthRoute = computed(() => ['login', 'registro'].includes(route.name))

const privateLinks = [
  { name: 'dashboard', label: 'Inicio', icon: 'home' },
  { name: 'mascotas', label: 'Mascotas', icon: 'paw' },
  { name: 'mascota-nueva', label: 'Publicar mascota', icon: 'plus' },
  { name: 'solicitudes', label: 'Solicitudes', icon: 'list' },
  { name: 'mensajes', label: 'Mensajes', icon: 'chat' }
]

const TITLES = {
  dashboard: 'Inicio',
  mascotas: 'Mascotas publicadas',
  solicitudes: 'Solicitudes de adopción',
  'mascota-nueva': 'Publicar una mascota',
  mensajes: 'Mensajes',
  conversacion: 'Conversación'
}

// La sesión vive en localStorage: se vuelve a leer en cada navegación.
watch(() => route.fullPath, () => {
  user.value = isAuthenticated() ? getStoredUser() : null
}, { immediate: true })

const pageTitle = computed(() => {
  if (route.name === 'mascota-detalle') return 'Ficha de la mascota'
  if (route.name === 'mascota-editar') return 'Editar mascota'
  return TITLES[route.name] || 'Portal profesional'
})

const logout = () => {
  clearSession()
  user.value = null
  router.push({ name: 'login' })
}
</script>
