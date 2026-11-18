import { ref } from 'vue'
import { apiResendCode, apiVerifyCode, getApiErrorMessage } from '../api/http'
import { saveSession } from '../auth/session'

// Segundo paso de registro e inicio de sesión: validar el código enviado por correo.
export function useEmailVerification() {
  const pendingEmail = ref('')
  const errorMessage = ref('')
  const notice = ref('')
  const isSubmitting = ref(false)

  // Toma la respuesta del paso 1 (login o registro) y activa la pantalla del código.
  const startFrom = (response) => {
    const verificacion = response?.data?.data?.verificacion
    if (!verificacion?.email) throw new Error('La API no indicó cómo verificar tu correo.')
    pendingEmail.value = verificacion.email
    errorMessage.value = ''
    notice.value = ''
  }

  const verify = async (codigo) => {
    if (isSubmitting.value) return false
    isSubmitting.value = true
    errorMessage.value = ''
    try {
      const response = await apiVerifyCode({ email: pendingEmail.value, codigo })
      const session = response?.data?.data
      saveSession(session?.token, session?.user)
      return Boolean(session?.token)
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error, 'verify')
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const resend = async () => {
    errorMessage.value = ''
    notice.value = ''
    try {
      await apiResendCode(pendingEmail.value)
      notice.value = 'Te enviamos un código nuevo.'
      return true
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error)
      return false
    }
  }

  const cancel = () => {
    pendingEmail.value = ''
    errorMessage.value = ''
    notice.value = ''
  }

  return { pendingEmail, errorMessage, notice, isSubmitting, startFrom, verify, resend, cancel }
}
