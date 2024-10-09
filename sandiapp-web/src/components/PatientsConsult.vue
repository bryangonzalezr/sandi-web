<script setup>
import { ref, onMounted } from 'vue';
import { useConsultStore } from '@/stores/consult.store';
import AppButton from '@/common/AppButton.vue';
import { useRouter } from 'vue-router';

const consultStore = useConsultStore();
const router = useRouter();
const loading = ref(true);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

// Definir el ID del paciente desde los parámetros de la ruta
const patientId = ref(props.id);
const fecha = ref(''); // Aquí puedes usar una fecha predeterminada o manejar la fecha actual
const consulta = ref({
  date: '',
  patient_id: 0,
  height: '',
  weight: '',
  bicipital_skinfold: '',
  tricipital_skinfold: '',
  subscapular_skinfold: '',
  supraspinal_skinfold: '',
  suprailiac_skinfold: '',
  thigh_skinfold: '',
  calf_skinfold: '',
  abdomen_skinfold: '',
  pb_relaj: '',
  pb_contra: '',
  forearm: '',
  thigh: '',
  calf: '',
  waist: '',
  thorax: ''
});

// Función para obtener la fecha actual
const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
  const year = today.getFullYear();
  fecha.value = `${day}/${month}/${year}`;
};

// Función para guardar la consulta
const saveConsult = async () => {
  const consultData = { ...consulta.value };
  console.log(consultData);
  console.log(patientId.value);
  console.log(fecha.value);
  consultData.date = fecha.value;
  consultData.patient_id = parseInt(props.id);
  console.log(consultData);
  await consultStore.saveConsult(props.id,consultData);
};

// Función para regresar a la página anterior
const goBack = () => {
  router.push('/patient/' + props.id);
};

onMounted(() => {
  loading.value = true;
  // Obtener la fecha actual al montar el componente
  getCurrentDate();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="flex flex-col">
      <h1 class="uppercase text-2xl">Crear Consulta</h1>
      <h2>Para el paciente con ID: {{ patientId }}</h2>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">  Loading...</span>
    </div>

    <div v-else>
    <form @submit.prevent="saveConsult">
      <!-- Tabla para ingresar los datos de la consulta -->
      <div class="overflow-x-auto relative">
        <table class="w-full text-sm text-left text-black rounded-lg border border-gray-200">
          <thead class="text-xs text-black uppercase bg-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Campo</th>
              <th scope="col" class="px-6 py-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Altura (m)</td>
              <td class="px-6 py-4">
                <input v-model="consulta.height" type="number" step="0.01" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">Peso (kg)</td>
              <td class="px-6 py-4">
                <input v-model="consulta.weight" type="number" step="0.1" class="input w-full rounded-lg" />
              </td>
            </tr>
            <!-- Añadir más filas para los otros campos de la consulta -->
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Pliegue Bicipital</td>
              <td class="px-6 py-4">
                <input v-model="consulta.bicipital_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">Pliegue Tricipital</td>
              <td class="px-6 py-4">
                <input v-model="consulta.tricipital_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Pliegue Subescapular</td>
              <td class="px-6 py-4">
                <input v-model="consulta.subscapular_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">Pliegue Supraespinal</td>
              <td class="px-6 py-4">
                <input v-model="consulta.supraspinal_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Pliegue Suprailíaco</td>
              <td class="px-6 py-4">
                <input v-model="consulta.suprailiac_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">Pliegue Muslo</td>
              <td class="px-6 py-4">
                <input v-model="consulta.thigh_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Pliegue Pantorrilla</td>
              <td class="px-6 py-4">
                <input v-model="consulta.calf_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">Pliegue Abdominal</td>
              <td class="px-6 py-4">
                <input v-model="consulta.abdomen_skinfold" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">PB Relajado</td>
              <td class="px-6 py-4">
                <input v-model="consulta.pb_relaj" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">PB Contraído</td>
              <td class="px-6 py-4">
                <input v-model="consulta.pb_contra" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Antebrazo</td>
              <td class="px-6 py-4">
                <input v-model="consulta.forearm" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">Muslo</td>
              <td class="px-6 py-4">
                <input v-model="consulta.thigh" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Pantorrilla</td>
              <td class="px-6 py-4">
                <input v-model="consulta.calf" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4">Cintura</td>
              <td class="px-6 py-4">
                <input v-model="consulta.waist" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
            <tr class="bg-warm-beige border-b">
              <td class="px-6 py-4">Tórax</td>
              <td class="px-6 py-4">
                <input v-model="consulta.thorax" type="number" class="input w-full rounded-lg" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botones de acción -->
      <div class="mt-8 flex gap-4">
        <AppButton 
        class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black" 
        type="submit" 
        text="Guardar Consulta" />
        <AppButton 
        class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
        type="button" 
        text="Cancelar" 
        @click="goBack" />
      </div>
    </form>
    </div>
  </div>
</template>
