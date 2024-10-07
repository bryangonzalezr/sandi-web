<script setup>
import { computed } from "vue";
import { useRoute, RouterView } from 'vue-router'
import NavBar from '@/layout/NavBar.vue'

const route = useRoute();

const excludedRoutes = ["Login", "Register"];

const isExcludedRoute = computed(() =>
  excludedRoutes.some(
    (excludedRoute) => route.name?.includes(excludedRoute) === true
  )
);
</script>

<template>
  <template v-if="isExcludedRoute">
    <RouterView />
  </template>
  <template v-else>
    <header>
      <NavBar/>
    </header>
    <main class="bg-pink-200 flex flex-col gap-6 2xl:gap-10 py-24">
      <RouterView />
    </main>
  </template> 
</template>

<style scoped>

</style>
