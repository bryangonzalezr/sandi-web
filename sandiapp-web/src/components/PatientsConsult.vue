<script setup>
import { ref, onMounted } from 'vue';
import { useNutritionalProfileStore } from '@/stores';
import { useConsultStore } from '@/stores/consult.store';
import AppButton from '@/common/AppButton.vue';
import { useRouter } from 'vue-router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
const consultStore = useConsultStore();
const router = useRouter();
const loading = ref(true);
const perfilStore = useNutritionalProfileStore();
const user = ref({});



const props = defineProps({
  id: {
    type: String,
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
  fecha.value = `${year}-${month}-${day}`;
};

// Función para guardar la consulta
const saveConsult = async () => {
  const consultData = { ...consulta.value };
  consultData.date = fecha.value;
  consultData.patient_id = parseInt(props.id);
  await consultStore.saveConsult(props.id,consultData);
};

// Función para regresar a la página anterior
const goBack = () => {
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

const getUser = async () => {
  await perfilStore.ShowPatientProfile(props.id);
  user.value = perfilStore.GetData.user;
}

onMounted(() => {
  loading.value = true;
  // Obtener la fecha actual al montar el componente
  getUser();
  getCurrentDate();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <AppButton
    class="w-fit bg-light-gray border-0 px-3 mx-6 mb-5 rounded-none rounded-b-lg"
    type="button"
    text="Volver"
    :icons="['fas', 'arrow-left']"
    @click="goBack"
  />
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="flex flex-col">
      <h1 class="text-2xl flex items-center gap-2">
        <font-awesome-icon :icon="faUser" class="text-black" />
        Crear Consulta
      </h1>
      <h2>Consulta del paciente: {{ user?.name }}</h2>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">  Loading...</span>
    </div>

    <div v-else>
    <form @submit.prevent="saveConsult">
      <!-- Tabla para ingresar los datos de la consulta -->
      <div class="overflow-x-auto relative">
        <table class="w-full text-sm text-left text-black rounded-lg">
          <thead class="px-3 py-3 bg-neutral-beige text-left leading-4 text-black tracking-wider items-center">
            <tr>
              <th scope="col" class="px-6 py-3">Campo</th>
              <th scope="col" class="px-6 py-3">Valor</th>
              <th scope="col" class="px-6 py-3">Campo</th>
              <th scope="col" class="px-6 py-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            <!-- Fila 1: Altura y Peso -->
            <tr class="bg-warm-beige border-b border-light-gray">
              <td class="px-6 py-4">Altura (m)</td>
              <td class="px-6 py-4">
                <input v-model="consulta.height" type="number" step="0.01" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">Peso (kg)</td>
              <td class="px-6 py-4">
                <input v-model="consulta.weight" type="number" step="0.1" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 2: Pliegue Bicipital y Pliegue Tricipital -->
            <tr class="bg-forest-green border-b border-light-gray">
              <td class="px-6 py-4">Pliegue Bicipital</td>
              <td class="px-6 py-4">
                <input v-model="consulta.bicipital_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">Pliegue Tricipital</td>
              <td class="px-6 py-4">
                <input v-model="consulta.tricipital_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 3: Pliegue Subescapular y Pliegue Supraespinal -->
            <tr class="bg-warm-beige border-b border-light-gray">
              <td class="px-6 py-4">Pliegue Subescapular</td>
              <td class="px-6 py-4">
                <input v-model="consulta.subscapular_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">Pliegue Supraespinal</td>
              <td class="px-6 py-4">
                <input v-model="consulta.supraspinal_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 4: Pliegue Suprailíaco y Pliegue Muslo -->
            <tr class="bg-forest-green border-b border-light-gray">
              <td class="px-6 py-4">Pliegue Suprailíaco</td>
              <td class="px-6 py-4">
                <input v-model="consulta.suprailiac_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">Pliegue Muslo</td>
              <td class="px-6 py-4">
                <input v-model="consulta.thigh_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 5: Pliegue Pantorrilla y Pliegue Abdominal -->
            <tr class="bg-warm-beige border-b border-light-gray">
              <td class="px-6 py-4">Pliegue Pantorrilla</td>
              <td class="px-6 py-4">
                <input v-model="consulta.calf_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">Pliegue Abdominal</td>
              <td class="px-6 py-4">
                <input v-model="consulta.abdomen_skinfold" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 6: PB Relajado y PB Contraído -->
            <tr class="bg-forest-green border-b border-light-gray">
              <td class="px-6 py-4">PB Relajado</td>
              <td class="px-6 py-4">
                <input v-model="consulta.pb_relaj" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">PB Contraído</td>
              <td class="px-6 py-4">
                <input v-model="consulta.pb_contra" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 7: Antebrazo y Muslo -->
            <tr class="bg-warm-beige border-b border-light-gray">
              <td class="px-6 py-4">Antebrazo</td>
              <td class="px-6 py-4">
                <input v-model="consulta.forearm" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">Muslo</td>
              <td class="px-6 py-4">
                <input v-model="consulta.thigh" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 8: Pantorrilla y Cintura -->
            <tr class="bg-forest-green border-b border-light-gray">
              <td class="px-6 py-4">Pantorrilla</td>
              <td class="px-6 py-4">
                <input v-model="consulta.calf" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
              <td class="px-6 py-4">Cintura</td>
              <td class="px-6 py-4">
                <input v-model="consulta.waist" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2" placeholder="Ingrese Valor" />
              </td>
            </tr>

            <!-- Fila 9: Tórax -->
            <tr class="bg-warm-beige border-b border-light-gray">
              <td class="px-6 py-4">Tórax</td>
              <td class="px-6 py-4">
                <input v-model="consulta.thorax" type="number" class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2 " placeholder="Ingrese Valor"/>
              </td>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>



      <!-- Botones de acción -->
      <div class="mt-8 flex justify-end gap-4">
        <AppButton 
        class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
        type="submit" 
        :icons="['fas', 'save']"
        text="Guardar Consulta" />
        <AppButton 
        class="bg-mid-red text-dark-red border-0 hover:bg-dark-red hover:text-mid-red p-1"
        type="button" 
        text="Cancelar" 
        :icons="['fas', 'circle-xmark']"
        @click="goBack" />
      </div>
    </form>
    </div>
  </div>
</template>