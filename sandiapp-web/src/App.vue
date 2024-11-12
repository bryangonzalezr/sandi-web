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
    <div v-if="authStore.loadingPage" class="bg-light flex flex-col fixed top-0 left-0 z-40 w-screen h-screen justify-center items-center ">
      <img
        class="w-1/6 p-5 rounded-full animate-spin-slow"
        src="@/assets/images/Logo_instagram.svg"
      />
       <div class="text-2xl animate-blink">Cerrado sesión...</div>
    </div>
    <RouterView v-else/>
  </main>
</template>

<style scoped>

</style>
