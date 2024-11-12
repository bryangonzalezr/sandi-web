<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/stores';
import Swal from "sweetalert2";
import AppButton from '@/common/AppButton.vue';


const router = useRouter();
const planStore = usePlanStore();

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
  await planStore.ShowPlanfiled(date);
  plansFiled.value = planStore.GetPlansfiled;
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
  <AppButton
    class="w-fit bg-light-gray border-0 px-3 mx-6 mb-5 lg:rounded-none lg:rounded-b-lg"
    type="button"
    text="Volver"
    :icons="['fas', 'arrow-left']"
    @click="goToBack"
  />
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <!-- Título sección -->
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <font-awesome-icon class="" :icon="['fas', 'box-archive']"></font-awesome-icon><h1 class="uppercase text-2xl">Planes archivados</h1>
      </div>
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
    <div v-if="loading" class="flex flex-col justify-center items-center gap-4">
      <img class="h-16 w-16 rounded-full animate-spin-slow" src="@/assets/images/Logo_instagram.svg"></img>
      <span class="visually-hidden">Cargando...</span>
    </div>

    <!-- Tabla de planes -->
    <div v-else>
      <table class="w-full" v-if="plansFiled.length > 0">
        <thead class="bg-mid-beige">
          <tr class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)]">
            <th
              v-for="header in headers"
              :key="header"
              class="p-3 border-b border-extralight-beige text-left text-black tracking-wider items-center"
            >
              <div class="flex items-center gap-2">
                {{ header }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-light">
          <tr
            v-for="(plan, index) in plansFiled"
            :key="plan._id"
            class="w-full border-b border-b-extralight-beige"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ formatDate(plan.created_at) }}</td>
            <td class="p-3">
              <div class="max-w-[90px] truncate">{{ plan.desayuno || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-[90px] truncate">{{ plan.almuerzo || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-[90px] truncate">{{ plan.colacion || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-[90px] truncate">{{ plan.once || '-' }}</div>
            </td>
            <td class="p-3">
              <div class="max-w-[90px] truncate">{{ plan.cena || '-' }}</div>
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