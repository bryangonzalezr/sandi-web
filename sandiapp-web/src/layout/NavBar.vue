<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router'
import { storeToRefs } from "pinia";
import { useAuthStore, usePatientsStore } from '@/stores';
import AppButton from "@/common/AppButton.vue";
import LogoMonocromatic from '@/assets/images/Logo_monocroma.svg';

const patientStore = usePatientsStore()
const { firstPatient } = storeToRefs(patientStore);

const authStore = useAuthStore();
const authUser = localStorage.getItem('user')
const currentUser = JSON.parse(authUser.toString());

const Logout = () => {
  authStore.Logout();
}

const GetData = async () => {
  await patientStore.IndexPatient()
}

onMounted(() => {
  GetData(); 
})

const navLinks = [
  { text: 'Pacientes', to: { name: 'Patients' } },
  { text: 'Chats', to: { name: 'ChatPatients', params: { id: firstPatient }} },
  { text: 'Recetas', to: { name: 'ListRecipes' } },
  { text: 'Menús', to: { name: 'ListMenus' } },
  { text: 'Tarjeta de Contacto', to: { name: 'PublicProfile' } },
];
</script>

<template>
  <div class="topbar bg-[#FBF8F3] text-black border-b border-b-light-beige">
      <!-- Brand section -->
      <RouterLink to="/" class="topbar__brand">
        <img :src="LogoMonocromatic" alt="Logo Sandi" class="logo" />
      </RouterLink>
      
      
      <!-- Navigation links -->
      <div class="topbar__links ">
        <nav class="flex justify-start gap-20">
          <RouterLink 
            v-for="(link, index) in navLinks" 
            :key="index"
            :to="link.to"
            class="text-gray-600 hover:text-black text-lg font-bold relative nav-link"
            active-class="active-link"
          >
            {{ link.text }}
          </RouterLink>
        </nav>
      </div>

      
      
      <!-- User section -->
      <div class="topbar__session gap-20">
        <div class="user-info flex items-center gap-3">
          <font-awesome-icon :icon="['fas', 'circle-user']" class="user-icon text-2xl" />
          <span class="text-xl font-bold">
        {{ currentUser.name }}
          </span>
        </div>
        <AppButton
          text="Cerrar sesión"
          icons="fa-right-from-bracket"
          class="logout-button ml-12" 
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

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  font-size: 1.75rem;
  color: #000000; /* Adjusted color for better visibility */
}

.logout-button {
  @apply bg-[#EC9B98] text-[#DE3E3E] border-[#EC9B98] hover:border-[#DE3E3E]
         text-lg px-4 py-2 rounded-lg font-bold whitespace-nowrap;
}

.nav-link {
  @apply relative py-4;
  &::after {
    content: '';
    @apply absolute bottom-0 left-0 w-full h-1 bg-[#DE3E3E] transform scale-x-0 transition-transform duration-200;
  }
}

.active-link {
  @apply text-black font-bold;
  &::after {
    @apply scale-x-100;
  }
}

.nav-link:hover::after {
  @apply scale-x-100 bg-[#EC9B98];
}
</style>
