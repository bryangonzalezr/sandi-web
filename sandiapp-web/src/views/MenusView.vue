<script setup>
// Importar desde Vue, Vue-Router, Pinia en el orden respectivo 
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import formatDate from '@/helpers/dateFormat'
//Importar Stores
import { useMenuStore, usePatientsStore } from '@/stores';
//Importar componentes
import Swal from "sweetalert2";
import AppButton from '@/common/AppButton.vue';
import AppSelect from '@/common/AppSelect.vue';
import AppTag from '@/common/AppTag.vue';
import AppPagination from '@/common/AppPagination.vue';

const router = useRouter();

const menuStore = useMenuStore();
const patientStore = usePatientsStore();

const headers = ["Nombre","Paciente", "Tipo","Creado por", "Última edición","Acciones"]
const atributesBody = ['name','user','type',"sandi_recipe",'updated_at']
const typesFilter = {
    'diario': 'Menú del día',
    'semanal': 'Menú semanal',
    'mensual': 'Menú mensual',
}
const sandiFilter = {
  '0': 'Mi cuenta',
  '1': 'Asistente'
}

const patientFilter = ref({})
const form = ref({})
const listMenus = ref([])
const links = ref({})
const meta = ref({})
const loading = ref(true);
const activeFilter = ref(false);
const currentPage = ref(1)


const goToCreate = () => {
  router.push({ name: 'MenusCreate'})
}

const goToEdit = (menutype, menuId) => {
  router.push({ name: 'MenusEdit', params: { type: menutype, id: menuId }})
}

const deleteMenu = (type, id) => {
  Swal.fire({
    title: "¿Segur@ que quieres eliminar el menú?",
    showDenyButton: true,
    confirmButtonText: "Si",
    confirmButtonColor: "#76A95C",
    denyButtonText: `No`,
    denyButtonColor: "#DE3E3E",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      if(type == 'diario'){
        menuStore.DeleteMenuDay(id)
      }else{
        menuStore.DeleteMenu(id)
      }
      GetData()
    }
  });
}

const setValue = (value) => {
  form.value[value] = event.target.value;
}

const filterMenu = async () => {
  activeFilter.value = !activeFilter.value
  loading.value = true;
  await menuStore.IndexMenus(currentPage.value,form.value.id_patient, form.value.type, form.value.sandi)
  listMenus.value = menuStore.GetMenus;
  loading.value = false;
  form.value = {}
}

const GetPatients = async () => {
  await patientStore.IndexPatient()
  patientStore.GetPatients.forEach(patient => {
    patientFilter.value[patient.id] = patient.name + ' ' + patient.last_name
  })
}

const GetData = async (page = 1) => {
  try{
    currentPage.value = page
    form.value = {}
    loading.value = true;
    await menuStore.IndexMenus(page)
    listMenus.value = menuStore.GetMenus;
    links.value = menuStore.GetLinks;
    meta.value = menuStore.GetMeta;
    loading.value = false;
  }catch(error){
    loading.value = false;
    listMenus.value = []
  }
}

onMounted(async () => {
  GetData(currentPage.value);
  GetPatients();
});

</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="flex flex-col">
      <div class="flex flex-row items-center gap-2">
        <font-awesome-icon :icon="['fas','book']"></font-awesome-icon>
        <h1 class="uppercase text-2xl">Mis menús</h1>
      </div>
      <h2>Gestión de menús asignados a pacientes</h2>
    </div>
    <div class="grid grid-cols-2 justify-between">
      <div class="grid grid-flow-col auto-cols-max gap-2">
        <AppButton
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
          type="button"
          text="Crear menú"
          :icons="['fas', 'plus']"
          @click="goToCreate()"
        />
      </div>
      <div class="grid w-full relative">
        <div class="flex gap-x-2 justify-self-end">
          <AppButton
            class="bg-mid-red text-dark-red border-0 p-1 hover:bg-dark-red hover:text-mid-red"
            text="Limpiar Filtros" 
            :icons="['fas', 'filter-circle-xmark']"
            @click="GetData"
          />
          <AppButton
            class=" border-0 p-1 hover:bg-dark-violet hover:text-light-violet"
            :class="!activeFilter ? 'bg-light-violet  text-dark-violet' : 'text-white border-white bg-black'"
            text="Filtrar" 
            :icons="['fas', 'filter']"
            @click="activeFilter = !activeFilter"
          />
        </div>
        <div
          v-if="activeFilter"
          class="absolute z-30 rounded bg-light shadow-md top-7 grid grid-rows-4 w-full p-2 gap-2"
        >
          <AppSelect  
              label="Tipo de Menu:"
              :displayRow="true"
              :options="typesFilter"
              firstOptionValue="Filtar por tipo de Menu"
              :disabledFirstOption='true' 
              @update:selectedOption="setValue('type')"
          />
          <AppSelect  
              label="Creado por:"
              :displayRow="true"
              :options="sandiFilter"
              firstOptionValue="Filtar por creador"
              :disabledFirstOption='true' 
              @update:selectedOption="setValue('sandi')"
          />
          <AppSelect  
              label="Paciente:"
              :displayRow="true"
              :options="patientFilter"
              firstOptionValue="Filtar por paciente"
              :disabledFirstOption='true' 
              @update:selectedOption="setValue('id_patient')"
          />
          <AppButton 
            class="w-fit justify-self-center bg-light-violet text-dark-violet border-0 p-1"
            text="Aplicar filtros"
            @click="filterMenu"
          />
        </div>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">  Loading...</span>
    </div>
    <div v-else>
      <table class="min-w-full">
        <thead class="rounded-md">
          <tr class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)]"></tr>
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
          <template v-if="listMenus.length > 0">
            <tr
              v-for="item in listMenus"
              :key="item._id"
              class="bg-white w-full px-11 border-b border-b-light-gray"
            >
              <td class="p-3" v-for="key in atributesBody">
                <div v-if="key == 'updated_at'">
                  {{ formatDate(item[key]) }}
                </div>
                <div v-else-if="key == 'type'">
                  <AppTag
                    :tipo="item[key]"
                  />
                </div>
                <div v-else-if="key == 'sandi_recipe'">
                  {{ item[key] ? 'Asistente' : 'Mi cuenta' }}
                </div>
                <div v-else>
                  {{ item[key] }}
                </div>
              </td>
              <td class="flex p-3 justify-center gap-x-2">
                <AppButton
                  class="text-black"
                  type="icon"
                  hoverText="Editar"
                  :icons="['fas','pencil']"
                  @click="goToEdit(item.type, item._id)"
                />
                <AppButton
                  class="text-red"
                  type="icon"
                  hoverText="Eliminar"
                  :icons="['fas','trash']"
                  @click="deleteMenu(item.type, item._id)"
                />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr class="bg-white w-full px-11 border-b border-b-light-gray">
              <td class="p-3 text-center" :colspan="headers.length">
                No hay resultados para su búsqueda.
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <AppPagination v-if="listMenus.length > 0" :meta="meta" :links="links" @handlePage="GetData" />
    </div>
  </div>
</template>