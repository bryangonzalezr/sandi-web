<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { usePatientsStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import AppPagination from '@/common/AppPagination.vue';
import AppInput from '@/common/AppInput.vue';
import Swal from "sweetalert2";

const router = useRouter();

const loading = ref(true);

const patientStore = usePatientsStore()

const patients = ref([])
const links = ref({})
const meta = ref({})
const deletePatients = ref(false)
const addPatient = ref(false)
const email = ref('')
const errorsForm = ref({})

const headers = ['Nombre', 'Apellido', 'Edad', 'Sexo', 'Celular', 'Email', 'Objetivo', 'Acciones' ]
const atributesBody = ['name', 'last_name', 'age', 'sex', 'phone_number', 'email', 'objectives']

const goToChat = (id) => {
  router.push({ name: 'ChatPatients', params: { id: id }})
}

const viewPatientDetails = (patient) => {
  router.push({ name: "PatientsShow", params: { id: patient }});
};

const goToArchivedPlans = () => {
  router.push({ name: 'ArchivedPlans' });
};

const setValue = (value) => {
  email.value = event.target.value;
  delete errorsForm.value[value];
};

const changeAddPatient = () => {
  addPatient.value = !addPatient.value
  delete errorsForm.value.patient_email
  email.value = ''
}

const AddPatient = async () => {
  try {
    await patientStore.AssociatePatient(email.value)
    GetData();
    addPatient.value = false;
  } catch (error) {
    errorsForm.value = error.response.data.errors;
    console.log(errorsForm.value)
  }
}

const RemovePatient = (id) => {
  try{
    Swal.fire({
        title: "¿Segur@ que quieres eliminar al paciente?",
        showDenyButton: true,
        confirmButtonText: "Si",
        confirmButtonColor: "#76A95C",
        denyButtonText: `No`,
        denyButtonColor: "#DE3E3E",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await patientStore.RemovePatient(id);
          GetData();
        }
      });
    
  } catch (error) {
    errorsForm.value = error.response.data.errors;
  }
}

const GetData = async (page = 1) => {
  loading.value = true;
  await patientStore.IndexPatient(0,page,1)
  patients.value = patientStore.GetPatients
  links.value = patientStore.GetLinks
  meta.value = patientStore.GetMeta
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
          @click="goToArchivedPlans"
        />
      </div>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end relative">
        <AppButton
          class="bg-lavender text-black border-lavender enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
          type="button"
          text="Agregar paciente"
          :icons="['fas', 'plus']"
          @click="changeAddPatient"
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
        <div
          v-if="addPatient"
          class="absolute z-30 rounded bg-warm-beige shadow-md top-7 flex flex-col w-fit p-2 gap-2"
        >
          <AppInput
            type="text"
            v-model="email"
            label="Correo:"
            placeholder="Ingresa tu correo"s
            :error="errorsForm.patient_email ? true : false"
            :errorMessage="errorsForm.patient_email"
            @update:modelValue="setValue('patient_email')"
          />
          <AppButton 
            class="w-fit h-fit self-center bg-forest-green text-white border-forest-green hover:bg-white hover:text-forest-green"
            text="Agregar Paciente"
            @click="AddPatient"
          />
        </div>
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
                hoverText="Ver detalles"
                :icons="['fas', 'eye']"
                @click="viewPatientDetails(item.id)"
              />
              <AppButton
                class="text-violet"
                type="icon"
                hoverText="Ir al chat"
                :icons="['fas', 'message']"
                @click="goToChat(item.id)"
              />
              <AppButton
                v-if="deletePatients"
                class="text-bold-red"
                type="icon"
                hoverText="Eliminar y Archivar"
                :icons="['fas', 'trash-can']"
                @click="RemovePatient(item.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <AppPagination :meta="meta" :links="links" @handlePage="GetData" />
    </div>
  </div>
</template>
