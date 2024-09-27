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
  <!-- <IonPage>
    <IonContent>
      <template v-if="!isloading">
        <IonGrid class="grid justify-center content-center items-center h-screen w-screen">
          <IonTitle class="pb-5 text-center">Registrar un nuevo usuario</IonTitle>
          <IonItem>
            <IonInput v-model="register.name" label="Nombre" label-placement="stacked" type="text" placeholder="Ingrese su nombre"></IonInput>
            <IonInput v-model="register.last_name" label="Apellido" label-placement="stacked" type="text" placeholder="Ingrese su apellido"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput v-model="register.email" label="Correo" label-placement="stacked" type="text" placeholder="Ingrese su correo"></IonInput>
            <IonInput v-model="register.phone_number" label="Número de telefono" label-placement="stacked" type="text" placeholder="Ingrese su número"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput v-model="register.password" label="Contraseña" label-placement="stacked" type="text" placeholder="Ingrese su contraseña"></IonInput>
            <IonInput v-model="register.password_confirmation" label="Confirmar contraseña" label-placement="stacked" type="text" placeholder="Confirme su contraseña"></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect v-model="register.sex" label="Sexo" label-placement="stacked" placeholder="Selecciona tu sexo">
              <IonSelectOption value="Masculino">Masculino</IonSelectOption>
              <IonSelectOption value="Femenino">Femenino</IonSelectOption>
            </IonSelect>
            <IonSelect v-model="register.civil_status" label="Estado civil" label-placement="stacked" placeholder="Selecciona tu estado">
              <IonSelectOption value="Soltero(a)">Soltero(a)</IonSelectOption>
              <IonSelectOption value="Divorciad(a)">Divorciad(a)</IonSelectOption>
              <IonSelectOption value="Viudo(a)">Viudo(a)</IonSelectOption>
              <IonSelectOption value="Casado(a)">Casado(a)</IonSelectOption>
              <IonSelectOption value="Conviviente civil">Conviviente civil</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput v-model="register.birthdate" label="Fecha de nacimiento" label-placement="stacked" type="date"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput v-model="register.objectives" label="Objetivos" label-placement="stacked"  placeholder="Ingresa tus objetivos"></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect v-model="register.role" label="Rol" label-placement="stacked" placeholder="Ingresa rol">
              <IonSelectOption value="nutricionista">Nutricionista</IonSelectOption>
              <IonSelectOption value="usuario_basico">Usuario</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonButton @click="Register()" class="px-20 pt-5">Registrar</IonButton>
          <IonButton @click="goToLogin()" class="px-20 pt-5">Cancelar</IonButton>
        </IonGrid>
      </template>
      <template v-else>
        <IonSpinner color="success"></IonSpinner>
      </template>
    </IonContent>
  </IonPage> -->
</template>