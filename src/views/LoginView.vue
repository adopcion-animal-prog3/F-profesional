<template>
  <section class="page-view auth-view">
    <div class="auth-card">
      <p class="auth-kicker">Acceso</p>
      <h1>Iniciar sesión</h1>
      <p class="auth-subtitle">Introduce tus credenciales para continuar.</p>

      <form class="login-form" @submit.prevent="handleSubmit" novalidate>
        <AuthField
          id="email"
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          autocomplete="email"
          placeholder="usuario@ejemplo.com"
          :disabled="isSubmitting"
          trim
        />
        <AuthField
          id="password"
          v-model="form.password"
          label="Contraseña"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          :disabled="isSubmitting"
        />

        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
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
import { apiLogin, getApiErrorMessage } from '../api/http'
import { saveSession } from '../auth/session'
import AuthField from '../components/AuthField.vue'
import { validateLoginForm } from '../utils/authValidation'
import { runWithSuccessMessage } from '../utils/successMessage'

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return form.email.trim().length > 0 && form.password.trim().length > 0
})

const validateForm = () => {
  const validationError = validateLoginForm(form)
  if (validationError) throw new Error(validationError)
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  errorMessage.value = ''

  try {
    validateForm()

    isSubmitting.value = true

    const payload = {
      email: form.email.trim(),
      password: form.password
    }

    await runWithSuccessMessage(async () => {
      const response = await apiLogin(payload)
      const token = response?.data?.token
      const user = response?.data?.user || null

      saveSession(token, user)
      form.password = ''
    }, 'Inicio de sesión correcto.')

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'login')
  } finally {
    isSubmitting.value = false
  }
}
</script>
