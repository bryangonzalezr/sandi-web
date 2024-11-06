<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores';
import NavBar from '@/layout/NavBar.vue'

const authStore = useAuthStore();
</script>

<template>
  <template v-if="authStore.shouldDisplayHeader">
    <header>
      <NavBar/>
    </header>
  </template>
  <main :class="authStore.shouldDisplayHeader ? 'bg-light w-full pt-[90px]' : ''">
    <RouterView />
  </main>
</template>

<style scoped>

</style>
