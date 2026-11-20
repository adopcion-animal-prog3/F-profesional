<template>
  <form class="login-form" novalidate @submit.prevent="submit">
    <div class="verification-intro">
      <AppIcon name="mail" :size="28" />
      <p>
        Te enviamos un código de 6 números a <strong>{{ email }}</strong>.
        Revisá tu bandeja de entrada (y el correo no deseado).
      </p>
    </div>

    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
    <p v-if="notice" class="success-message" role="status">{{ notice }}</p>

    <div class="field-group">
      <label for="codigo">Código de verificación</label>
      <input
        id="codigo"
        :value="code"
        class="code-input"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="6"
        placeholder="000000"
        @input="code = $event.target.value.replace(/\D/g, '').slice(0, 6); $event.target.value = code"
      />
    </div>

    <button type="submit" class="primary-button" :disabled="isSubmitting || code.length !== 6">
      {{ isSubmitting ? 'Verificando...' : 'Confirmar código' }}
    </button>

    <div class="verification-links">
      <button type="button" class="link-button" :disabled="secondsLeft > 0" @click="handleResend">
        {{ secondsLeft > 0 ? `Reenviar código en ${secondsLeft} s` : 'Reenviar código' }}
      </button>
      <button type="button" class="link-button" @click="$emit('cancel')">Usar otro correo</button>
    </div>
  </form>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import AppIcon from './brand/AppIcon.vue'

const RESEND_SECONDS = 60

const props = defineProps({
  email: { type: String, required: true },
  verify: { type: Function, required: true },
  resend: { type: Function, required: true },
  isSubmitting: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  notice: { type: String, default: '' }
})
const emit = defineEmits(['verified', 'cancel'])

const code = ref('')
const secondsLeft = ref(RESEND_SECONDS)
let timer = null

const startCountdown = () => {
  clearInterval(timer)
  secondsLeft.value = RESEND_SECONDS
  timer = setInterval(() => {
    secondsLeft.value -= 1
    if (secondsLeft.value <= 0) clearInterval(timer)
  }, 1000)
}

const submit = async () => {
  if (code.value.length === 6 && (await props.verify(code.value))) emit('verified')
}

const handleResend = async () => {
  if (await props.resend()) startCountdown()
}

startCountdown()
onBeforeUnmount(() => clearInterval(timer))
</script>
