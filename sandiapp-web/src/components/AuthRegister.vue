<script setup>
// Importar componentes de otros paquetes y elementos de diseño (Archivos CSS, Iconos, etc.) en el orden respectivo
// Importar desde Vue, Vue-Router, Pinia en el orden respectivo
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
// Importar Stores
import { useAuthStore } from '@/stores';

// Definir contantes relacionadas al Vue-Router
const router = useRouter();

// Deifinir constantes relacionadas a los Stores
const authStore = useAuthStore();
const { register } = storeToRefs(authStore);

// Definir variables referenciales o reactivas
const isloading = ref(false);


// Definir funciones de redireccionamiento, normales, asincronicas y eventos en ese orden
/* Redirecciona a AuthLogin.vue */
const goToLogin = () => {
  router.push({ name: 'Login'})
}

/* Realiza el registro con las credenciales ingresadas en los inputs */
const Register = async () => {
  isloading.value = true;
  await authStore.Register().then(() => {
    isloading.value = false;
  })
};

</script>

<template>
  <!-- Lado derecho -->
  <div class="w-1/2 flex flex-col gap-2 justify-center items-center">
    <!-- Logo, titulo y descripción -->
    <div class="w-3/4 flex flex-col gap-1">
      <img 
        class="w-24 self-start"
        src="@/assets/images/Logo_monocroma.svg"
      />
      <h1 class="text-2xl">Da el primer paso para fortalecer la conexión con tus pacientes</h1>
      <h2 class="text-base">Completa el formulario y regístrate ahora</h2>
    </div>
  </div>
</template>