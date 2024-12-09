<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import formatDate from '@/helpers/dateFormat'
import { useRecipeStore, useTraductorStore } from '@/stores';
import Swal from "sweetalert2";
import AppButton from '@/common/AppButton.vue';
import AppPagination from '@/common/AppPagination.vue';

const router = useRouter();

const RecipesStore = useRecipeStore();

const listRecipes = ref([])
const loading = ref(true);
const links = ref({})
const meta = ref({})

const headers = ['Nombre','Tipo de comida','Etiquetas','Calorías','Última edición','Acciones']
const atributesBody = ['label','dishType','calories','updated_at']

const goToNewRecipe = () => {
  router.push({name: "RecipesCreate"})
}

const GetData = async (page = 1) => {
    loading.value = true;
    await RecipesStore.IndexRecipe(page, 1);
    listRecipes.value = RecipesStore.GetRecipesList;
    meta.value = RecipesStore.GetMeta;
    links.value = RecipesStore.GetLinks;
    loading.value = false;
}

const DeleteRecipeSelected = (id) => {
    try{
        Swal.fire({
          title: "¿Segur@ que quieres eliminar la receta?",
          showDenyButton: true,
          confirmButtonText: "Si",
          confirmButtonColor: "#76A95C",
          denyButtonText: `No`,
          denyButtonColor: "#DE3E3E",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await RecipesStore.DeleteRecipe(id);
            GetData()
          }
        });
    }catch(err){
        console.log(err)
    }
}

onMounted(async () => {
    GetData();
});
</script>

<template>
    <div class="flex flex-col py-2 px-10 gap-y-5">
        <div class="flex flex-col">
            <h1 class="uppercase text-2xl">Mis recetas</h1>
            <h2>Gestión de recetas</h2>
        </div>
        <div class="grid grid-flow-col auto-cols gap-2 w-fit">
            <AppButton
                class="bg-lavender text-black border-lavender enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
                type="button"
                text="Crear receta"
                :icons="['fas','plus']"
                @click="goToNewRecipe"
            />
        </div>
        <div v-if="loading" class="flex justify-center items-center">
          <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
          <span class="visually-hidden">  Loading...</span>
        </div>
        <div v-else>
            <table class="min-w-full h-full">
                <thead class="bg-forest-green">
                    <tr class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)">
                    </tr>
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
                        v-for="item in listRecipes"
                        :key="item.id"
                        class="bg-white w-full px-11 border-b border-b-gray"
                    >
                    <td class="p-2"><div>
                        {{ item['label'] }}
                    </div></td>
                    <td class="p-2">
                        <div v-for="(mealType , index) in item['mealType']" :key="index">
                            {{ mealType }}
                        </div>
                    </td>
                    <td class="p-2 flex gap-x-2 flex-wrap">
                        <div v-for="(health, index) in item['healthLabels']" :key="index">
                            {{ health }}
                        </div>
                    </td>
                    <td class="p-2"><div>
                        {{ Math.round(item['calories']) }}
                    </div></td>
                    <td class="p-2"><div>
                        {{ formatDate(item['updated_at']) }}
                    </div></td>
                    <td class="flex p-2 justify-center gap-x-2">
                        <AppButton
                            class="text-black"
                            type="icon"
                            hoverText="Editar"
                            text=""
                            :icons="['fas','pencil']"
                            @click="router.push({name: 'RecipesEdit', params: {id: item['_id']}})"
                        />
                        <AppButton
                            class="text-bold-red"
                            type="icon"
                            hoverText="Eliminar"
                            text=""
                            :icons="['fas','trash-can']"
                            @click="DeleteRecipeSelected(item['_id'])"
                        />
                    </td>
                    </tr>
                </tbody>
            </table>
            <AppPagination :meta="meta" :links="links" @handlePage="GetData" />
        </div>
    </div>

</template>