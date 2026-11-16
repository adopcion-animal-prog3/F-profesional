<template>
  <section class="page-view auth-view">
    <div class="auth-card">
      <p class="auth-kicker">Registro</p>
      <h1>Crear cuenta</h1>
      <p class="auth-subtitle">Completa tus datos para registrarte.</p>

      <form class="login-form" @submit.prevent="handleSubmit" novalidate>
        <AuthField
          v-for="field in fields"
          :id="field.id"
          :key="field.id"
          v-model="form[field.id]"
          :label="field.label"
          :type="field.type"
          :autocomplete="field.autocomplete"
          :placeholder="field.placeholder"
          :disabled="isSubmitting"
          :trim="field.trim"
        />

        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
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
import { apiRegister, getApiErrorMessage } from '../api/http'
import AuthField from '../components/AuthField.vue'
import { validateRegisterForm } from '../utils/authValidation'
import { runWithSuccessMessage } from '../utils/successMessage'

const router = useRouter()

const fields = [
  { id: 'name', label: 'Nombre', type: 'text', autocomplete: 'name', placeholder: 'Tu nombre completo', trim: true },
  { id: 'email', label: 'Correo electrónico', type: 'email', autocomplete: 'email', placeholder: 'usuario@ejemplo.com', trim: true },
  { id: 'password', label: 'Contraseña', type: 'password', autocomplete: 'new-password', placeholder: '••••••••' },
  {
    id: 'confirmPassword',
    label: 'Confirmar contraseña',
    type: 'password',
    autocomplete: 'new-password',
    placeholder: 'Repite tu contraseña'
  }
]

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const isSubmitting = ref(false)

const validateForm = () => {
  const validationError = validateRegisterForm(form)
  if (validationError) throw new Error(validationError)
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  errorMessage.value = ''

  try {
    validateForm()

    isSubmitting.value = true

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    }

    await runWithSuccessMessage(
      () => apiRegister(payload),
      'Cuenta creada correctamente.'
    )

    form.name = ''
    form.email = ''
    form.password = ''
    form.confirmPassword = ''

    router.push('/login')
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
