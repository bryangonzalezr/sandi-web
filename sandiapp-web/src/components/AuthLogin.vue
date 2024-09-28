<script setup>
// Importar desde Vue, Vue-Router, Pinia en el orden respectivo 
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
// Importar Stores
import { useAuthStore } from "@/stores";
//Importar paquetes de diseño o elementos visuales
//Importar componentes
import AppButton from '@/common/AppButton.vue';

// Definir contantes relacionadas al Vue-Router
// Deifinir constantes relacionadas a los Stores
const authStore = useAuthStore();

// Definir variables referenciales o reactivas
const errorsForm = ref({});
const form = ref({
  email: '',
  password: ''
});

// Definir funciones de redireccionamiento, normales, asincronicas y eventos en ese orden
/* Realiza login con las credenciales ingresadas en los inputs */
const Login = async () => {
  try{
      await authStore.Login(form.value)
      form.value = {
        email: '',
        password: ''
      }
    }catch(error){
      errorsForm.value = error.response.data.errors;
      console.log(errorsForm.value)
    }
}

const setValue = (value) => {
  delete errorsForm.value[value];
};
</script>

<template>
  <!-- Lado derecho -->
  <div class="w-1/2 flex flex-col gap-2 justify-center items-center">
    <!-- Logo, titulo y descripción -->
    <div class="w-1/2 flex flex-col gap-1">
      <img 
        class="w-1/2 self-center"
        src="@/assets/images/Logo_monocroma.svg"
      />
      <h1 class="text-2xl">Inicia sesión en tu Cuenta</h1>
      <h2 class="text-base">Gestiona a tus pacientes</h2>
    </div>
    <!--Formulario para iniciar sesión-->
    <form 
      class="w-1/2" 
      @submit.prevent="Login(form)"
    >
      <div class="flex flex-col">
        <label class="text-sm">Correo:</label>
        <input
          class="p-1 rounded"
          :class="errorsForm.email ? 'border border-bold-red': ''"
          id="email"
          v-model="form.email"
          type="text"
          name="email"
          placeholder="Ingresa tu correo"
          @change="setValue('email')"
        />
        <p v-if="errorsForm.email" class="text-xs text-bold-red flex gap-1 items-center">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
          {{ errorsForm.email[0] }}
        </p>
      </div>
      <div class="flex flex-col">
        <label class="text-sm">Contraseña:</label>
        <input
          class="p-1 rounded"
          :class="errorsForm.password ? 'border border-bold-red': ''"
          id="password"
          v-model="form.password"
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          @change="setValue('password')"
        />
        <p v-if="errorsForm.password" class="text-xs text-bold-red flex gap-1 items-center">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
          {{ errorsForm.password[0] }}
        </p>
      </div>
    
      <div class="flex justify-center m-2">
        <AppButton 
          class="bg-bold-red border-0 text-white hover:bg-white hover:border hover:border-bold-red hover:text-bold-red" 
          text="Ingresar"
          type="submit"          
        />
      </div>
    </form>
    <!-- Redirección para crear una cuenta -->
    <div class="text-sm">
        ¿No tienes cuenta?
        <RouterLink
          class="text-bold-red"
          to="/auth/registro"
        >
          Crear una cuenta
        </RouterLink>
      </div>
  </div>
  
</template>