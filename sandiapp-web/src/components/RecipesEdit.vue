<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { getMealType, getDietLabels, getHealth, getDishType } from "@/utilities"
import { useRecipeStore, useAuthStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import AppInput from '@/common/AppInput.vue';
import VueMultiselect from 'vue-multiselect';
import Swal from "sweetalert2";

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    id: {
      type: String,
      required: true,
    },
});

const router = useRouter();

const recipeStore = useRecipeStore()
const authStore = useAuthStore()

const HealthLabels = Object.values(getHealth())
const DietLabels = Object.values(getDietLabels())
const MealTypeOptions = Object.values(getMealType())
const DishTypeOptions = Object.values(getDishType())

const ingredient = ref({})
const editIngredient = ref([])
const recipe = ref({
  healthLabels: [],
  ingredientLines: [],
  mealType: [],
  dishType: [],
})
const errorsForm = ref({})

const setIngredient = (value) => {
  ingredient.value.ingredient = event.target.value;
}

const setValue = (value) => {
  recipe.value[value] = event.target.value;
  delete errorsForm.value[value];
}

const agregarIngrediente = () => {
  if (ingredient.value.ingredient != '') {
    recipe.value.ingredientLines.push(ingredient.value['ingredient']);
    editIngredient.value.push(false)
    ingredient.value.ingredient = '';
  }
}

const activeEdit = (index) => {
  editIngredient.value[index] =!editIngredient.value[index]
}

const editarIngrediente = (index) => {
  recipe.value.ingredientLines[index] = event.target.value;
}

const deleteIngredient = (index) => {
  Swal.fire({
    title: "¿Segur@ que quieres eliminar el ingrediente?",
    showDenyButton: true,
    confirmButtonText: "Si",
    confirmButtonColor: "#76A95C",
    denyButtonText: `No`,
    denyButtonColor: "#DE3E3E",
  }).then((result) => {
    if (result.isConfirmed) {
      recipe.value.ingredientLines.splice(index, 1);
    }
  });
}

const SaveRecipe = async() => {
  try{
    await recipeStore.UpdateRecipe(recipe.value, props.id);
    router.push({ name: 'ListRecipes'})
  }catch(error){
    errorsForm.value = error.response.data.errors;
  }
}

const GetData = async () => {
  await recipeStore.ShowRecipe(props.id)
  recipe.value = recipeStore.GetRecipe;
}

onMounted(async () => {
  GetData();
});
</script>

<template>
    <AppButton
    class="w-fit bg-light-gray border-0 px-3 mx-6 mb-5 rounded-none rounded-b-lg "
    type="button"
    text="Volver"
    :icons="['fas', 'arrow-left']"
    @click="router.push({name: 'ListRecipes'})"
  />
    <div class="flex flex-col py-2 px-6 gap-y-5">
      <div class="grid grid-cols-2">
        <div class="flex flex-col">
          <div class="flex flex-row gap-2 items-center">
            <font-awesome-icon :icon="['fas','pencil']"></font-awesome-icon>
            <h1 class="uppercase text-2xl">Editar receta</h1>
          </div>
        </div>
        <AppButton 
            class="w-fit self-end justify-self-end bg-mid-red text-dark-red border-0 p-1 hover:bg-dark-red hover:text-mid-red"
            text="Revertir cambios"
            :icons="['fas', 'reply']"
            @click="GetData"
        />
      </div>
      <div class="grid grid-cols-2 gap-2 justify-between">
        <div class="grid p-5 gap-1 bg-extralight-green rounded-lg">
          <div class="grid grid-cols-2 gap-2">
            <AppInput
              type="text"
              v-model="recipe.label"
              label="Nombre"
              placeholder="Ingresa el nombre"
              :error="errorsForm.label ? true : false"
              :errorMessage="errorsForm.label"
              @update:modelValue="setValue('label')"
            />
            <AppInput
              type="number"
              v-model="recipe.calories"
              label="Calorías"
              placeholder="Ingresa cantidad de calorías"
              :error="errorsForm.calories ? true : false"
              :errorMessage="errorsForm.calories"
              @update:modelValue="setValue('calories')"
            />
          </div>
          <div>
            <label class="text-sm">Etiquetas de Salud</label>
            <VueMultiselect
              v-model="recipe.healthLabels"
              :options="HealthLabels"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :searchable="false"
              >
            </VueMultiselect>
          </div>
    
          <div>
            <label class="text-sm">Etiquetas dietéticas</label>
            <VueMultiselect
              v-model="recipe.dietLabels"
              :options="DietLabels"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :searchable="false"
              >
            </VueMultiselect>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-sm">Tipo de comida</label>
              <VueMultiselect
                v-model="recipe.mealType"
                :options="MealTypeOptions"
                :searchable="false"
                :multiple="true"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Selecciona una opción"
              />
            </div>
          
            <div>
              <label class="text-sm">Tipo de plato</label>
              <VueMultiselect
                v-model="recipe.dishType"
                :options="DishTypeOptions"
                :searchable="false"
                :multiple="true"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Selecciona una opción"
              />
            </div>
          </div>
          <div>
            <h1 class="text-sm">Instrucciones:</h1>
            <textarea 
                class="w-full min-h-24 rounded border border-white hover:border-[#aaaeb7] focus:border-[#aaaeb7] transition-all outline-0"
                v-model="recipe.instructions"
            ></textarea>
          </div>
        </div>
        <div class="flex flex-col justify-between p-5 gap-1 bg-light-red rounded-lg">
          <div class="flex gap-2 w-full" :class="errorsForm.ingredientLines ? 'items-center' : 'items-end'">
            <AppInput
              type="text"
              class="flex-nowrap w-full"
              v-model="ingredient.ingredient"
              label="Ingresar Ingredientes"
              placeholder="Ej: 1/2 de taza de arroz"
              @update:modelValue="setIngredient('ingredient')"
              @keypress.enter="agregarIngrediente"
            />
            <AppButton
              class="text-black bg-lavender py-[6px] px-2 rounded"
              type="icon"
              hoverText="Agregar ingredinte"
              :icons="['fas', 'plus']"
              :error="errorsForm.ingredientLines ? true : false"
              :errorMessage="errorsForm.ingredientLines"
              @click="agregarIngrediente"
            />
          </div>
          <div class="flex-grow">
            <h1 class="text-sm">Lista de Ingredientes</h1>
            <div class="bg-white py-3 rounded px-2 flex flex-col gap-2 h-[360px] overflow-y-auto">
              <div v-if="recipe.ingredientLines.length == 0">Sin ingredientes añadidos</div>
              <div v-else class="px-3 gap-2 flex justify-between items-center" v-for="(ingredient,index) in recipe.ingredientLines">
                <div 
                  v-if="!editIngredient[index]"
                  class="flex-nowrap bg-pink rounded p-2 w-full"
                >
                  {{ ingredient }}
                </div>
                <AppInput 
                  v-else
                  type="text"
                  class="flex-nowrap w-full"
                  v-model="recipe.ingredientLines[index]"
                  @update:modelValue="editarIngrediente(index)"
                />
                <AppButton
                  class="text-violet"
                  type="icon"
                  :hoverText="!editIngredient[index] ? 'Editar' : 'Guardar'"
                  :icons="!editIngredient[index] ? ['fas','pencil'] : ['fas','check']"
                  @click="activeEdit(index)"
                />
                <AppButton
                  class="text-violet"
                  type="icon"
                  hoverText="Eliminar ingrediente"
                  :icons="['fas','trash-can']"
                  @click="deleteIngredient(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppButton
      class="w-fit self-end border-0 p-1 bg-light-green text-dark-green hover:bg-dark-green hover:text-light-green"
      type="button"
      text="Guardar Receta"
      :icons="['fas', 'plus']"
      @click="SaveRecipe"
    />
    </div>
  
  </template>
  
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>