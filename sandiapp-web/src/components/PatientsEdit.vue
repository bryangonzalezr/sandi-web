<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNutritionalProfileStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import { useRouter } from 'vue-router';
import AppSelect from '@/common/AppSelect.vue';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import { watch } from 'vue';




const router = useRouter();
const patientStore = useNutritionalProfileStore();
const loading = ref(true);



const props = defineProps({
  id: {
    type: String,
    required: true
  }
});



const user = ref({});
const nutritional_profile = ref({
  habits: {
    alcohol: '',
    tabaco: ''
  },
  nutritional_anamnesis: {
    plan_anterior: false,
    agua: false
  },
  morbid_antecedents: {
    dm2: false,
    hta: false,
    tiroides: false,
    dislipidemia: false,
    insulin_resistance: false,
    cirugias: '',
    farmacos: ''
  },
  subjective_assessment: {
    usual_weight: '',
    weight_variation: '',
    gastrointestinal_symptoms: '',
    appetite: '',
    digestion: ''
  },
  allergies: [],
  family_antecedents: {
    dm2: false,
    hta: false,
    tiroides: false,
    dislipidemia: false,
    comments: ''
  },
  physical_status: '',
  physical_comentario: '',
  physical_activity: null,
  patient_type: ''
});

const allergiesMapping = {
  'alcohol-free': 'Alcohol',
  'crustacean-free': 'Crustaceos',
  'dairy-free': 'Lacteos',
  'egg-free': 'Huevos',
  'fish-free': 'Pescado',
  'gluten-free': 'Gluten',
  'keto-friendly': 'Keto Amigable',
  'kidney-friendly': 'Apto Para Riñones',
  'kosher': 'Kosher',
  'lupine-free': 'Lupino',
  'mediterranean': 'Mediterraneo',
  'mollusk-free': 'Molusco',
  'mustard-free': 'Mostaza',
  'no-oil-added': 'Aceite',
  'paleo': 'Dieta Paleo',
  'peanut-free': 'Mani',
  'pescatarian': 'Pescetariano',
  'pork-free': 'Cerdo',
  'red-meat-free': 'Carne Roja',
  'sesame-free': 'Sesamo',
  'shellfish-free': 'Marisco',
  'soy-free': 'Soya',
  'sugar-conscious': 'Azucar Consciente',
  'tree-nut-free': 'Frutos Secos',
  'vegan': 'Vegano',
  'vegetarian': 'Vegetariano',
  'wheat-free': 'Trigo'
};

const allergiesInput = ref('');
const recognizedAllergies = ref([]);
const selectedAllergies = ref([]);





const options = Object.keys(allergiesMapping).map(key => ({
  value: key,
  label: allergiesMapping[key]
}));

// Cargar los datos actuales del perfil al montar el componente
const loadPatientProfile = async () => {
  loading.value = true;
  await patientStore.ShowPatientProfile(props.id);
  
  const data = patientStore.GetData || {};
  user.value = data.user || {};

  
  nutritional_profile.value = {
    id: data.nutritional_profile?.id || null,
    habits: data.nutritional_profile?.habits || { alcohol: '', tabaco: '' },
    nutritional_anamnesis: data.nutritional_profile?.nutritional_anamnesis || { plan_anterior: false, agua: false },
    morbid_antecedents: data.nutritional_profile?.morbid_antecedents || { dm2: false, hta: false, tiroides: false, dislipidemia: false, insulin_resistance: false, cirugias: '', farmacos: '' },
    subjective_assessment: data.nutritional_profile?.subjective_assessment || { usual_weight: '', weight_variation: '', gastrointestinal_symptoms: '', appetite: '', digestion: '' },
    allergies: data.nutritional_profile?.allergies || [],
    family_antecedents: data.nutritional_profile?.family_antecedents || { dm2: false, hta: false, tiroides: false, dislipidemia: false, comments: '' },
    physical_status: data.nutritional_profile?.physical_status || '',
    physical_comentario: data.nutritional_profile?.physical_comentario || '',
    physical_activity: data.nutritional_profile?.physical_activity || null,
    patient_type: data.nutritional_profile?.patient_type || ''
  };
  allergiesInput.value = nutritional_profile.value.allergies.join(', ');
  loading.value = false;
};

// Guardar los cambios en el perfil nutricional
const updatePatientProfile = async () => {
  const updatedProfile = { ...nutritional_profile.value };
  await patientStore.EditPatientProfile(updatedProfile.id, updatedProfile);
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

// Volver a la vista anterior
const goBack = () => {
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

onMounted(() => {
  loadPatientProfile();
});

watch(selectedAllergies, (newAllergies) => {
  nutritional_profile.value.allergies = newAllergies.map(allergy => allergy.value);
  
});


watch(nutritional_profile, (newProfile) => {
  selectedAllergies.value = newProfile.allergies.map(allergy => {
    return options.find(option => option.value === allergy);
  });
});


</script>

<template>
  <AppButton
    class="w-fit bg-light-gray border-0 px-3 mx-6 mb-5 lg:rounded-none lg:rounded-b-lg"
    type="button"
    text="Volver"
    :icons="['fas', 'arrow-left']"
    @click="goBack"
  />
  <div class="flex flex-col py-2 px-10 gap-y-3">
    <div class="flex flex-col">
      <h1 class="text-2xl flex items-center gap-2">
        <font-awesome-icon :icon="faUser" class="text-black" />
        Editar perfil nutricional
      </h1>
      <h2>Editando el perfil de {{ user.name || 'Paciente' }}</h2>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-else>
      <form @submit.prevent="updatePatientProfile">
        <div class="overflow-x-auto relative">
          <table class="w-full text-sm text-left bg-forest-green text-black rounded">
            <thead class="bg-neutral-beige text-left leading-4 text-black tracking-wider">
              <tr>
                <th scope="col" class="px-6 py-4 w-1/3">Sección</th>
                <th scope="col" class="px-6 py-4 w-2/3">Detalles</th>
              </tr>
            </thead>
            <tbody>
              <!-- Patient Status Section -->
              <tr class="border-b border-light-gray">
                <td class="px-6 py-4 font-medium text-black w-1/3">Estado paciente</td>
                <td class="px-6 py-4 w-2/3">
                  <table class="w-full text-sm text-left text-black rounded">
                    <tbody>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Nivel de Actividad Física</td>
                        <td class="px-6 py-4 w-1/2">
                          <AppSelect 
                            :options="{'Leve': 'Leve', 'Moderada': 'Moderada', 'Pesada': 'Pesada'}" 
                            :firstOptionValue="'Selecciona nivel de actividad física'" 
                            v-model:selectedOption="nutritional_profile.physical_status"
                            classSelect="profile-edit" 
                            />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Tipo de Paciente</td>
                        <td class="px-6 py-4 w-1/2">
                          <AppSelect 
                            :options="{'Ambulatorio': 'Ambulatorio', 'Enfermo': 'Enfermo'}" 
                            :firstOptionValue="'Selecciona tipo de paciente'" 
                            v-model:selectedOption="nutritional_profile.patient_type" 
                            classSelect="profile-edit" 

                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Habits Section -->
              <tr class="border-b border-light-gray">
                <td class="px-6 py-4 font-medium text-black w-1/3">Hábitos</td>
                <td class="px-6 py-4 w-2/3">
                  <table class="w-full text-sm text-left text-black rounded">
                    <tbody>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Alcohol</td>
                        <td class="px-6 py-4 w-1/2">
                          <AppSelect 
                            :options="{'Alto': 'Alto', 'Moderado': 'Moderado', 'Poco': 'Poco', 'Nada': 'Nada'}" 
                            :firstOptionValue="'Selecciona nivel de alcohol'" 
                            v-model:selectedOption="nutritional_profile.habits.alcohol" 
                            classSelect="profile-edit" 

                          />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Tabaco</td>
                        <td class="px-6 py-4 w-1/2">
                          <AppSelect 
                            :options="{'Alto': 'Alto', 'Moderado': 'Moderado', 'Poco': 'Poco', 'Nada': 'Nada'}" 
                            :firstOptionValue="'Selecciona nivel de Tabaco'" 
                            v-model:selectedOption="nutritional_profile.habits.tabaco" 
                            classSelect="profile-edit" 

                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Anamnesis Section -->
              <tr class="border-b border-light-gray">
                <td class="px-6 py-4 font-medium text-black w-1/3">Anamnesis Nutricional</td>
                <td class="px-6 py-4 w-2/3">
                  <table class="w-full text-sm text-left text-black rounded">
                    <tbody>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Experiencia en planes nutricionales</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.nutritional_anamnesis.plan_anterior" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Buen consumo de agua</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.nutritional_anamnesis.agua" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Personal Background Section -->
              <tr class="border-b border-light-gray">
                <td class="px-6 py-4 font-medium text-black w-1/3">Antecedentes Personales</td>
                <td class="px-6 py-4 w-2/3">
                  <table class="w-full text-sm text-left text-black rounded">
                    <tbody>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2 font-medium text-black">Restricciones alimenticias</td>
                        <td class="px-6 py-4 w-1/2">
                          <VueMultiselect
                            v-model="selectedAllergies"
                            :options="options"
                            :close-on-select="false"
                            :multiple="true"
                            :clear-on-select="false"
                            :show-labels="false"
                            placeholder="Selecciona las alergias"
                            label="label"
                            track-by="value"
                            class="bg-warm-beige border border-forest-green rounded"
                          >
                            <template #selection="{ values }">
                              <div v-for="value in values" :key="value.value" class="multiselect__tag">
                                {{ value.label }}
                                <span class="multiselect__tag-icon" @click="selectedAllergies.splice(selectedAllergies.indexOf(value), 1)"></span>
                              </div>
                            </template>
                          </VueMultiselect>

                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Diabetes</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.morbid_antecedents.dm2" type="checkbox" 
                          class="rounded bg-dark-green" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Hipertensión</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.morbid_antecedents.hta" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Tiroides</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.morbid_antecedents.tiroides" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Resistencia a la Insulina</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.morbid_antecedents.insulin_resistance" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Dislipidemia</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.morbid_antecedents.dislipidemia" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Cirugías</td>
                        <td class="px-6 py-4 w-1/2">
                          <textarea v-model="nutritional_profile.morbid_antecedents.cirugias" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Fármacos</td>
                        <td class="px-6 py-4 w-1/2">
                          <textarea v-model="nutritional_profile.morbid_antecedents.farmacos" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Examenes</td>
                        <td class="px-6 py-4 w-1/2">
                          <textarea v-model="nutritional_profile.morbid_antecedents.exams" class="rounded" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Family Background Section -->
              <tr class="border-b border-light-gray">
                <td class="px-6 py-4 font-medium text-black w-1/3">Antecedentes Familiares</td>
                <td class="px-6 py-4 w-2/3">
                  <table class="w-full text-sm text-left text-black rounded">
                    <tbody>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Diabetes</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.family_antecedents.dm2" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Hipertensión</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.family_antecedents.hta" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Tiroides</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.family_antecedents.tiroides" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Dislipidemia</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.family_antecedents.dislipidemia" type="checkbox" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Comentarios</td>
                        <td class="px-6 py-4 w-1/2">
                          <textarea v-model="nutritional_profile.family_antecedents.comments" class="rounded" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Nutritional Anamnesis Section -->
              <tr class="border-b border-light-gray">
                <td class="px-6 py-4 font-medium text-black w-1/3">Anamnesis Nutricional</td>
                <td class="px-6 py-4 w-2/3">
                  <table class="w-full text-sm text-left text-black rounded">
                    <tbody>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Peso Usual</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.subjective_assessment.usual_weight" type="text" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Síntomas Gastrointestinales</td>
                        <td class="px-6 py-4 w-1/2">
                          <textarea v-model="nutritional_profile.subjective_assessment.gastrointestinal_symptoms" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                        <td class="px-6 py-4 w-1/2">Variación de Peso</td>
                        <td class="px-6 py-4 w-1/2">
                          <input v-model="nutritional_profile.subjective_assessment.weight_variation" type="text" class="rounded" />
                        </td>
                      </tr>
                      <tr class="bg-warm-beige">
                      <td class="px-6 py-4 w-1/2" >Apetito</td>
                      <td class="px-6 py-4 w-1/2">
                        <textarea v-model="nutritional_profile.subjective_assessment.appetite" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige">
                      <td class="px-6 py-4 w-1/2">Digestión</td>
                      <td class="px-6 py-4 w-1/2">
                        <textarea v-model="nutritional_profile.subjective_assessment.digestion" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige">
                      <td class="px-6 py-4 w-1/2">Frecuencia de Digestión</td>
                      <td class="px-6 py-4 w-1/2">
                        <textarea v-model="nutritional_profile.subjective_assessment.digestion_frequency" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige">
                      <td class="px-6 py-4 w-1/2">Medidas de Digestión</td>
                      <td class="px-6 py-4 w-1/2">
                        <textarea v-model="nutritional_profile.subjective_assessment.digestion_measures" class="rounded" />
                      </td>
                    </tr>
                  </tbody>
                </table>
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
        :icons="['fas', 'save']"

        text="Guardar Cambios" 
        />
        <AppButton 
        class="bg-mid-red text-dark-red border-0 hover:bg-dark-red hover:text-mid-red p-1"
        type="button" 
        text="Cancelar" 
        :icons="['fas', 'circle-xmark']"

        @click="goBack" 
        />
      </div>
    </form>
  </div>
  </div>
</template>

<style>
.multiselect__option--highlight {
  background: var(--neutral-green) !important;
}

.multiselect__tag {
  background: var(--neutral-green);
  border: 1px solid var(--forest-green);
  color: var(--dak-gray);
}

</style>