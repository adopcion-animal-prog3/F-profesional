<template>
  <section class="page-view auth-view">
    <div class="auth-card">
      <p class="auth-kicker">Registro</p>
      <h1>Crear cuenta</h1>
      <p class="auth-subtitle">Completa tus datos para registrarte.</p>

      <form class="login-form" @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="name">Nombre</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            placeholder="Tu nombre completo"
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            placeholder="usuario@ejemplo.com"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            autocomplete="new-password"
          />
        </div>

        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>
        <p v-else-if="successMessage" class="success-message" role="status">
          {{ successMessage }}
        </p>

        <button type="submit" class="primary-button">
          Crear cuenta
        </button>
      </form>

      <nav class="nav-links auth-links">
        <router-link to="/login">Volver al login</router-link>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')

const validateForm = () => {
  const { name, email, password, confirmPassword } = form

  if (!name.trim()) {
    throw new Error('El nombre es obligatorio.')
  }

  if (!email.trim()) {
    throw new Error('El email es obligatorio.')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    throw new Error('Introduce un email válido.')
  }

  if (!password) {
    throw new Error('La contraseña es obligatoria.')
  }

  if (!confirmPassword) {
    throw new Error('Debes confirmar la contraseña.')
  }

  if (password !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden.')
  }
}

const handleSubmit = () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    validateForm()
    successMessage.value = 'Formulario válido. Pendiente de envío al backend.'
    form.password = ''
    form.confirmPassword = ''
  } catch (error) {
    errorMessage.value = error.message || 'Revisa los campos del formulario.'
  }
}
</script>
