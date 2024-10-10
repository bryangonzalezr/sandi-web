<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router'
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/stores";

// COMPONENTES
import AppButton from "@/common/AppButton.vue";
import { usePatientsStore } from '@/stores';

const patientStore = usePatientsStore()

const { firstPatient } = storeToRefs(usePatientsStore());

const authStore = useAuthStore();

const Logout = () => {
  authStore.Logout();
}

const GetData = async () => {
  await patientStore.IndexPatient()
}

onMounted(() => {
  GetData(); 
})

</script>

<template>
    <!-- MENU VISTA DESKTOP -->
    <div class="topbar bg-warm-beige text-black">
        <!-- Titulo y Logo aplicacion -->
        <RouterLink to="/">
          <div class="topbar__brand">
            <img src="@/assets/images/Logo_color.svg" alt="logo" />
          </div>
        </RouterLink>
        <!-- Lista de navegación -->
        <div class="topbar__links">
          <nav class="flex justify-start gap-7">
            <RouterLink to="/">Pacientes</RouterLink>
            <RouterLink :to="{ name: 'ChatPatients', params: { id: firstPatient }}">Chats</RouterLink>
            <RouterLink to="/about">About</RouterLink>
            <RouterLink to="/listrecipes">Mis Recetas</RouterLink>
            <RouterLink to="/listmenus">Mis Menús</RouterLink>
          </nav>
        </div>
        <!-- Sesión activa y boton de logout -->
        <div class="topbar__session">
          <div class="flex justify-center items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-circle-user" />
            <span>Nombre</span>
          </div>
          <AppButton
            text="Salir"
            icons="fa-right-from-bracket"
            @click="Logout()"
          />
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.topbar {
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr 0.5fr;
    &__brand {
      align-items: center;
      justify-content: center;
      justify-items: center;
      padding: 0.625rem 0rem 0.625rem 1.875rem;
      font-size: 13px;
      color: white;
      img {
        max-height: 4.375rem;
      }
    }
    &__links {
      position: relative;
      display: grid;
      align-items: center;
    }
    &__session {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 0 15px;
    }
}

</style>