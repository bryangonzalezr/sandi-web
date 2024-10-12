<script setup>
import AppButton from '@/common/AppButton.vue';
import AppInput from '@/common/AppInput.vue';
import VueMultiselect from 'vue-multiselect';
import { useRecipeStore, useAuthStore } from '@/stores';
import { ref } from 'vue';

const recipeStore = useRecipeStore()
const authStore = useAuthStore()

const HealthLabels = [
'Alcohol',
'Crustaceos',
'Lacteos',
'Huevos',
'Pescado',
'Gluten',
'KetoAmigable',
'AptoParaRiñones',
'Kosher',
'Lupino',
'Mediterraneo',
'Molusco',
'Mostaza',
'Aceite',
'DietaPaleo',
'Mani',
'Pescetariano',
'Cerdo',
'CarneRoja',
'Sesamo',
'Marisco',
'Soya',
'AzucarConsciente',
'FrutosSecos',
'Vegano',
'Vegetariano',
'Trigo'
]
const MealTypeOptions = ['Desayuno','Almuerzo','Cena','Snack']

const ingredient = ref({})
const recipe = ref({
  healthLabels: [],
  cautions: [],
  ingredientLines: [],
  mealType: [],
  dishType: [],
  sandi_recipe: false,
  user_id: authStore.userInfo.id
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
    console.log(recipe.value.ingredientLines)
    ingredient.value.ingredient = '';
  }
}

const SaveRecipe = async() => {
  try{
    await recipeStore.CreateRecipe(recipe.value);
  }catch(err){
    console.log(err)
  }
}
</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="grid grid-cols-2">
    <div class="flex flex-col">
      <h1 class="uppercase text-2xl">Crear nueva receta</h1>
      <h2>Ingresa los datos de la receta</h2>
    </div>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end">
          <AppButton
            class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
            type="button"
            text="Guardar Receta"
            :icons="['fas', 'plus']"
            @click="SaveRecipe"
          />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-5 justify-between">
      <div class="grid bg-lavender p-5 grid-rows-2 gap-5">
        <div class="grid p-5 grid-cols-2 gap-5">

          <AppInput
            type="text"
            v-model="recipe.label"
            label="Nombre:"
            placeholder="Ingresa el nombre"
            @update:modelValue="setValue('label')"
          />
    
          <div>
            <label class="text-sm">Etiquetas de salud</label>
            <VueMultiselect
              v-model="recipe.healthLabels"
              :options="HealthLabels"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :searchable="false"
              >
              <template #selection="{ values , search, isOpen }">
                <span class="multiselect__single"
                v-if="values.length"
                v-show="!isOpen">{{ values.length }} Opciones Seleccionadas</span>
              </template>
            </VueMultiselect>
          </div>
    
          <div>
            <label class="text-sm">Etiquetas de la comida</label>
            <VueMultiselect
              v-model="recipe.dishLabels"
              :options="HealthLabels"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :searchable="false"
              >
              <template #selection="{ values , search, isOpen }">
                <span class="multiselect__single"
                v-if="values.length"
                v-show="!isOpen">{{ values.length }} Opciones Seleccionadas</span>
              </template>
            </VueMultiselect>
          </div>
  
          <div>
            <label class="text-sm">Precauciones</label>
            <VueMultiselect
              v-model="recipe.cautions"
              :options="HealthLabels"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :searchable="false"
              >
              <template #selection="{ values , search, isOpen }">
                <span class="multiselect__single"
                v-if="values.length"
                v-show="!isOpen">{{ values.length }} Opciones Seleccionadas</span>
              </template>
            </VueMultiselect>
          </div>
  
          <AppInput
            type="number"
            v-model="recipe.calories"
            label="Calorías"
            placeholder="Ingresa cantidad de calorías"
            @update:modelValue="setValue('calories')"
          />
  
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
              :options="MealTypeOptions"
              :searchable="false"
              :multiple="true"
              :close-on-select="true"
              :show-labels="false"
              placeholder="Selecciona una opción"
            />
          </div>

        </div>
        <div class="p-5 grid-rows-2 gap-5">
          <h1 class="text-sm">Instrucciones:</h1>
          <textarea class="w-full min-h-64 rounded px-1 py-[6px] border border-white hover:border-[#aaaeb7] focus:border-[#aaaeb7] transition-all outline-0"></textarea>
        </div>

      </div>
      <div class="grid bg-pink grid-row-2 content-start p-5 gap-2">
        <div class="grid grid-cols-5 gap-2 items-end">
          <AppInput
            type="text"
            class="col-span-3"
            v-model="ingredient.ingredient"
            label="Ingresar Ingredientes"
            placeholder="Ej: 1/2 de taza de arroz"
            @update:modelValue="setIngredient('ingredient')"
            @keypress.enter="agregarIngrediente"
          />
          <AppButton
            class="bg-lavender w-60 h-10 text-black border-lavender enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
            type="button"
            text="Agregar Ingrediente"
            :icons="['fas', 'plus']"
            @click="agregarIngrediente"
          />
        </div>
        <div>
          <h1 class="text-sm">Lista de Ingredientes:</h1>
          <div class="bg-white py-3 h-full rounded">
            <div class="px-3" v-for="ingredient in recipe.ingredientLines">
              {{ "● " + ingredient }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>