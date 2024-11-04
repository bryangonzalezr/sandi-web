<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import AppInput from '@/common/AppInput.vue';


const router = useRouter();
const usePlan = usePlanStore();

const loading = ref(true);
const plansFiled = ref([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);

const customPosition = () => ({ top: -100, left: 0 });

// Headers para la tabla
const headers = ['N° Plan', 'Fecha', 'Desayuno', 'Almuerzo', 'Colación', 'Once', 'Cena', 'Acciones'];

const goToBack = () => {
  router.push({ name: "Patients" });
};

const formatDate = function(dateString) {
  const date = new Date(dateString);
  
  // Verifica si la fecha es inválida
  if (isNaN(date)) {
    return "Invalid date";
  }
  const day = String(date.getUTCDate()).padStart(2, '0');  
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  
  return `${day}-${month}-${year}`;
};

const obtainDate = () => {
  const date = new Date();
  selectedDate.value = date.toISOString().split('T')[0];
};

const getData = async (date) => {
  loading.value = true;
  await usePlan.ShowPlanfiled(date);
  plansFiled.value = usePlan.GetPlansfiled;
  loading.value = false;
};

const handleDateChange = () => {
  getData(selectedDate.value);
};

// Función para ver detalles del plan
const viewPlanDetails = (plan) => {
  Swal.fire({
    title: 'Detalles del Plan Nutricional',
    html: `
      ${plan.general_recommendations ? `<p><strong>Recomendaciones Generales:</strong><br>${plan.general_recommendations}</p><br>` : ''}
      ${plan.forbidden_foods ? `<p><strong>Alimentos a Limitar:</strong><br>${plan.forbidden_foods}</p><br>` : ''}
      ${plan.free_foods ? `<p><strong>Alimentos Libres:</strong><br>${plan.free_foods}</p>` : ''}
    `,
    width: '600px',
  });
};

onMounted(() => {
  obtainDate();
  getData();
});
</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <!-- Título sección -->
    <div class="flex flex-col">
      <div class="flex items-center gap-4">
        <h1 class="uppercase text-2xl">Planes Archivados</h1>
      </div>
      <h2>Control de Planes Nutricionales</h2>
      <AppButton
        class="w-fit border-0 px-0 my-1 bg-forest-green enabled:hover:bg-white enabled:hover:text-black"
        type="button"
        text="Volver"
        :icons="['fas', 'arrow-left']"
        @click="goToBack"
      />
    </div>

    <!-- Filtro de fecha -->
    <div class="flex items-center gap-4">
        <VueDatePicker
            input-class-name="font-Poppins"
            v-model="selectedDate"
            placeholder="Seleccione una fecha"
            model-type="dd-MM-yyyy"
            locale="es"
            format="dd-MM-yyyy"
            cancel-text="Cancelar"
            select-text="Seleccionar"
            :enable-time-picker="false"
            :day-names="['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']"
            text-input
            :alt-position="customPosition"
            @update:model-value="handleDateChange"
          />
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">Loading...</span>
    </div>

    <!-- Tabla de planes -->
    <div v-else>
      <table class="min-w-full" v-if="plansFiled.length > 0">
        <thead class="bg-forest-green">
          <tr class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)]">
            <th
              v-for="header in headers"
              :key="header"
              class="px-3 py-3 border-b border-gray text-left leading-4 text-black tracking-wider items-center"
            >
              <div class="flex items-center gap-2">
                {{ header }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="(plan, index) in plansFiled"
            :key="plan._id"
            class="w-full px-11 border-b border-b-gray hover:bg-gray-50"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ formatDate(plan.created_at) }}</td>
            <td class="p-3">
              <div class="max-w-xs truncate">{{ plan.desayuno || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-xs truncate">{{ plan.almuerzo || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-xs truncate">{{ plan.colacion || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-xs truncate">{{ plan.once || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-xs truncate">{{ plan.cena || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="flex gap-2">
                <AppButton
                  class="text-violet"
                  type="icon"
                  hoverText="Ver detalles"
                  :icons="['fas', 'eye']"
                  @click="viewPlanDetails(plan)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-8 text-gray-600 bg-white rounded-lg shadow-md">
        No hay planes nutricionales archivados con la fecha seleccionada
      </div>
    </div>
  </div>
</template>