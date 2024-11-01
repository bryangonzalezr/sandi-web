<script setup>
// Importar desde Vue, Vue-Router, Pinia en el orden respectivo 
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
// Importar Stores
import { useAuthStore } from "@/stores";
//Importar paquetes de diseño o elementos visuales
//Importar componentes
import AppButton from '@/common/AppButton.vue';
import AppInput from '@/common/AppInput.vue';

// Definir contantes relacionadas al Vue-Router
// Definir constantes relacionadas a los Stores
const authStore = useAuthStore();

// Definir variables referenciales o reactivas
const errorsForm = ref({});
const form = ref({});

// Definir funciones de redireccionamiento, normales, asincronicas y eventos en ese orden
const setValue = (value) => {
  form.value[value] = event.target.value;
  delete errorsForm.value[value];
};

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
    }
}
</script>

<template>
  <!-- Lado derecho -->
  <div class="w-2/3 flex flex-col gap-2 justify-center items-center">
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
      @submit.prevent="Login()"
    >
      <AppInput
        type="text"
        v-model="form.email"
        label="Correo:"
        placeholder="Ingresa tu correo"s
        :error="errorsForm.email ? true : false"
        :errorMessage="errorsForm.email"
        @update:modelValue="setValue('email')"
      />
      <AppInput
        type="password"
        v-model="form.password"
        label="Contraseña:"
        placeholder="Ingresa tu contraseña"
        :error="errorsForm.password ? true : false"
        :errorMessage="errorsForm.password"
        @update:modelValue="setValue('password')"
      />

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