<template>
  <AuthShell
    :kicker="verification.pendingEmail.value ? 'Verificación' : 'Registro profesional'"
    :title="verification.pendingEmail.value ? 'Revisá tu correo' : 'Registrá tu refugio'"
    :subtitle="verification.pendingEmail.value
      ? 'Último paso: escribí el código que te enviamos para activar la cuenta.'
      : 'Para refugios, veterinarias y rescatistas que publican mascotas en adopción. Es gratis.'"
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
        <AuthField v-for="field in fields" :id="field.id" :key="field.id" v-model="form[field.id]"
          :label="field.label" :type="field.type" :autocomplete="field.autocomplete"
          :placeholder="field.placeholder" :disabled="isSubmitting" :trim="field.trim" />

        <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

        <button type="submit" class="primary-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="auth-switch">¿Ya tenés cuenta? <router-link to="/login">Iniciar sesión</router-link></p>
    </template>
  </AuthShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiRegister, getApiErrorMessage } from '../api/http'
import AuthField from '../components/AuthField.vue'
import AuthShell from '../components/AuthShell.vue'
import VerificationStep from '../components/VerificationStep.vue'
import { useEmailVerification } from '../composables/useEmailVerification'
import { validateRegisterForm } from '../utils/authValidation'

const router = useRouter()
const verification = useEmailVerification()

const fields = [
  { id: 'name', label: 'Nombre del refugio o veterinaria', type: 'text', autocomplete: 'organization', placeholder: 'Ej: Refugio Patitas', trim: true },
  { id: 'email', label: 'Correo electrónico', type: 'email', autocomplete: 'email', placeholder: 'refugio@ejemplo.com', trim: true },
  { id: 'password', label: 'Contraseña (mínimo 8 caracteres)', type: 'password', autocomplete: 'new-password', placeholder: '••••••••' },
  { id: 'confirmPassword', label: 'Repetí la contraseña', type: 'password', autocomplete: 'new-password', placeholder: '••••••••' }
]

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = validateRegisterForm(form)
  if (errorMessage.value) return

  isSubmitting.value = true
  try {
    const response = await apiRegister({ nombre: form.name.trim(), email: form.email.trim(), password: form.password })
    verification.startFrom(response)
    Object.assign(form, { password: '', confirmPassword: '' })
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
