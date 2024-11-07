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
const errors = ref({});
const isSubmitting = ref(false);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const patientId = ref(props.id);
const fecha = ref('');

// Definir mensajes de error personalizados para cada campo
const errorMessages = {
  height: 'Por favor ingrese una altura válida en metros',
  weight: 'Por favor ingrese un peso válido en kilogramos',
  bicipital_skinfold: 'Por favor ingrese el valor del pliegue bicipital',
  tricipital_skinfold: 'Por favor ingrese el valor del pliegue tricipital',
  subscapular_skinfold: 'Por favor ingrese el valor del pliegue subescapular',
  supraspinal_skinfold: 'Por favor ingrese el valor del pliegue supraespinal',
  suprailiac_skinfold: 'Por favor ingrese el valor del pliegue suprailíaco',
  thigh_skinfold: 'Por favor ingrese el valor del pliegue del muslo',
  calf_skinfold: 'Por favor ingrese el valor del pliegue de la pantorrilla',
  abdomen_skinfold: 'Por favor ingrese el valor del pliegue abdominal',
  pb_relaj: 'Por favor ingrese el valor del perímetro de brazo relajado',
  pb_contra: 'Por favor ingrese el valor del perímetro de brazo contraído',
  forearm: 'Por favor ingrese el valor del perímetro del antebrazo',
  thigh: 'Por favor ingrese el valor del perímetro del muslo',
  calf: 'Por favor ingrese el valor del perímetro de la pantorrilla',
  waist: 'Por favor ingrese el valor del perímetro de la cintura',
  thorax: 'Por favor ingrese el valor del perímetro del tórax'
};

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

const validateField = (fieldName, value) => {
  if (!value || value === '') {
    errors.value[fieldName] = errorMessages[fieldName];
    return false;
  } else if (value <= 0) {
    errors.value[fieldName] = `El valor debe ser mayor que 0`;
    return false;
  }
  delete errors.value[fieldName];
  return true;
};

const validateForm = () => {
  let isValid = true;
  for (const field in consulta.value) {
    if (field !== 'date' && field !== 'patient_id') {
      if (!validateField(field, consulta.value[field])) {
        isValid = false;
      }
    }
  }
  return isValid;
};

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  fecha.value = `${year}-${month}-${day}`;
};

const saveConsult = async () => {
  if (validateForm()) {
    isSubmitting.value = true;
    const consultData = { ...consulta.value };
    consultData.date = fecha.value;
    consultData.patient_id = parseInt(props.id);
    try {
      await consultStore.saveConsult(props.id, consultData);
    }finally {
      isSubmitting.value = false;
    }
  }
};

const goBack = () => {
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

const getUser = async () => {
  await perfilStore.ShowPatientProfile(props.id);
  user.value = perfilStore.GetData.user;
};

onMounted(() => {
  loading.value = true;
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
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-else>
      <form @submit.prevent="saveConsult">
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
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.height"
                      type="number"
                      step="0.01"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.height}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('height', consulta.height)"
                    />
                    <span v-if="errors.height" class="text-red-500 text-xs mt-1">{{ errors.height }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">Peso (kg)</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.weight"
                      type="number"
                      step="0.1"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.weight}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('weight', consulta.weight)"
                    />
                    <span v-if="errors.weight" class="text-red-500 text-xs mt-1">{{ errors.weight }}</span>
                  </div>
                </td>
              </tr>

              <!-- Fila 2: Pliegue Bicipital y Pliegue Tricipital -->
              <tr class="bg-forest-green border-b border-light-gray">
                <td class="px-6 py-4">Pliegue Bicipital</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.bicipital_skinfold"
                      type="number"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.bicipital_skinfold}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('bicipital_skinfold', consulta.bicipital_skinfold)"
                    />
                    <span v-if="errors.bicipital_skinfold" class="text-red-500 text-xs mt-1">{{ errors.bicipital_skinfold }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">Pliegue Tricipital</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.tricipital_skinfold"
                      type="number"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.tricipital_skinfold}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('tricipital_skinfold', consulta.tricipital_skinfold)"
                    />
                    <span v-if="errors.tricipital_skinfold" class="text-red-500 text-xs mt-1">{{ errors.tricipital_skinfold }}</span>
                  </div>
                </td>
              </tr>

              <!-- Fila 3: Pliegue Subescapular y Pliegue Supraespinal -->
              <tr class="bg-warm-beige border-b border-light-gray">
                <td class="px-6 py-4">Pliegue Subescapular</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.subscapular_skinfold"
                      type="number"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.subscapular_skinfold}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('subscapular_skinfold', consulta.subscapular_skinfold)"
                    />
                    <span v-if="errors.subscapular_skinfold" class="text-red-500 text-xs mt-1">{{ errors.subscapular_skinfold }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">Pliegue Supraespinal</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.supraspinal_skinfold"
                      type="number"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.supraspinal_skinfold}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('supraspinal_skinfold', consulta.supraspinal_skinfold)"
                    />
                    <span v-if="errors.supraspinal_skinfold" class="text-red-500 text-xs mt-1">{{ errors.supraspinal_skinfold }}</span>
                  </div>
                </td>
              </tr>

              <!-- Fila 4: Pliegue Suprailíaco y Pliegue Muslo -->
              <tr class="bg-forest-green border-b border-light-gray">
                <td class="px-6 py-4">Pliegue Suprailíaco</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.suprailiac_skinfold"
                      type="number"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.suprailiac_skinfold}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('suprailiac_skinfold', consulta.suprailiac_skinfold)"
                    />
                    <span v-if="errors.suprailiac_skinfold" class="text-red-500 text-xs mt-1">{{ errors.suprailiac_skinfold }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">Pliegue Muslo</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <input
                      v-model="consulta.thigh_skinfold"
                      type="number"
                      class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                      :class="{'border-2 border-red-500': errors.thigh_skinfold}"
                      placeholder="Ingrese Valor"
                      @blur="validateField('thigh_skinfold', consulta.thigh_skinfold)"
                    />
                    <span v-if="errors.thigh_skinfold" class="text-red-500 text-xs mt-1">{{ errors.thigh_skinfold }}</span>
                  </div>
                </td>
              </tr>

            <!-- Fila 5: Pliegue Pantorrilla y Pliegue Abdominal -->
            <tr class="bg-warm-beige border-b border-light-gray">
            <td class="px-6 py-4">Pliegue Pantorrilla</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.calf_skinfold"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.calf_skinfold}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('calf_skinfold', consulta.calf_skinfold)"
                />
                <span v-if="errors.calf_skinfold" class="text-red-500 text-xs mt-1">{{ errors.calf_skinfold }}</span>
              </div>
            </td>
            <td class="px-6 py-4">Pliegue Abdominal</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.abdomen_skinfold"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.abdomen_skinfold}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('abdomen_skinfold', consulta.abdomen_skinfold)"
                />
                <span v-if="errors.abdomen_skinfold" class="text-red-500 text-xs mt-1">{{ errors.abdomen_skinfold }}</span>
              </div>
            </td>
          </tr>

          <!-- Fila 6: PB Relajado y PB Contraído -->
          <tr class="bg-forest-green border-b border-light-gray">
            <td class="px-6 py-4">PB Relajado</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.pb_relaj"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.pb_relaj}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('pb_relaj', consulta.pb_relaj)"
                />
                <span v-if="errors.pb_relaj" class="text-red-500 text-xs mt-1">{{ errors.pb_relaj }}</span>
              </div>
            </td>
            <td class="px-6 py-4">PB Contraído</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.pb_contra"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.pb_contra}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('pb_contra', consulta.pb_contra)"
                />
                <span v-if="errors.pb_contra" class="text-red-500 text-xs mt-1">{{ errors.pb_contra }}</span>
              </div>
            </td>
          </tr>

          <!-- Fila 7: Antebrazo y Muslo -->
          <tr class="bg-warm-beige border-b border-light-gray">
            <td class="px-6 py-4">Antebrazo</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.forearm"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.forearm}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('forearm', consulta.forearm)"
                />
                <span v-if="errors.forearm" class="text-red-500 text-xs mt-1">{{ errors.forearm }}</span>
              </div>
            </td>
            <td class="px-6 py-4">Muslo</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.thigh"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.thigh}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('thigh', consulta.thigh)"
                />
                <span v-if="errors.thigh" class="text-red-500 text-xs mt-1">{{ errors.thigh }}</span>
              </div>
            </td>
          </tr>

          <!-- Fila 8: Pantorrilla y Cintura -->
          <tr class="bg-forest-green border-b border-light-gray">
            <td class="px-6 py-4">Pantorrilla</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.calf"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.calf}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('calf', consulta.calf)"
                />
                <span v-if="errors.calf" class="text-red-500 text-xs mt-1">{{ errors.calf }}</span>
              </div>
            </td>
            <td class="px-6 py-4">Cintura</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <input
                  v-model="consulta.waist"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.waist}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('waist', consulta.waist)"
                />
                <span v-if="errors.waist" class="text-red-500 text-xs mt-1">{{ errors.waist }}</span>
              </div>
            </td>
          </tr>

          <!-- Fila 9: Tórax -->
          <tr class="bg-warm-beige border-b border-light-gray">
            <td class="px-6 py-4">Tórax</td>
            <td class="px-6 py-4" >
              <div class="flex flex-col">
                <input
                  v-model="consulta.thorax"
                  type="number"
                  class="input w-full rounded bg-neutral-beige placeholder-dark-gray p-2"
                  :class="{'border-2 border-red-500': errors.thorax}"
                  placeholder="Ingrese Valor"
                  @blur="validateField('thorax', consulta.thorax)"
                />
                <span v-if="errors.thorax" class="text-red-500 text-xs mt-1">{{ errors.thorax }}</span>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Botones de acción -->
      <div class="mt-8 flex justify-end gap-4">
        <AppButton 
        class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
        type="submit" 
        :disabled="isSubmitting"
        :icons="['fas', 'save']"
        text="Guardar Consulta" />
        <AppButton 
        class="bg-light-red text-dark-red border-0 p-1 hover:bg-dark-red hover:text-light-red"
        type="button" 
        text="Cancelar" 
        :icons="['fas', 'cancel']"
        @click="goBack" />
      </div>
    </form>
    </div>
  </div>
</template>
