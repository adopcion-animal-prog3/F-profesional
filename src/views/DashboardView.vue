<template>
  <section class="dashboard-view">
    <div class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Bienvenida</p>
        <h2>Hola{{ user?.nombre ? `, ${user.nombre}` : '' }} 👋</h2>
        <p>
          Desde acá publicás las mascotas de tu refugio, respondés a las personas interesadas
          y aprobás las adopciones.
        </p>
        <router-link class="primary-button big-button" :to="{ name: 'mascota-nueva' }">
          <AppIcon name="plus" /> Publicar una mascota
        </router-link>
      </div>
      <HeroIllustration />
    </div>

    <h2 class="section-title">¿Qué querés hacer?</h2>
    <div class="action-grid">
      <router-link v-for="action in actions" :key="action.name" class="action-card" :to="{ name: action.name }">
        <span class="action-icon"><AppIcon :name="action.icon" :size="26" /></span>
        <strong>{{ action.title }}</strong>
        <span>{{ action.text }}</span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { getStoredUser } from '../auth/session'
import AppIcon from '../components/brand/AppIcon.vue'
import HeroIllustration from '../components/brand/HeroIllustration.vue'

const user = getStoredUser()

const actions = [
  { name: 'mascota-nueva', icon: 'camera', title: 'Publicar mascota', text: 'Cargá sus datos y una foto para que la vean los adoptantes.' },
  { name: 'mascotas', icon: 'paw', title: 'Ver mascotas', text: 'Revisá, editá o eliminá las mascotas que publicaste.' },
  { name: 'solicitudes', icon: 'heart', title: 'Solicitudes', text: 'Aprobá o rechazá los pedidos de adopción que recibiste.' },
  { name: 'mensajes', icon: 'chat', title: 'Mensajes', text: 'Respondé las consultas de las personas interesadas.' }
]
</script>
