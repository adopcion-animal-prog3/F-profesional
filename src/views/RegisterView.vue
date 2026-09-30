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
            :disabled="isSubmitting"
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
            :disabled="isSubmitting"
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
            :disabled="isSubmitting"
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
            :disabled="isSubmitting"
          />
        </div>

        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>
        <p v-else-if="successMessage" class="success-message" role="status">
          {{ successMessage }}
        </p>

        <button type="submit" class="primary-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}
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
import { useRouter } from 'vue-router'
import { apiRegister } from '../api/http'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

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

const handleSubmit = async () => {
  if (isSubmitting.value) return

  errorMessage.value = ''
  successMessage.value = ''

  try {
    validateForm()

    isSubmitting.value = true

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    }

    const response = await apiRegister(payload)
    successMessage.value = response?.data?.message || 'Usuario registrado correctamente.'

    form.name = ''
    form.email = ''
    form.password = ''
    form.confirmPassword = ''

    setTimeout(() => {
      router.push('/login')
    }, 1200)
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.message
    errorMessage.value = backendMessage || 'No se pudo completar el registro. Inténtalo de nuevo.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
