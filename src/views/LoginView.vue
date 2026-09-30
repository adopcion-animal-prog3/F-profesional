<template>
  <section class="page-view auth-view">
    <div class="auth-card">
      <p class="auth-kicker">Acceso</p>
      <h1>Iniciar sesión</h1>
      <p class="auth-subtitle">Introduce tus credenciales para continuar.</p>

      <form class="login-form" @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            placeholder="usuario@ejemplo.com"
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            :disabled="isSubmitting"
          />
        </div>

        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>
        <p v-else-if="successMessage" class="success-message" role="status">
          {{ successMessage }}
        </p>

        <button type="submit" class="primary-button" :disabled="isSubmitting || !isFormValid">
          {{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>
      </form>

      <nav class="nav-links auth-links">
        <router-link to="/registro">Ir a registro</router-link>
        <router-link to="/dashboard">Ir al dashboard</router-link>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiLogin } from '../api/http'
import { saveSession } from '../auth/session'

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return form.email.trim().length > 0 && form.password.trim().length > 0
})

const validateForm = () => {
  const email = form.email.trim()
  const password = form.password.trim()

  if (!email || !password) {
    throw new Error('Debes completar todos los campos.')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Introduce un correo electrónico válido.')
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
      email: form.email.trim(),
      password: form.password
    }

    const response = await apiLogin(payload)
    const token = response?.data?.token
    const user = response?.data?.user || null

    saveSession(token, user)
    successMessage.value = response?.data?.message || 'Inicio de sesión correcto.'
    form.password = ''

    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  } catch (error) {
    const fallbackMessage =
      error?.response?.data?.message ||
      error?.message ||
      'No fue posible iniciar sesión. Inténtalo de nuevo.'

    errorMessage.value = fallbackMessage
  } finally {
    isSubmitting.value = false
  }
}
</script>
