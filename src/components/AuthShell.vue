<template>
  <div class="auth-shell">
    <aside class="auth-aside" aria-hidden="true">
      <div class="auth-aside-brand">
        <BrandLogo :size="48" background="#ffffff" foreground="#15803d" />
        <div>
          <strong>Huellitas</strong>
          <span>Portal profesional</span>
        </div>
      </div>
      <HeroIllustration />
      <p>Publicá las mascotas de tu refugio o veterinaria y encontrales una familia.</p>
    </aside>

    <section class="auth-card" :aria-label="title">
      <p class="eyebrow">{{ kicker }}</p>
      <h1>{{ title }}</h1>
      <p class="auth-subtitle">{{ subtitle }}</p>
      <slot />
      <p class="auth-portal-note">
        ¿Querés adoptar? <a :href="adoptionPortalUrl">Ingresá al portal de adopción</a>.
      </p>
    </section>
  </div>
</template>

<script setup>
import BrandLogo from './brand/BrandLogo.vue'
import HeroIllustration from './brand/HeroIllustration.vue'

defineProps({
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true }
})

const adoptionPortalUrl = import.meta.env.VITE_PERSONAL_URL || '/'
</script>
