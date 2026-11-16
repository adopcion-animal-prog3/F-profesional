<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="updateValue"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: 'off' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  trim: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  const value = event.target.value
  emit('update:modelValue', props.trim ? value.trim() : value)
}
</script>
