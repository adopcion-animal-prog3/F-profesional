<template>
  <div class="success-toast-container">
    <Transition name="toast">
      <div
        v-if="successMessage"
        class="success-message success-toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span>{{ successMessage }}</span>
        <button type="button" aria-label="Cerrar mensaje de éxito" @click="clearSuccessMessage">
          Cerrar
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { clearSuccessMessage, successMessage } from '../utils/successMessage'
</script>

<style scoped>
.success-toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  width: min(28rem, calc(100vw - 2rem));
  pointer-events: none;
}

.success-toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  pointer-events: auto;
  box-shadow: 0 8px 24px rgb(15 23 42 / 14%);
}

.success-toast button {
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
