<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { useContactCardStore } from '@/stores';
import AppButton from '@/common/AppButton.vue'; 
import AppSelect from "@/common/AppSelect.vue";
import AppInput from '@/common/AppInput.vue';

const contactCardStore = useContactCardStore();
const loading = ref(false);
const emit = defineEmits(["close"]);

const authUser = localStorage.getItem('user');
const currentUser = JSON.parse(authUser.toString());

const experienceTypes = ref([])

const isOpen = ref(false);
const inProgress= ref(false);
const experience = ref({
  nutritionist_id: currentUser.id,
  type: "",
  title: "",
  institution: "",
  description: "",
  start_date: '',
  end_date: '',
});

const loadExperienceTypes = async () => {
  await contactCardStore.EnumExperienceType();
  experienceTypes.value = contactCardStore.experience_type; // Accede directamente al estado
};

const saveExperience = async () => {
  try {
    /* console.log("Guardando experiencia:", experience.value); */
    
    // Comprobación para asegurar que `type` tiene un valor válido
    if (!experience.value.type) {
      console.error("Tipo de experiencia no seleccionado");
      return;
    }

    // Aquí haríamos la llamada a la API usando el store
    await contactCardStore.CreateExperience(experience.value).then(async () => {
      await contactCardStore.IndexExperience(1, 1)
    }).finally(() => {
      closeModal();
    });  
    
  } catch (error) {
    console.error("Error al guardar la experiencia:", error);
  }
};
const closeModal = () => {
  isOpen.value = false;
  // Emitimos el evento para que el componente padre cierre el pop-up
  emit('close');
};

const setValue = (value) => {
  experience.value[value] = event.target.value;
};

onMounted(() => {
  loading.value = true;
  loadExperienceTypes();
  loading.value = false;
});
</script>

<template>
  <!-- Contenedor de fondo del pop-up -->
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <!-- Contenedor principal del pop-up -->
    <div class="bg-white w-full max-w-2xl mx-auto rounded-lg p-6 space-y-4 border border-neutral-beige">
      <!-- Mensaje de carga -->
      <div v-if="loading" class="flex justify-center items-center">
        <div class="animate-spin w-8 h-8 border-4 border-t-mid-green border-b-mid-red border-l-light-violet border-r-light-orange rounded-full"></div>
        <span class="visually-hidden">  Cargando...</span>
      </div>
      
      <!-- Contenido del formulario -->
      <div v-else>
        <h2 class="text-xl font-PoppinsBold text-black">Añadir Experiencia</h2>

        <form @submit.prevent="saveExperience">
          <!-- Contenedor de dos columnas -->
          <div class="grid grid-cols-2 gap-4">
            <AppInput 
              label="Título"
              v-model="experience.title" 
              type="text" 
              class="w-full bg-gray-100 border border-white rounded py-2" 
              required 
            />
            <AppSelect
              label="Tipo"
              :options="experienceTypes.data"
              value="value"
              optionText="name"
              placeholder="Seleccione el tipo de experiencia"
              class="w-full bg-gray-100 border border-white rounded py-2"
              @update:selectedOption="setValue('type')"
            /> 
            <AppInput 
              label="Organización"
              v-model="experience.institution"
              type="text" 
              class="w-full bg-gray-100 border border-white rounded py-2" 
              required 
            />
            <AppInput 
              label="Descripción"
              v-model="experience.description" 
              type="text"
              class="w-full bg-gray-100 border border-white rounded py-2" 
              required 
            />

            <div class="flex items-center gap-x-2 col-span-2">
              <label class="text-sm text-nowrap">En curso</label>
              <input v-model="inProgress" type="checkbox" class="form-checkbox text-indigo-600" />
            </div>

            <div>
              <label class="text-sm text-nowrap">Fecha de Inicio</label>
              <VueDatePicker
                input-class-name="font-Poppins"
                v-model="experience.start_date"
                placeholder="Seleccione una fecha"
                model-type="dd/MM/yyyy"
                locale="es"
                format="dd/MM/yyyy"
                cancel-text="Cancelar"
                select-text="Seleccionar"
                :enable-time-picker="false"
                :day-names="['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']"
                text-input
              />
            </div>

            <div>
              <label class="text-sm text-nowrap">Fecha de Término</label>
              <VueDatePicker
                input-class-name="font-Poppins"
                v-model="experience.end_date"
                placeholder="Seleccione una fecha"
                model-type="dd/MM/yyyy"
                locale="es"
                format="dd/MM/yyyy"
                cancel-text="Cancelar"
                select-text="Seleccionar"
                :enable-time-picker="false"
                :day-names="['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']"
                text-input
                :disabled="inProgress" 
              />
            </div>
          </div>

          <div class="flex justify-end mt-6 space-x-4">
            <AppButton
              text="Guardar"
              type="submit"
              :icons="['fas', 'floppy-disk']"
              class="bg-mid-green text-dark-green border-0 hover:bg-dark-green hover:text-mid-green h-fit"
            />
            <AppButton
              text="Cancelar"
              type="button"
              :icons="['fas', 'circle-xmark']"
              class="bg-mid-red text-dark-red border-0 hover:bg-dark-red hover:text-mid-red h-fit"
              @click="closeModal"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
