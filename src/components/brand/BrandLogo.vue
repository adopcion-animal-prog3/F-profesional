<template>
  <svg :width="size" :height="size" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" :fill="background" />
    <g :fill="foreground">
      <ellipse cx="16" cy="17" rx="3.6" ry="4.6" />
      <ellipse cx="32" cy="17" rx="3.6" ry="4.6" />
      <ellipse cx="10.5" cy="25" rx="3.2" ry="4" />
      <ellipse cx="37.5" cy="25" rx="3.2" ry="4" />
      <path d="M24 24c-5.5 0-10 6-10 10 0 3 2.4 4 4.6 4 2.4 0 3.6-1.4 5.4-1.4s3 1.4 5.4 1.4c2.2 0 4.6-1 4.6-4 0-4-4.5-10-10-10z" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 40 },
  background: { type: String, default: '#15803d' },
  foreground: { type: String, default: '#ffffff' }
})
</script>
