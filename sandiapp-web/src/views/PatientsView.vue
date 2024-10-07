<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePatientsStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';

const router = useRouter();

const loading = ref(true);

const patientStore = usePatientsStore()

const patients = ref([])
const deletePatients = ref(false)

const headers = ['Nombre', 'Apellido', 'Edad', 'Sexo', 'Celular', 'Email', 'Objetivo', 'Acciones' ]
const atributesBody = ['name', 'last_name', 'age', 'sex', 'phone_number', 'email', 'objectives']

const viewPatientDetails = (patient) => {
  router.push({ name: "PatientsShow", params: { id: patient }});
};

const GetData = async () => {
  loading.value = true;
  await patientStore.IndexPatient()
  patients.value = patientStore.GetPatients
  loading.value = false;
}

onMounted(async () => {
  GetData();
});
</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <!--Titulo sección-->
    <div class="flex flex-col">
      <h1 class="uppercase text-2xl">Pacientes</h1>
      <h2>Gestión de Pacientes</h2>
    </div>
    <!--Botones de acciones-->
    <div class="grid grid-cols-2 justify-between">
      <div class="grid grid-flow-col auto-cols-max gap-2">
        <AppButton
          type="button"
          text="Planes archivados"
          :icons="['fas', 'box-archive']"
        />
      </div>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end">
        <AppButton
          class="bg-lavender text-black border-lavender enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
          type="button"
          text="Agregar paciente"
          :icons="['fas', 'plus']"
        />
        <AppButton
          v-if="!deletePatients"
          class="bg-pink text-black border-pink enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
          type="button"
          text="Eliminar paciente/s"
          :icons="['fas', 'trash-can']"
          @click="deletePatients = !deletePatients"
        />
        <AppButton
          v-if="deletePatients"
          class="enabled:hover:bg-pink enabled:hover:text-black enabled:hover:border-pink bg-white text-black border-black"
          type="button"
          text="Cancelar Eliminación"
          :icons="['fas', 'x']"
          @click="deletePatients = !deletePatients"
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">  Loading...</span>
    </div>

    <div v-else class="">
      <table class="min-w-full">
        <thead class="bg-forest-green">
          <tr
            class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
          ></tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-3 py-3 border-b border-gray text-left leading-4 text-black tracking-wider items-center"
          >
            <div class="flex items-center gap-2">
              {{ header }}
            </div>
          </th>
        </thead>
        <tbody class="overflow-y-scroll">
          <tr
            v-for="item in patients"
            :key="item.id"
            class="bg-white w-full px-11 border-b border-b-gray"
          >
            <td class="p-3" v-for="key in atributesBody">
              {{ item[key] }}
            </td>
            <td class="flex p-3 justify-center gap-x-2">
              <AppButton
                class="text-violet"
                type="icon"
                :icons="['fas', 'eye']"
                @click="viewPatientDetails(item.id)"
              />
              <AppButton
                v-if="deletePatients"
                class="text-bold-red"
                type="icon"
                :icons="['fas', 'trash-can']"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
