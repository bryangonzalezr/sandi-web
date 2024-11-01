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
  <!-- Lado derecho -->
  <div class="w-2/3 flex flex-col gap-2 justify-center items-center">
    <!-- Logo, titulo y descripción -->
    <div class="w-3/4 flex flex-col gap-1">
      <img 
        class="w-1/3 self-center"
        src="@/assets/images/Logo_monocroma.svg"
      />
      <h1 class="text-xl">Estás a un paso de conectar con tus pacientes</h1>
      <h2 class="text-base">Completa el formulario y regístrate ahora</h2>
    </div>
    <form 
      class="w-3/4" 
      @submit.prevent="Register(form)"
    >
      <div class="grid grid-cols-2 gap-x-2">
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
      <div class="grid grid-cols-2 gap-x-2">
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
      <div class="grid grid-cols-2 gap-x-2">
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
      <AppInput
        type="text"
        v-model="form.email"
        label="Correo:"
        placeholder="Correo"s
        :error="errorsForm.email ? true : false"
        :errorMessage="errorsForm.email"
        @update:modelValue="setValue('email')"
      />
      <AppInput
        type="password"
        v-model="form.password"
        label="Contraseña:"
        placeholder="Contraseña"
        :error="errorsForm.password ? true : false"
        :errorMessage="errorsForm.password"
        @update:modelValue="setValue('password')"
      />
      <AppInput
        type="password"
        v-model="form.password_confirmation"
        label="Confirma tu contraseña:"
        placeholder="Ingresa nuevamente tu contraseña"
        :error="errorsForm.password_confirmation ? true : false"
        :errorMessage="errorsForm.password_confirmation"
        @update:modelValue="setValue('password_confirmation')"
      />
      <div class="flex justify-center m-2">
        <AppButton 
          class="bg-bold-red border-0 text-white hover:bg-white hover:border hover:border-bold-red hover:text-bold-red" 
          text="Registrarse"
          type="submit"          
        />
      </div>
    </form>
  </div>
</template>

<style lang="postcss">
.dp__input{
  font-family: 'Poppins';
  font-size: 16px;
  padding-right: 10px;
}
</style>