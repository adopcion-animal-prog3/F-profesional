<template>
  <AppLayout>
    <router-view />
  </AppLayout>
  <SuccessMessage />
</template>

<script setup>
import AppLayout from './components/AppLayout.vue'
import SuccessMessage from './components/SuccessMessage.vue'
</script>
