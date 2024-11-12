<script setup>
// Importar desde Vue, Vue-Router, Pinia en el orden respectivo 
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
// Importar Stores
import { useAuthStore } from "@/stores";
//Importar paquetes de diseño o elementos visuales
import Swal from "sweetalert2";
//Importar componentes
import AppButton from '@/common/AppButton.vue';
import AppInput from '@/common/AppInput.vue';

// Definir contantes relacionadas al Vue-Router
// Definir constantes relacionadas a los Stores
const authStore = useAuthStore();

// Definir variables referenciales o reactivas
const errorsForm = ref({});
const form = ref({});
const loading = ref(false);

// Definir funciones de redireccionamiento, normales, asincronicas y eventos en ese orden
const setValue = (value) => {
  form.value[value] = event.target.value;
  delete errorsForm.value[value];
};

/* Realiza login con las credenciales ingresadas en los inputs */
const Login = async () => {
  try{
      loading.value = true;
      await authStore.Login(form.value)
      form.value = {
        email: '',
        password: ''
      }
    }catch(error){
      console.log('error', error)
      loading.value = false;
      if(error.response.data.errors){
        errorsForm.value = error.response.data.errors;
      }else{
        Swal.fire({
          title: error.response.data.message == 'Invalid Credentials' ? 'Credenciales invalidas' : 'Error',
          text: error.response.data.message == 'Invalid Credentials' ? 'Intenta nuevamente' : error.response.data.message,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          heightAuto: false,
        });
      }
      loading.value = false;
    }
}
</script>

<template>
  <div v-if="loading" class="bg-light flex flex-col fixed top-0 left-0 z-40 w-screen h-screen justify-center items-center ">
    <img
      class="w-1/6 p-5 rounded-full animate-spin-slow"
      src="@/assets/images/Logo_instagram.svg"
    />
     <div class="text-2xl animate-blink">Iniciando sesión...</div>
  </div>
  <div class="flex flex-col items-center bg-light">
    <!-- Logo, titulo y descripción -->
    <div class="flex flex-col items-center">
      <img 
        class="w-1/4 my-16"
        src="@/assets/images/Logo_color_inicio.svg"
      />
      <h1 class="text-3xl font-extrabold mb-3">Inicia sesión en tu cuenta</h1>
      <h2 class="text-base text-dark-brown mb-3">Gestiona a tus pacientes</h2>
    </div>
    <!--Formulario para iniciar sesión-->
    <form 
      class="flex flex-col gap-5 w-1/4" 
      @submit.prevent="Login()"
    >
      <AppInput
        type="text"
        v-model="form.email"
        label=""
        placeholder="Correo"
        :error="errorsForm.email ? true : false"
        :errorMessage="errorsForm.email"
        @update:modelValue="setValue('email')"
        @keypress.enter="Login()"
      />
      <AppInput
        type="password"
        v-model="form.password"
        label=""
        placeholder="Contraseña"
        :error="errorsForm.password ? true : false"
        :errorMessage="errorsForm.password"
        @update:modelValue="setValue('password')"
        @keypress.enter="Login()"
      />
  
      <div class="flex justify-center m-3">
        <AppButton 
          class="bg-dark-red border-0 text-white hover:bg-mid-red hover:border hover:border-dark-red hover:text-dark-red" 
          text="Ingresar"
          type="submit"          
        />
      </div>
    </form>
    <!-- Redirección para crear una cuenta -->
    <div class="text-sm mt-5">
        ¿No tienes cuenta?
        <RouterLink
          class="text-dark-red"
          to="/auth/registro"
        >
          Crear una cuenta
        </RouterLink>
    </div>

  </div>
  
</template>