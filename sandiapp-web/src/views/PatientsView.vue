<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { usePatientsStore, usePlanStore } from '@/stores';
import { getCivilstatus, getSex } from '@/utilities'
import AppButton from '@/common/AppButton.vue';
import AppPagination from '@/common/AppPagination.vue';
import AppInput from '@/common/AppInput.vue';
import AppSelect from '@/common/AppSelect.vue';
import AppTextarea from '@/common/AppTextarea.vue';
import Swal from "sweetalert2";

const router = useRouter();

const loading = ref(true);

const patientStore = usePatientsStore()
const planStore = usePlanStore();

const patients = ref([])
const links = ref({})
const meta = ref({})
const deletePatients = ref(false)
const addPatient = ref(false)
const openModal = ref(false)
const addPatientRegister = ref(false)
const addPatientExist = ref(false)
const formAddPatient = ref({})
const showPlanFiled = ref(false)
const showPatientFiled = ref(false)
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
  formAddPatient.value[value] = event.target.value;
  delete errorsForm.value[value];
};

const changeAddPatient = () => {
  addPatient.value = !addPatient.value
  openModal.value = !openModal.value
  if(addPatientRegister.value || addPatientExist.value){
    addPatientRegister.value = false
    addPatientExist.value = false
  }
  formAddPatient.value = {}
  errorsForm.value = {}
}

const ShowPatientsFiled = async (page) => {
  try{
    loading.value = true;
    await patientStore.IndexPatient(1,page,1)
    patients.value = patientStore.GetPatients
    links.value = patientStore.GetLinks
    meta.value = patientStore.GetMeta
    showPatientFiled.value = true;
    loading.value = false;
  }catch(error){
    console.log(error)
    patients.value = []
  }
}

const AddPatient = async () => {
  try {
    if(addPatientRegister.value){
      await patientStore.RegisterPatient(formAddPatient.value)
    }
    if(addPatientExist.value){
      await patientStore.AssociatePatient(formAddPatient.value.email)
    }
    GetData();
    changeAddPatient()
  } catch (error) {
    errorsForm.value = error.response.data.errors;
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

const RestorePatient = (id) => {
  try{
    Swal.fire({
        title: "¿Segur@ que quieres restaurar al usuario como paciente?",
        showDenyButton: true,
        confirmButtonText: "Si",
        confirmButtonColor: "#76A95C",
        denyButtonText: `No`,
        denyButtonColor: "#DE3E3E",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await patientStore.RestorePatient(id);
          GetData();
        }
      });
  }catch (error) {
    errorsForm.value = error.response.data.errors;
  }
}

const GetData = async (page = 1) => {
  try{
    loading.value = true;
    await patientStore.IndexPatient(0,page,1)
    await planStore.ShowPlanfiled();
    patients.value = patientStore.GetPatients
    links.value = patientStore.GetLinks
    meta.value = patientStore.GetMeta
    showPlanFiled.value = planStore.GetPlansfiled.length > 0 ? true : false;
    showPatientFiled.value = false;
    loading.value = false;
  }catch(error){
    console.log(error)
    patient.value = []
  }
}

onMounted(async () => {
  GetData();
});
</script>

<template>
  <div v-if="openModal" class="absolute z-20 top-0 w-full h-full flex items-center justify-center">
    <div class="absolute w-full h-full bg-dark-gray opacity-50" @click="changeAddPatient"></div>
    <div
      class="relative z-30 rounded bg-neutral-beige shadow-md flex flex-col w-fit p-8 gap-2"
    >
      <div class="absolute top-2 right-3">
          <AppButton 
          type="icon"
          class="text-black opacity-60"
          :icons="['fas', 'x']"
          hoverText="Cancelar"
          @click="changeAddPatient"
        />
      </div>
      <template v-if="addPatient && !addPatientExist && !addPatientRegister">
        <div class="text-lg">
          ¿El paciente tiene cuenta registrada? 
        </div>
        <div class="flex gap-x-4 w-full overflow-hidden">
          <AppButton 
            class="w-full h-fit self-center bg-mid-green text-dark-green border-0 p-1 border-dark-green hover:bg-dark-green hover:text-mid-green"
            text="Si"
            @click="addPatientExist = true"
          />
          <AppButton 
            class="w-full h-fit self-center bg-mid-red text-dark-red border-0 p-1 border-dark-red hover:bg-dark-red hover:text-mid-red"
            text="No"
            @click="addPatientRegister = true"
          />
        </div>
      </template>
      <template v-if="addPatient && addPatientRegister && !addPatientExist">
          <div class="uppercase text-lg">
            Registrar paciente 
          </div>
          <form @submit.prevent="AddPatient()" class="grid grid-cols-2 gap-3">
            <AppInput
              type="text"
              v-model="formAddPatient.name"
              label="Nombre:"
              placeholder="Nombre"
              :error="errorsForm.name ? true : false"
              :errorMessage="errorsForm.name"
              @update:modelValue="setValue('name')"
            />
            <AppInput
              type="text"
              v-model="formAddPatient.last_name"
              label="Apellido:"
              placeholder="Apellido"
              :error="errorsForm.last_name ? true : false"
              :errorMessage="errorsForm.last_name"
              @update:modelValue="setValue('last_name')"
            />
            <AppInput
              type="text"
              v-model="formAddPatient.phone_number"
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
                v-model="formAddPatient.birthdate"
                placeholder="Seleccione una fecha"
                model-type="dd-MM-yyyy"
                locale="es"
                format="dd-MM-yyyy"
                cancel-text="Cancelar"
                select-text="Seleccionar"
                :enable-time-picker="false"
                :day-names="['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']"
                :state="errorsForm.birthdate ? false : null"
              />
            </div>
            <AppSelect
              label="Sexo:"
              :options="getSex()"
              firstOptionValue="Selecciona tu sexo"
              :disabledFirstOption='true' 
              :error="errorsForm.sex ? true : false"
              :errorMessage="errorsForm.sex"
              @update:selectedOption="setValue('sex')"
            />
            <AppSelect
              label="Estado Civil:"
              :options="getCivilstatus()"
              firstOptionValue="Selecciona tu estado civil"
              :disabledFirstOption='true' 
              :error="errorsForm.civil_status ? true : false"
              :errorMessage="errorsForm.civil_status"
              @update:selectedOption="setValue('civil_status')"
            />
            <AppInput
              type="text"
              v-model="formAddPatient.email"
              label="Correo:"
              placeholder="Correo"
              :error="errorsForm.email ? true : false"
              :errorMessage="errorsForm.email"
              @update:modelValue="setValue('email')"
            />
            <AppTextarea
              type="text"
              v-model="formAddPatient.objetives"
              :maxlength="200"
              label="Objetivo:"
              placeholder="Objetivo"
              :error="errorsForm.objetives ? true : false"
              :errorMessage="errorsForm.objetives"
              @update:modelValue="setValue('objetives')"
            />
            <div class="col-span-2 justify-self-center">
              <AppButton 
                class="bg-mid-red border-0 m-3 text-white hover:bg-white hover:border hover:border-mid-red hover:text-mid-red" 
                text="Registrar Paciente"
                type="submit"          
              />
            </div>
          </form>
      </template>
      <template v-if="addPatient && !addPatientRegister && addPatientExist">
        <div class="uppercase text-lg">
           Vincular paciente
        </div>
        <form @submit.prevent="AddPatient()" class="grid grid-cols-1 gap-3">
          <AppInput
            type="text"
            v-model="formAddPatient.email"
            label="Correo:"
            placeholder="Correo"
            :error="errorsForm.email ? true : false"
            :errorMessage="errorsForm.email"
            @update:modelValue="setValue('email')"
          />
          <div class="col-span-2 justify-self-center">
            <AppButton 
              class="bg-mid-red border-0 m-3 text-white hover:bg-white hover:border hover:border-mid-red hover:text-mid-red" 
              text="Añadir Paciente"
              type="submit"          
            />
          </div>
        </form>
      </template>
    </div>
  </div>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <!--Titulo sección-->
    <div class="flex flex-col">
      <div class="flex flex-row items-center gap-2">
        <font-awesome-icon class="" :icon="['fas','user-group']"></font-awesome-icon><h1 class="uppercase text-2xl">Pacientes</h1>
      </div>
      <h2>Gestión de Pacientes</h2>
    </div>
    <!--Botones de acciones-->
    <div class="grid grid-cols-2 justify-between">
      <div class="grid grid-flow-col auto-cols-max gap-2">
        <AppButton
          v-if="showPlanFiled && !showPatientFiled"
          class="bg-light-violet text-dark-violet border-0 p-1 hover:bg-dark-violet hover:text-light-violet"
          type="button"
          text="Pacientes archivados"
          :icons="['fas', 'box-archive']"
          @click="ShowPatientsFiled"
        />
        <AppButton
          v-if="showPlanFiled && showPatientFiled"
          class="bg-light-violet text-dark-violet border-0 p-1 hover:bg-dark-violet hover:text-light-violet"
          type="button"
          text="Pacientes activos"
          :icons="['fas', 'eye']"
          @click="GetData"
        />
        <AppButton
          v-if="showPlanFiled && showPatientFiled"
          class="bg-light-violet text-dark-violet border-0 p-1 hover:bg-dark-violet hover:text-light-violet"
          type="button"
          text="Planes archivados"
          :icons="['fas', 'box-archive']"
          @click="goToArchivedPlans"
        />
      </div>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end relative">
        <AppButton
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
          type="button"
          text="Agregar paciente"
          :icons="['fas', 'plus']"
          @click="changeAddPatient"
        />
        <AppButton
          v-if="!deletePatients && !showPatientFiled"
          class="bg-mid-red text-dark-red border-0 p-1 hover:bg-dark-red hover:text-mid-red"
          type="button"
          text="Eliminar paciente/s"
          :icons="['fas', 'trash-can']"
          @click="deletePatients = !deletePatients"
        />
        <AppButton
          v-if="deletePatients && !showPatientFiled"
          class="bg-mid-red text-dark-red border-0 p-1 hover:bg-dark-red hover:text-mid-red"
          type="button"
          text="Cancelar eliminación"
          :icons="['far', 'circle-xmark']"
          @click="deletePatients = !deletePatients"
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">  Loading...</span>
    </div>

    <div v-else>
      <table class="min-w-full">
        <thead class="rounded-md">
          <tr
            class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
          ></tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-3 py-3 bg-neutral-beige text-left leading-4 text-black tracking-wider items-center"
          >
            <div class="flex items-center gap-2">
              {{ header }}
            </div>
          </th>
        </thead>
        <tbody class="overflow-y-scroll">
          <template v-if="patients.length > 0">
            <tr
              v-for="item in patients"
              :key="item.id"
              class="bg-white w-full px-11 border-b border-b-light-gray"
            >
              <td class="p-3" v-for="key in atributesBody">
                {{ item[key] }}
              </td>
              <td class="flex p-3 justify-center gap-x-2">
                <AppButton
                  v-if="!showPatientFiled"
                  class="text-violet"
                  type="icon"
                  hoverText="Ver detalles"
                  :icons="['fas', 'eye']"
                  @click="viewPatientDetails(item.id)"
                />
                <AppButton
                  v-if="!showPatientFiled"
                  class="text-violet"
                  type="icon"
                  hoverText="Ir al chat"
                  :icons="['fas', 'message']"
                  @click="goToChat(item.id)"
                />
                <AppButton
                  v-if="deletePatients && !showPatientFiled"
                  class="text-dark-red"
                  type="icon"
                  hoverText="Eliminar y Archivar"
                  :icons="['fas', 'trash-can']"
                  @click="RemovePatient(item.id)"
                />
                <AppButton
                  v-if="showPatientFiled"
                  class="text-dark-red"
                  type="icon"
                  hoverText="Restaurar paciente"
                  :icons="['fas', 'rotate']"
                  @click="RestorePatient(item.id)"
                />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr class="bg-white w-full px-11 border-b border-b-light-gray">
              <td class="p-3 text-center" :colspan="headers.length">
                No tienes pacientes asignados
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <AppPagination :meta="meta" :links="links" @handlePage="GetData" />
    </div>
  </div>
</template>
