<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNutritionalProfileStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import { useRouter } from 'vue-router';
import AppSelect from '@/common/AppSelect.vue';


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
    plan_anterior: '',
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

// New ref for allergies input
const allergiesInput = ref('');

// Computed property to convert allergies array to string
const allergiesString = computed({
  get: () => nutritional_profile.value.allergies.join(', '),
  set: (val) => {
    nutritional_profile.value.allergies = val.split(',').map(item => item.trim()).filter(item => item !== '');
  }
});


// Cargar los datos actuales del perfil al montar el componente
const loadPatientProfile = async () => {
  loading.value = true;
  await patientStore.ShowPatientProfile(props.id);
  
  const data = patientStore.GetData || {};
  user.value = data.user || {};

  
  nutritional_profile.value = {
    id: data.nutritional_profile?.id || null,
    habits: data.nutritional_profile?.habits || { alcohol: '', tabaco: '' },
    nutritional_anamnesis: data.nutritional_profile?.nutritional_anamnesis || { plan_anterior: '', agua: false },
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
  updatedProfile.allergies = allergiesInput.value.split(',').map(item => item.trim()).filter(item => item !== '');
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
</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="flex flex-col">
      <AppButton
          class="w-fit border-0 px-0 my-2"
          type="button"
          text="Volver"
          :icons="['fas', 'arrow-left']"
          @click="goBack"
        />
      <h1 class="uppercase text-2xl">Editar Perfil Nutricional</h1>
      <h2>Editando el perfil de {{ user.name || 'Paciente' }}</h2>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">  Loading...</span>
    </div>

    <div v-else>
    <form @submit.prevent="updatePatientProfile">
      <!-- Tabla principal que agrupa las tablas anidadas -->
      <div class="overflow-x-auto relative">
        <table class="w-full text-sm text-left border-black bg-forest-green text-black rounded">
          <thead class="text-xs text-black uppercase ">
            <tr>
              <th scope="col" class="px-6 py-3">Sección</th>
              <th scope="col" class="px-6 py-3">Detalles</th>
            </tr>
          </thead>
          <tbody>
            <!-- Tabla anidada para hábitos -->
            <tr class="bg-white border-b">
              <td class="px-6 py-4 font-medium text-black">Hábitos</td>
              <td class="px-6 py-4">
                <table class="w-full text-sm text-left text-black rounded border border-black">
                  <tbody>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Alcohol</td>
                      <td class="px-6 py-4">
                        <AppSelect 
                          :options="{'Alto': 'Alto', 'Moderado': 'Moderado', 'Poco': 'Poco', 'Nada': 'Nada'}" 
                          :firstOptionValue="'Selecciona nivel de alcohol'" 
                          v-model:selectedOption="nutritional_profile.habits.alcohol" 
                        />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Tabaco</td>
                      <td class="px-6 py-4">
                        <AppSelect 
                          :options="{'Alto': 'Alto', 'Moderado': 'Moderado', 'Poco': 'Poco', 'Nada': 'Nada'}" 
                          :firstOptionValue="'Selecciona nivel de Tabaco'" 
                          v-model:selectedOption="nutritional_profile.habits.tabaco" 
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Tabla anidada para anamnesis nutricional -->
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4 font-medium text-black">Anamnesis Nutricional</td>
              <td class="px-6 py-4">
                <table class="w-full text-sm text-left text-black rounded border border-black">
                  <tbody>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Plan Anterior</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.nutritional_anamnesis.plan_anterior" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Agua</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.nutritional_anamnesis.agua" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Añadir más tablas anidadas para otros campos, como Antecedentes, etc. -->
            <!-- Ejemplo de Antecedentes mórbidos -->
            <tr class="bg-white border-b">
              <td class="px-6 py-4 font-medium text-black">Antecedentes Personales</td>
              <td class="px-6 py-4">
                <table class="w-full text-sm text-left text-black rounded border border-black">
                  <tbody>
                    <!-- Añadir Alergias aqui -->
                    <tr class="bg-white border-b">
                      <td class="px-6 py-4 font-medium text-black">Alergias</td>
                      <td class="px-6 py-4">
                        <textarea 
                          v-model="allergiesInput"
                          class="w-full p-2 border rounded"
                          placeholder="Ingrese alergias separadas por comas (e.j., gluten, lactosa, maní)"
                        ></textarea>
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Diabetes</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.morbid_antecedents.dm2" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Hipertensión</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.morbid_antecedents.hta" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <!-- Añadir más campos de antecedentes aquí -->
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Tiroides</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.morbid_antecedents.tiroides" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Resistencia a la Insulina</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.morbid_antecedents.insulin_resistance" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Dislipidemia</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.morbid_antecedents.dislipidemia" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Cirugías</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.morbid_antecedents.cirugias" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Fármacos</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.morbid_antecedents.farmacos" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Examenes</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.morbid_antecedents.exams" class="rounded" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <!-- Ejemplo de Antecedentes familiares -->
            <tr class="bg-forest-green border-b">
              <td class="px-6 py-4 font-medium text-black">Antecedentes Familiares</td>
              <td class="px-6 py-4">
                <table class="w-full text-sm text-left text-black rounded border border-black">
                  <tbody>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Diabetes</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.family_antecedents.dm2" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Hipertensión</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.family_antecedents.hta" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Tiroides</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.family_antecedents.tiroides" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Dislipidemia</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.family_antecedents.dislipidemia" type="checkbox" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Comentarios</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.family_antecedents.comments" class="rounded" />
                      </td>
                    </tr>
                  </tbody>
                </table>  
              </td>
            </tr>
            <!-- Ejemplo de Anamnesis Nutricional -->
            <tr class="bg-white border-b">
              <td class="px-6 py-4 font-medium text-black">Anamnesis Nutricional</td>
              <td class="px-6 py-4">
                <table class="w-full text-sm text-left text-black rounded border border-black">
                  <tbody>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Peso Usual</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.subjective_assessment.usual_weight" type="text" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Síntomas Gastrointestinales</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.subjective_assessment.gastrointestinal_symptoms" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Variación de Peso</td>
                      <td class="px-6 py-4">
                        <input v-model="nutritional_profile.subjective_assessment.weight_variation" type="text" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Apetito</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.subjective_assessment.appetite" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Digestión</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.subjective_assessment.digestion" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Frecuencia de Digestión</td>
                      <td class="px-6 py-4">
                        <textarea v-model="nutritional_profile.subjective_assessment.digestion_frequency" class="rounded" />
                      </td>
                    </tr>
                    <tr class="bg-warm-beige border-b">
                      <td class="px-6 py-4">Medidas de Digestión</td>
                      <td class="px-6 py-4">
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
      <div class="mt-8 flex gap-4">
        <AppButton 
        class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
        type="submit" 
        text="Guardar Cambios" 
        />
        <AppButton 
        class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black" 
        type="button" 
        text="Cancelar" 
        @click="goBack" 
        />
      </div>
    </form>
  </div>
  </div>
</template>
