<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from "vue-router";
import { useRecipeStore, useMenuStore, usePatientsStore } from '@/stores';
import Swal from "sweetalert2";
import AppSelect from '@/common/AppSelect.vue';
import AppButton from '@/common/AppButton.vue';
import AppInput from '@/common/AppInput.vue';

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

const recipeStore = useRecipeStore();
const menuStore = useMenuStore();
const patientStore = usePatientsStore();

const typesMenus = {
    'diario': 'Menú del día',
    'semanal': 'Menú semanal',
    'mensual': 'Menú mensual',
}

const patients = ref([])
const listRecipes = ref([])
const newlistRecipes = ref([])
const draggedIndex = ref(null)
const draggedFromList = ref(null)
const form = ref({})
const errorsForm = ref({})
const days = ref([])
const disabledSendForm = ref(true)
const daySelected = ref(null)

const handleDragStart = (event, index, listName) => {
    draggedIndex.value = index;
    draggedFromList.value = listName;
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
}

const handleDrop = (event, targetList) => {

    if (draggedFromList.value === targetList) {
      return;
    }

    const sourceList = draggedFromList.value === 'listRecipes' ? listRecipes.value : newlistRecipes.value;
    const targetListRef = targetList === 'listRecipes' ? listRecipes.value : newlistRecipes.value;
    if(targetList === 'newlistRecipes' && targetListRef.length === 3){
        Swal.fire({
          title: "Límite Alcanzado",
          text: "Has alcanzado el número máximo de recetas para el día. Elimina una receta para agregar una nueva",
          icon: "error",
          confirmButtonColor: "#B8D0A7",
          confirmButtonText: "Aceptar",
          heightAuto: false,
        });
    }else{
        const item = sourceList.splice(draggedIndex.value, 1)[0];
        targetListRef.push(item);
    }
}

const setValue = (value) => {
  form.value[value] = event.target.value;
  delete errorsForm.value[value];
  if(value === 'type'){
    if(form.value[value] == 'diario'){
        days.value = [1]
        daySelected.value = 1
        if(form.value.timespan){
            delete form.value.timespan;
        }
        if(form.value.menus){
            delete form.value.menus;
        }
        newlistRecipes.value = []
        GetRecipes()
    }
    else if(form.value[value] == 'semanal' || form.value[value] == 'mensual'){
        form.value.menus = {}
        newlistRecipes.value = []
        GetRecipes()
        if(form.value[value] == 'semanal'){
            days.value = Array.from({ length: 7 }, (_, i) => i + 1)
            form.value.timespan = 7
        }else{
            days.value = Array.from({ length: 30 }, (_, i) => i + 1)
            form.value.timespan = 30
        }
    }
  }
};

const invalidateMenus = () => {
  if (Object.keys(form.value.menus).length !== form.value.timespan) {
    return true;
  }
  for (const day in form.value.menus) {
    if (form.value.menus[day].length < 1) {
      return true;
    }
  }
  return false;
};

const getIdByFullName = (fullName) => {
    const [name, last_name] = fullName.split(' ');
    const person = patientStore.GetPatients.find(person => 
        person.name === name && person.last_name === last_name
    );
    return person ? person.id : null;
};

const UndoChanges = () => {
    GetData();
}

const SendMenu = () => {
    try{
        form.value.total_calories = 0;
        if(form.value.type == 'mensual' || form.value.type == 'semanal'){
            for (const day in form.value.menus) {
              form.value.menus[day].forEach(recipe => {
                  form.value.total_calories += Number(recipe.calories);
              });
            }
            menuStore.UpdateMenu(form.value, props.id)
        }
        if(form.value.type == 'diario'){
            form.recipes = newlistRecipes.value
            form.value.recipes.forEach(recipe => {
                form.value.total_calories += Number(recipe.calories);
            });
            menuStore.UpdateMenuDay(form.value, props.id)

        }
        router.push({ name: 'ListMenus'})
    }catch(error) {
        errorsForm.value = error.response.data.errors;
    }

}

const GetRecipes = async () => {
    try {
        await recipeStore.IndexRecipe();
        listRecipes.value = recipeStore.GetRecipesList;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const GetPatients = async () => {
    await patientStore.IndexPatient()
    patients.value = patientStore.GetPatients.map(patient => patient.name + ' ' + patient.last_name)
}

const GetData = async () => {
    try {
        if(props.type == 'diario'){
            await menuStore.ShowMenuday(props.id)
            newlistRecipes.value = menuStore.GetMenu.recipes;
            form.value.recipes = []
            days.value = [1]
        }else if(props.type == 'semanal' || props.type == 'mensual'){
            await menuStore.ShowMenu(props.id)
            newlistRecipes.value = menuStore.GetMenu.menus[0];
            form.value.menus = menuStore.GetMenu.menus
            if(props.type == 'semanal'){
                days.value = Array.from({ length: 7 }, (_, i) => i + 1)
                form.value.timespan = 7
            }else{
                days.value = Array.from({ length: 30 }, (_, i) => i + 1)
                form.value.timespan = 30
            }
        }
        GetRecipes().then(() => {
            const selectedIds = newlistRecipes.value.map(recipe => recipe._id ?? recipe.id);
            listRecipes.value = recipeStore.GetRecipesList.filter(recipe => !selectedIds.includes(recipe._id ?? recipe.id));
        });
        daySelected.value = 1
        form.value.user_id = getIdByFullName(menuStore.GetMenu.user)
        form.value.name = menuStore.GetMenu.name
        form.value.type = props.type
        form.value.sandi_recipe = menuStore.GetMenu.sandi_recipe;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

onMounted(async () => {
  GetRecipes();
  GetPatients();
  GetData();
});

watch(form.value, (newVal) => {
    if(form.value.type == 'mensual' || form.value.type == 'semanal'){
        disabledSendForm.value = invalidateMenus()
        form.value.menus[daySelected.value - 1] = newlistRecipes.value;
    }
    if(form.value.type == 'diario'){
        disabledSendForm.value = newlistRecipes.value.length < 1 ? true : false
        form.value.recipes = newlistRecipes.value;
    }
})

watch(daySelected, (newVal) => {
    if(form.value.type == 'mensual' || form.value.type == 'semanal'){
        if (!form.value.menus[newVal - 1]) {
            form.value.menus[newVal - 1] = [];
        }
        newlistRecipes.value = form.value.menus[newVal - 1];

        GetRecipes().then(() => {
            const selectedIds = newlistRecipes.value.map(recipe => recipe._id ?? recipe.id);
            listRecipes.value = recipeStore.GetRecipesList.filter(recipe => !selectedIds.includes(recipe._id ?? recipe.id));
        });
    }
})
</script>

<template>
    <div class="flex flex-col py-2 px-10 gap-y-4 w-full h-full">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-2 mt-6 mb-4">
                <font-awesome-icon :icon="['fas', 'book']"/>
                <h1 class="text-2xl font-bold">Editar menú</h1>
            </div>
            <div class="mt-4">
                    <AppButton 
                    class="bg-light-orange text-dark-orange hover:bg-light-orange px-4 py-2 rounded border-0 flex items-center gap-2"
                    text="Revertir cambios"
                    :icons="['fas', 'reply']"
                    @click="UndoChanges"
                />
            </div>
        </div>
        <div class="flex gap-x-4 w-full max-h-[470px]">
            <div 
                v-if="form.type"
                :class="days.length > 7 ? 'max-w-[30%]' : 'min-w-max'"
            >
            <div class="w-full bg-light-green text-dark-green rounded-lg shadow-md p-4">
                <div class="bg-dark-green text-white text-center p-2 font-bold rounded">
                    <font-awesome-icon :icon="['fas', 'book-open']" class="mr-2"/>
                    Mis recetas
                </div>
                <!-- Lista de recetas creadas -->
                <div class="h-full overflow-y-auto p-2 bg-light-green rounded-b-lg"
                     @drop="handleDrop($event, 'listRecipes')" 
                     @dragenter.prevent 
                     @dragover.prevent>
                    <template v-if="listRecipes.length == 0">
                        <div class="p-2 text-center text-sm text-gray-600">
                            Arrastra recetas que no usaras aquí
                        </div>
                    </template>
                    <template v-else>
                        <div 
                            class="bg-white rounded p-3 shadow-md mb-2 border-l-4 border-dark-green"
                            v-for="(item, index) in listRecipes" 
                            :key="index"
                            :draggable="true"
                            @dragstart="handleDragStart($event, index, 'listRecipes')"
                        >
                            <div class="font-semibold text-sm">Nombre: {{ item.label }}</div>
                            <div class="text-sm text-gray-700">Tipo de plato: {{ item.mealType.join(', ') }}</div>
                        </div>
                    </template>
                </div>
            </div>
            </div>
            <!--Creación de Menú-->
            <div class="flex flex-col flex-grow gap-y-4 ">
                <form
                    class="flex flex-col gap-y-4"
                    @submit.prevent="SendMenu()"
                >
                    <AppInput
                      type="text"
                      :displayRow="true"
                      v-model="form.name"
                      label="Nombre Menú:"
                      placeholder="Nombre"
                      :error="errorsForm.name ? true : false"
                      :errorMessage="errorsForm.name"
                      @update:modelValue="setValue('name')"
                    />
                    <AppSelect  
                        label="Tipo de Menú:"
                        :selectedOption="form.type"
                        :displayRow="true"
                        :options="typesMenus"
                        firstOptionValue="Selecciona tipo de menú"
                        @update:selectedOption="setValue('type')"
                    />
                    <div class="flex gap-x-2">
                        <div>Asignado a:</div>
                        <div class="bg-light-green px-2 rounded-full cursor-default">{{ menuStore.GetMenu.user }}</div>
                    </div>
                    <div 
                        v-if="form.type && days.length > 1"
                        class="flex gap-1 bg-light-violet p-2 rounded-lg overflow-hidden justify-around"
                    >
                        <div 
                            v-for="day in days"
                            :key="day"
                            class="rounded-lg flex-grow h-10 flex items-center justify-center cursor-pointer transition-all duration-200"
                            :class="daySelected === day ? 'bg-light-green text-dark-green font-bold scale-110 shadow-md' : 'bg-white text-bold-green'"
                            @click="daySelected = day"
                        >
                            {{ day }}
                        </div>
                    </div>
                    <!-- Lista de recetas elegidas-->
                    <div 
                        class="bg-light-violet rounded p-4 min-h-[100px] h-auto flex flex-col gap-2 transition-all duration-300"
                        v-if="form.type"
                        @drop="handleDrop($event, 'newlistRecipes')"
                        @dragenter.prevent
                        @dragover.prevent
                    >
                        <div class="flex flex-col gap-3">
                            <template v-if="newlistRecipes.length == 0">
                                <div 
                                    class="p-4 text-center text-dark-green"
                                    :draggable="false"
                                    @dragstart="handleDragStart($event, 0, 'newlistRecipes')"
                                >
                                    Arrastra las recetas que quieras aquí
                                </div>
                            </template>
                            <template v-else>
                                <div 
                                    class="bg-white rounded p-2 shadow-md flex items-center gap-2"
                                    v-for="(item, index) in newlistRecipes" 
                                    :key="index"
                                    :draggable="true"
                                    @dragstart="handleDragStart($event, index, 'newlistRecipes')"
                                >
                                    <input type="radio" :id="'recipe' + index" name="recipe" class="mr-2" />
                                    <label :for="'recipe' + index" class="text-dark-green">{{ item.label }}</label>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="flex justify-end mt-4">
                        <AppButton 
                            :isDisabled="disabledSendForm"
                            text="Guardar menú"
                            type="submit"
                            class="bg-mid-green text-dark-green hover:bg-mid-green px-4 py-2 rounded border-0 flex items-center gap-2 mr-4"
                            :icons="['fas', 'save']"
                        />
                        <AppButton
                            text="Cancelar"
                            type="button"
                            class="bg-mid-red text-dark-red hover:bg-mid-red px-4 py-2 rounded border-0 flex items-center gap-2"
                            :icons="['fas', 'circle-xmark']"
                            @click="router.push({name: 'ListMenus'})"
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>