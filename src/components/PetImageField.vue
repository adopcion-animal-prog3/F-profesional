<template>
  <div class="field-group field-full pet-image-field">
    <label for="pet-imagen">Foto de la mascota</label>

    <div class="pet-image-picker">
      <img v-if="modelValue" :src="modelValue" alt="Vista previa de la foto" class="pet-image-preview" />
      <div v-else class="pet-image-preview pet-image-empty" aria-hidden="true">Sin foto</div>

      <div class="pet-image-controls">
        <input
          id="pet-imagen"
          type="file"
          :accept="IMAGE_TYPES.join(',')"
          :disabled="isProcessing"
          @change="handleFile"
        />
        <small>JPG, PNG, WEBP o GIF. Se reduce automáticamente antes de subirla.</small>
        <button
          v-if="modelValue"
          class="secondary-button small-button"
          type="button"
          :disabled="isProcessing"
          @click="$emit('update:modelValue', null)"
        >
          Quitar foto
        </button>
        <p v-if="isProcessing" role="status">Procesando imagen...</p>
        <small v-if="error" class="field-error" role="alert">{{ error }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { IMAGE_TYPES, prepareImage } from '../utils/imageFile'

defineProps({
  modelValue: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue'])
const error = ref('')
const isProcessing = ref(false)

const handleFile = async (event) => {
  const [file] = event.target.files || []
  if (!file) return

  error.value = ''
  isProcessing.value = true
  try {
    emit('update:modelValue', await prepareImage(file))
  } catch (imageError) {
    error.value = imageError.message
  } finally {
    isProcessing.value = false
    event.target.value = ''
  }
}
</script>
