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
  console.log("Tipos de experiencias cargadas:", experienceTypes.value);
};

const saveExperience = async () => {
  try {
    console.log("Guardando experiencia:", experience.value);
    
    // Comprobación para asegurar que `type` tiene un valor válido
    if (!experience.value.type) {
      console.error("Tipo de experiencia no seleccionado");
      return;
    }

    // Aquí haríamos la llamada a la API usando el store
    await contactCardStore.CreateExperience(experience.value);


    console.log("Experiencia guardada exitosamente.");
   
    closeModal();
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
      <div v-if="loading" class="text-center text-black">Cargando tipos de experiencia...</div>
      
      <!-- Contenido del formulario -->
      <div v-else>
        <h2 class="text-xl font-bold text-black">Añadir Experiencia</h2>

        <form @submit.prevent="saveExperience">
          <!-- Contenedor de dos columnas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-black font-semibold">Título</label>
              <AppInput v-model="experience.title" type="text" class="w-full bg-gray-100 border border-white rounded py-2" required />
            </div>

            <div>
              <label class="block text-black font-semibold">Tipo</label>
              <AppSelect
                :options="experienceTypes.data"
                value="value"
                optionText="name"
                placeholder="Seleccione el tipo de experiencia"
                class="w-full bg-gray-100 border border-white rounded py-2"
                @update:selectedOption="setValue('type')"
              /> 
            </div>

            <div>
              <label class="block text-black font-semibold">Organización</label>
              <AppInput v-model="experience.institution" type="text" class="w-full bg-gray-100 border border-white rounded py-2" required />
            </div>

            <div>
              <label class="block text-black font-semibold">Descripción</label>
              <AppInput v-model="experience.description" type="text" class="w-full bg-gray-100 border border-white rounded py-2" required />
            </div>

            <div class="flex items-center col-span-1 md:col-span-2">
              <label class="block text-black font-semibold mr-2">En curso</label>
              <input v-model="inProgress" type="checkbox" class="form-checkbox text-indigo-600" />
            </div>

            <div>
              <label class="block text-black font-semibold">Fecha de Inicio</label>
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
              <label class="block text-black font-semibold">Fecha de Término</label>
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
              <!-- <p v-if="experience.startDate && experience.endDate && experience.startDate > experience.endDate" class="text-red-500 text-sm mt-1">
                La fecha de término no puede ser anterior a la fecha de inicio.
              </p> -->
            </div>
          </div>

          <div class="flex justify-end mt-6 space-x-4">
            <AppButton
              text="Cancelar"
              type="button"
              class="bg-mid-red text-white px-4 py-2 mt-4 rounded hover:bg-light-red"
              @click="closeModal"
            />
            <AppButton
              text="Guardar"
              type="submit"
              class="bg-neutral-green text-white px-6 py-2 mt-4 rounded hover:bg-light-green"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
