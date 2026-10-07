<template>
  <section class="adoption-request-form">
    <div class="selected-pet-card">
      <div class="selected-pet-avatar" :class="getPetTone(pet)">
        <span>{{ getPetInitials(pet.name) }}</span>
      </div>
      <div>
        <p class="eyebrow">Mascota seleccionada</p>
        <h2>{{ pet.name }}</h2>
        <p>{{ pet.species }} · {{ pet.breed }} · {{ pet.age }}</p>
      </div>
    </div>

    <form class="request-form" @submit.prevent="handleSubmit" novalidate>
      <div class="form-grid">
        <div class="field-group">
          <label for="adoptante-nombre">Nombre completo</label>
          <input
            id="adoptante-nombre"
            v-model.trim="form.name"
            type="text"
            autocomplete="name"
            placeholder="Tu nombre completo"
            :class="{ invalid: errors.name }"
            aria-describedby="adoptante-nombre-error"
          />
          <p v-if="errors.name" id="adoptante-nombre-error" class="field-error">
            {{ errors.name }}
          </p>
        </div>

        <div class="field-group">
          <label for="adoptante-correo">Correo electrónico</label>
          <input
            id="adoptante-correo"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            placeholder="usuario@ejemplo.com"
            :class="{ invalid: errors.email }"
            aria-describedby="adoptante-correo-error"
          />
          <p v-if="errors.email" id="adoptante-correo-error" class="field-error">
            {{ errors.email }}
          </p>
        </div>

        <div class="field-group field-full">
          <label for="adoptante-telefono">Teléfono</label>
          <input
            id="adoptante-telefono"
            v-model.trim="form.phone"
            type="tel"
            autocomplete="tel"
            placeholder="+54 0000 000000"
            :class="{ invalid: errors.phone }"
            aria-describedby="adoptante-telefono-error"
          />
          <p v-if="errors.phone" id="adoptante-telefono-error" class="field-error">
            {{ errors.phone }}
          </p>
        </div>

        <div class="field-group field-full">
          <label for="solicitud-mensaje">Mensaje</label>
          <textarea
            id="solicitud-mensaje"
            v-model.trim="form.message"
            rows="5"
            placeholder="Cuéntanos por qué deseas adoptar esta mascota"
            :class="{ invalid: errors.message }"
            aria-describedby="solicitud-mensaje-error"
          />
          <p v-if="errors.message" id="solicitud-mensaje-error" class="field-error">
            {{ errors.message }}
          </p>
        </div>
      </div>

      <div class="form-actions">
        <button class="primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando solicitud...' : 'Solicitar adopción' }}
        </button>
        <button class="secondary-button" type="button" @click="handleCancel" :disabled="isSubmitting">
          Cancelar
        </button>
      </div>

      <p v-if="submitError" class="form-error" role="alert">{{ submitError }}</p>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  pet: {
    type: Object,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  submitError: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['cancel', 'submit'])

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const errors = ref({})
const isReady = ref(false)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = () => {
  const nextErrors = {}

  if (!form.name.trim()) nextErrors.name = 'Introduce tu nombre completo.'
  if (!form.email.trim()) nextErrors.email = 'Introduce tu correo electrónico.'
  else if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Introduce un correo válido.'
  if (!form.phone.trim()) nextErrors.phone = 'Introduce un número de teléfono.'
  if (!form.message.trim()) nextErrors.message = 'Escribe un mensaje para la solicitud.'
  else if (form.message.trim().length < 10) nextErrors.message = 'El mensaje debe tener al menos 10 caracteres.'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const handleSubmit = () => {
  isReady.value = false

  if (!validate()) return

  isReady.value = true
  emit('submit', { ...form, petId: props.pet.id })
}

const handleCancel = () => emit('cancel')

const getPetInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const getPetTone = (pet) => {
  const species = (pet?.species || '').toLowerCase()

  if (species.includes('perro')) return 'tone-dog'
  if (species.includes('gato')) return 'tone-cat'
  if (species.includes('conejo')) return 'tone-rabbit'

  return 'tone-default'
}
</script>
