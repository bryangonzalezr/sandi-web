<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores';
import VueDatePicker from "@vuepic/vue-datepicker";
import AppButton from '@/common/AppButton.vue';
import AppInput from '@/common/AppInput.vue';
import AppSelect from '@/common/AppSelect.vue';

const router = useRouter();

const authStore = useAuthStore();

const sexo = {
  'Masculino': 'Masculino',
  'Femenino' : 'Femenino'
}

const civil_status = {
  'Soltero(a)': 'Soltero(a)',
  'Divorciad(a)': 'Divorciad(a)',
  'Casado(a)': 'Casado(a)',
  'Viudo(a)': 'Viudo(a)',
  'Conviviente civil': 'Conviviente civil'
}

const errorsForm = ref({});
const form = ref({});
const startDate = ref(new Date(Date.now()));
const isloading = ref(false);

/* Redirecciona a AuthLogin.vue */
const goToLogin = () => {
  router.push({ name: 'Login'})
}

const customPosition = () => ({ top: -100, left: 0 });

const setValue = (value) => {
  form.value[value] = event.target.value;
  delete errorsForm.value[value];
};

/* Realiza el registro con las credenciales ingresadas en los inputs */
const Register = async () => {
  try{
    isloading.value = true;
    await authStore.Register(form.value).then(() => {
      isloading.value = false;
    })
  }catch(error){
      errorsForm.value = error.response.data.errors;
  }
};



</script>

<template>
  <div class="w-screen content-center justify-items-center bg-light-beige">
  <div class="flex flex-col bg-mid-green self-center pt-10 pb-5 px-10 w-3/6 rounded-2xl">
    <!-- Titulo y descripción -->
    <h1 class="text-2xl mb-3 text-bold text-center">Estás a un paso de conectar con tus pacientes</h1>
    <h2 class="text-base mb-3 text-center">Completa el formulario y regístrate ahora</h2>
    <form 
      class="my-5" 
      @submit.prevent="Register(form)"
    >
      <div class="grid grid-cols-2 gap-x-3 mb-2">
        <AppInput
          type="text"
          v-model="form.name"
          label="Nombre:"
          placeholder="Nombre"
          :error="errorsForm.name ? true : false"
          :errorMessage="errorsForm.name"
          @update:modelValue="setValue('name')"
        />
        <AppInput
          type="text"
          v-model="form.last_name"
          label="Apellido:"
          placeholder="Apellido"
          :error="errorsForm.last_name ? true : false"
          :errorMessage="errorsForm.last_name"
          @update:modelValue="setValue('last_name')"
        />
      </div>
      <div class="grid grid-cols-2 gap-x-3 mb-2">
        <AppInput
          type="text"
          v-model="form.phone_number"
          label="Celular:"
          placeholder="Número"
          :error="errorsForm.phone_number ? true : false"
          :errorMessage="errorsForm.phone_number"
          @update:modelValue="setValue('phone_number')"
        />
        <div class="flex flex-col"> 
          <label class="text-sm">Cumpleaños:</label>
          <VueDatePicker
            input-class-name="font-Poppins"
            v-model="form.birthdate"
            placeholder="Seleccione una fecha"
            model-type="dd-MM-yyyy"
            locale="es"
            format="dd-MM-yyyy"
            cancel-text="Cancelar"
            select-text="Seleccionar"
            :enable-time-picker="false"
            :day-names="['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']"
            text-input
            :alt-position="customPosition"
            :state="errorsForm.birthdate ? false : null"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-3 mb-2">
        <AppSelect
          label="Sexo:"
          :options="sexo"
          firstOptionValue="Selecciona tu sexo"
          :disabledFirstOption='true' 
          :error="errorsForm.sex ? true : false"
          :errorMessage="errorsForm.sex"
          @update:selectedOption="setValue('sex')"
        />
        <AppSelect
          label="Estado Civil:"
          :options="civil_status"
          firstOptionValue="Selecciona tu estado civil"
          :disabledFirstOption='true' 
          :error="errorsForm.civil_status ? true : false"
          :errorMessage="errorsForm.civil_status"
          @update:selectedOption="setValue('civil_status')"
        />
      </div>
      <div class="mb-2">
        <AppInput
          type="text"
          v-model="form.email"
          label="Correo:"
          placeholder="Correo"s
          :error="errorsForm.email ? true : false"
          :errorMessage="errorsForm.email"
          @update:modelValue="setValue('email')"
        />
      </div>
      <div class="mb-2">
        <AppInput
          type="password"
          v-model="form.password"
          label="Contraseña:"
          placeholder="Contraseña"
          :error="errorsForm.password ? true : false"
          :errorMessage="errorsForm.password"
          @update:modelValue="setValue('password')"
        />
      </div>
      <div class="mb-2">
        <AppInput
          type="password"
          v-model="form.password_confirmation"
          label="Confirma tu contraseña:"
          placeholder="Ingresa nuevamente tu contraseña"
          :error="errorsForm.password_confirmation ? true : false"
          :errorMessage="errorsForm.password_confirmation"
          @update:modelValue="setValue('password_confirmation')"
        />
      </div>
      <div class="flex flex-col items-center justify-center mt-5">
        <AppButton 
          class="bg-dark-red border-0 m-3 text-white hover:bg-mid-red hover:border hover:border-dark-red hover:text-dark-red" 
          text="Registrarse"
          type="submit"          
        />
        <div class="text-sm mt-5">
          ¿Ya tienes cuenta?
          <RouterLink
            class="text-dark-red"
            to="/auth/login"
          >
            Inicia sesión
          </RouterLink>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<style lang="postcss">
.dp__input{
  font-family: 'Poppins';
  font-size: 16px;
  padding-right: 10px;
}
</style>