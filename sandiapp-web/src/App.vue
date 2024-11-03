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
    <main class="flex flex-col bg-light-beige max-w-full 2xl:gap-10 pb-21  mt-[90px]">
      <RouterView />
    </main>
  </template> 
</template>

<style scoped>

</style>
