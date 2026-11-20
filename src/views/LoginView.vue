<template>
  <AuthShell
    :kicker="verification.pendingEmail.value ? 'Verificación' : 'Portal profesional'"
    :title="verification.pendingEmail.value ? 'Revisá tu correo' : 'Iniciar sesión'"
    :subtitle="verification.pendingEmail.value
      ? 'Último paso: escribí el código que te enviamos.'
      : 'Ingresá con tu correo y contraseña. Te enviaremos un código para confirmar que sos vos.'"
  >
    <VerificationStep
      v-if="verification.pendingEmail.value"
      :email="verification.pendingEmail.value"
      :verify="verification.verify"
      :resend="verification.resend"
      :is-submitting="verification.isSubmitting.value"
      :error-message="verification.errorMessage.value"
      :notice="verification.notice.value"
      @verified="router.push('/dashboard')"
      @cancel="verification.cancel"
    />

    <template v-else>
      <form class="login-form" novalidate @submit.prevent="handleSubmit">
        <AuthField id="email" v-model="form.email" label="Correo electrónico" type="email"
          autocomplete="email" placeholder="refugio@ejemplo.com" :disabled="isSubmitting" trim />
        <AuthField id="password" v-model="form.password" label="Contraseña" type="password"
          autocomplete="current-password" placeholder="••••••••" :disabled="isSubmitting" />

        <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

        <button type="submit" class="primary-button" :disabled="isSubmitting || !isFormValid">
          {{ isSubmitting ? 'Enviando código...' : 'Continuar' }}
        </button>
      </form>

      <p class="auth-switch">
        ¿Todavía no tenés cuenta? <router-link to="/registro">Registrá tu refugio</router-link>
      </p>
    </template>
  </AuthShell>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiLogin, getApiErrorMessage } from '../api/http'
import AuthField from '../components/AuthField.vue'
import AuthShell from '../components/AuthShell.vue'
import VerificationStep from '../components/VerificationStep.vue'
import { useEmailVerification } from '../composables/useEmailVerification'
import { validateLoginForm } from '../utils/authValidation'

const router = useRouter()
const verification = useEmailVerification()
const form = reactive({ email: '', password: '' })
const errorMessage = ref('')
const isSubmitting = ref(false)

const isFormValid = computed(() => form.email.trim().length > 0 && form.password.trim().length > 0)

// Paso 1: valida la contraseña; la API responde enviando un código al correo.
const handleSubmit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = validateLoginForm(form)
  if (errorMessage.value) return

  isSubmitting.value = true
  try {
    const response = await apiLogin({ email: form.email.trim(), password: form.password })
    verification.startFrom(response)
    form.password = ''
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'login')
  } finally {
    isSubmitting.value = false
  }
}
</script>
