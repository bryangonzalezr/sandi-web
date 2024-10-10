<script setup lang="ts">
// Importar desde Vue, Vue-Router, Pinia en el orden respectivo 
import { onMounted, ref } from 'vue';
//Importar Stores
import { useListMenusStore } from '@/stores';
//Importar componentes
import AppButton from '@/common/AppButton.vue';
import AppTag from '@/common/AppTag.vue';

const listMenusStore = useListMenusStore();

const ejemplos = [{id:0,nombre:"Receta de pollo vegano",paciente:"Willy",tipo:"receta",fecha:"02-10-2024"},{id:1,nombre:"Menú diario del Mac FC",paciente:"MC DOnals",tipo:"menu_diario",fecha:"14-12-2018"},{id:2,nombre:"Plan 7 días sin pan",paciente:"Gym Bro",tipo:"menu_semanal",fecha:"31-02-2025"},{id:3,nombre:"Dieta 30 días Fitness",paciente:"Hola Mundo!",tipo:"menu_mensual",fecha:"11-02-2023"}]
const headers = ["Nombre","Paciente", "Tipo", "Última edición","Acciones"]
const atributesBody = ['nombre','paciente','tipo','fecha']

const GetData = async () => {
  await listMenusStore.ShowMenus()
}

onMounted(async () => {
  GetData();
});

</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="flex flex-col">
      <h1 class="uppercase text-2xl">Mis menús</h1>
      <h2>Gestión de menús asignados a pacientes</h2>
    </div>
    <div class="grid">
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end">
        <AppButton
        class="bg-pink text-black border-pink enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
        type="button"
        text="Crear menú"
        :icons="['fas', 'plus']"
        />
      </div>
    </div>
    <div>
      <table class="min-w-full">
        <thead class="bg-forest-green">
          <tr class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)]"></tr>
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
            v-for="item in ejemplos"
            :key="item.id"
            class="bg-white w-full px-11 border-b border-b-gray"
          >
          <td class="p-3" v-for="key in atributesBody">
            <div v-if="key != 'tipo'">
              {{ item[key] }}
            </div>
            <div v-if="key == 'tipo'">
              <AppTag
                :tipo="item[key]"
              />
            </div>
          </td>
          <td class="flex p-3 justify-center gap-x-2">
            <AppButton
              class="text-black"
              type="icon"
              :icons="['fas','pencil']"
            />
          </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>