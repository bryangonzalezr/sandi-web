<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useListRecipesStore } from '@/stores/list-recipes.store';
import AppButton from '@/common/AppButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const listRecipesStore = useListRecipesStore();

const listRecipes = ref([])
const deleteRecipe = ref(false)

const headers = ['Nombre','Tipo de comida','Etiquetas','Calorías','Última edición','Acciones']
const atributesBody = ['label','dishType','calories','updated_at']

const GetData = async () => {
    await listRecipesStore.ShowRecipes();
    listRecipes.value = listRecipesStore.GetRecipesList;
    console.log(listRecipes.value);
}

const goToNewRecipe = () => {
  router.push({name: "NewRecipe"})
}

const DeleteRecipeSelected = async (id) => {
    try{
        await listRecipesStore.DeleteRecipe(id);
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
            <AppButton
                v-if="!deleteRecipe"
                class="bg-pink text-black border-pink enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
                type="button"
                text="Eliminar receta/s"
                :icons="['fas', 'trash-can']"
                @click="deleteRecipe = !deleteRecipe"
            />
            <AppButton
                v-if="deleteRecipe"
                class="enabled:hover:bg-pink enabled:hover:text-black enabled:hover:border-pink bg-white text-black border-black"
                type="button"
                text="Cancelar eliminación"
                :icons="['fas', 'x']"
                @click="deleteRecipe = !deleteRecipe"
            />
        </div>
        <div>
            <table class="min-w-full">
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
                    <td class="p-3"><div>
                        {{ item['label'] }}
                    </div></td>
                    <td class="p-3"><div>
                        {{ item['mealType'] }}
                    </div></td>
                    <td class="p-3"><div>
                        {{ item['healthLabels'] }}
                    </div></td>
                    <td class="p-3"><div>
                        {{ Math.round(item['calories']) }}
                    </div></td>
                    <td class="p-3"><div>
                        {{ Intl.DateTimeFormat("en-GB").format(Date.parse(item['updated_at'])) }}
                    </div></td>
                    <td class="flex p-3 justify-center gap-x-2">
                        <AppButton
                            class="text-black"
                            type="icon"
                            text=""
                            :icons="['fas','pencil']"
                        />
                        <AppButton
                            v-if="deleteRecipe"
                            class="text-bold-red"
                            type="icon"
                            text=""
                            :icons="['fas','trash-can']"
                            @click="DeleteRecipeSelected(item['_id'])"
                        />
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>