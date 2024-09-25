<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from '@/layout/NavBar.vue'
</script>

<template>
  <header>
    <NavBar/>
  </header>

  <main class="flex flex-col gap-6 2xl:gap-10 py-24">
    <RouterView />
  </main>
</template>

<style scoped>

</style>
