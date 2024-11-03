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
  <main :class="authStore.shouldDisplayHeader ? 'flex flex-col bg-light-beige max-w-full 2xl:gap-10 pb-21  mt-[90px]' : ''">
    <RouterView />
  </main>
</template>

<style scoped>

</style>
