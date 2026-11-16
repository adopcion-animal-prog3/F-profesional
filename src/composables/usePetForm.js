import { reactive, ref } from 'vue'
import { createEmptyPetForm, validatePetForm } from '../utils/petForm'
import { useAsyncAction } from './useAsyncAction'

// Estado y envío del formulario de mascota, compartido por alta y edición.
export function usePetForm() {
  const form = reactive(createEmptyPetForm())
  const errors = ref({})
  const submitMessage = ref('')
  const { isRunning: isSubmitting, errorMessage, run } = useAsyncAction()

  const submit = async ({ save, successMessage, fallbackError, onSaved }) => {
    if (isSubmitting.value) return

    errors.value = validatePetForm(form)

    if (Object.keys(errors.value).length > 0) {
      submitMessage.value = 'Corrige los campos marcados para continuar.'
      return
    }

    submitMessage.value = ''
    const saved = await run({
      operation: () => save({ ...form, age: Number(form.age) }),
      successMessage,
      fallbackError
    })

    if (saved) onSaved()
    else submitMessage.value = errorMessage.value
  }

  return { form, errors, submitMessage, isSubmitting, submit }
}
