<script setup> 
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';

const router = useRouter();

const authStore = useAuthStore();

const dataProfile = ref({})
const loading = ref(false)

const goToContactCard = () => {
  router.push({ name: 'PublicProfile' })
}

const GetData = async () => {
    loading.value = true
    dataProfile.value = authStore.userInfo
    loading.value = false
}

onMounted(() => {
    GetData()  
})
</script>

<template>
    <div class="flex flex-col py-2 px-10 gap-y-5">
        <div class="flex flex-col">
          <div class="flex flex-row items-center gap-2">
            <font-awesome-icon class="" :icon="['fas','user']"></font-awesome-icon><h1 class="uppercase text-2xl">Mi Perfil</h1>
          </div>
        </div>
        <div class="grid grid-cols-2 justify-between">
            <div class="grid grid-flow-col auto-cols-max gap-2">
                <AppButton
                  class="bg-light-violet text-dark-violet border-0 p-1 hover:bg-dark-violet hover:text-light-violet"
                  type="button"
                  text="Tarjeta de Contacto"
                  :icons="['far', 'address-book']"
                  @click="goToContactCard"
                />
            </div>
        </div>
        <div v-if="loading" class="flex justify-center items-center">
          <div class="animate-spin w-8 h-8 border-4 border-t-mid-green border-b-mid-red border-l-light-violet border-r-light-orange rounded-full"></div>
          <span class="visually-hidden">  Cargando...</span>
        </div>
        <div class="flex flex-col" v-else>
            <div class="bg-neutral-beige rounded-t p-2">
               Mis datos
            </div>
            <div class="grid grid-cols-6 border-b border-b-extralight-beige">
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Nombre</div>
                <div class="p-2 col-span-2 border-r border-r-extralight-beige">{{ dataProfile.name }}</div>
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Apellido</div>
                <div class="p-2 col-span-2">{{ dataProfile.last_name }}</div>
            </div>
            <div class="grid grid-cols-6 border-b border-b-extralight-beige">
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Correo</div>
                <div class="p-2 col-span-2 border-r border-r-extralight-beige">{{ dataProfile.email }}</div>
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Celular</div>
                <div class="p-2 col-span-2">{{ dataProfile.phone_number }}</div>
            </div>
            <div class="grid grid-cols-6 border-b border-b-extralight-beige">
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Cumpleaños</div>
                <div class="p-2 col-span-2 border-r border-r-extralight-beige">{{ dataProfile.birthdate }}</div>
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Edad</div>
                <div class="p-2 col-span-2">{{ dataProfile.age }}</div>
            </div>
            <div class="grid grid-cols-6 border-b border-b-extralight-beige">
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Sexo</div>
                <div class="p-2 col-span-2 border-r border-r-extralight-beige">{{ dataProfile.sex }}</div>
                <div class="p-2 border-r border-r-extralight-beige bg-mid-beige">Estado Civil</div>
                <div class="p-2 col-span-2">{{ dataProfile.civil_status }}</div>
            </div>
        </div>
    </div>
</template>