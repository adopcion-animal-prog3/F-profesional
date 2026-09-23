<template>
  <div class="app-shell">
    <nav class="top-nav">
      <router-link to="/login">Login</router-link>
      <router-link to="/registro">Registro</router-link>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/mascotas">Mascotas</router-link>
      <router-link to="/mascotas/1">Mascota 1</router-link>
    </nav>

    <router-view />
  </div>
</template>
