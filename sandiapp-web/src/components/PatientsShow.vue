<script setup>
import { ref, onMounted } from 'vue';
import { useNutritionalProfileStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import { useRouter } from 'vue-router';



const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const patientStore = useNutritionalProfileStore();
const user = ref({});
const nutritional_profile = ref({});
const router = useRouter();
const loading = ref(true);

const allergyTranslations = {
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
  'wheat-free': 'Trigo',
};

const translateAllergies = (allergies) => {
  return allergies.map(allergy => allergyTranslations[allergy] || allergy);
};

const GetData = async () => {
    loading.value = true;
    await patientStore.ShowPatientProfile(props.id);
    user.value = patientStore.GetData.user;
    nutritional_profile.value = patientStore.GetData.nutritional_profile;
    loading.value = false;
};

const goBack = () => {
  router.push({ name: 'Patients'});
};

const goEdit = () => {
  router.push({ name: 'PatientsEdit', params: { id: props.id } });
};

const goToConsult = () => {
  router.push({ name: 'PatientConsult', params: { id: props.id } });
};

const goToProgress = () => {
  router.push({ name: 'PatientProgress', params: { id: props.id } });
};

onMounted(async () => {
    GetData();
});
</script>



<template>
  <div class="flex flex-col py-2 px-10 gap-y-3">
    <!-- Titulo sección -->
    <div class="flex flex-col">
      <h1 class="uppercase text-2xl">Paciente</h1>
      <h2>Gestión del paciente: {{ user.name }}</h2>
      <AppButton
          class="w-fit border-0 px-0 my-1 bg-forest-green enabled:hover:bg-white enabled:hover:text-black"
          type="button"
          text="Volver"
          :icons="['fas', 'arrow-left']"
          @click="goBack"
        />
    </div>

    <div class="grid grid-cols-2 justify-between">
      <div class="grid grid-flow-col auto-cols-max gap-2">
        <AppButton
          type="button"
          text="Agregar consulta"
          :icons="['fas', 'plus']"
          @click="goToConsult"
        />
        <AppButton
          type="button"
          text="Agregar plan nutricional"
          :icons="['fas', 'plus']"
        />
        <AppButton
          type="button"
          text="Progreso"
          :icons="['fas', 'eye']"
          @click="goToProgress"
        />
      </div>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end">
        <AppButton
          class="bg-warm-beige text-black border-warm-beige enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
          type="button"
          text="Editar perfil"
          :icons="['fas', 'pen-to-square']"
          @click="goEdit"
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">  Loading...</span>
    </div>
    

    <div v-else>
      <!-- Tabla principal -->
      <table class="bg-white min-w-full table-auto border-collapse rounded border">
        <thead class="bg-forest-green text-white">
          <tr>
            <th class="border border-black px-4 py-2" colspan="2">Datos Personales</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-black px-4 py-2">Nombre</td>
            <td class="border border-black px-4 py-2">{{ user.name }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Apellido</td>
            <td class="border border-black px-4 py-2">{{ user.last_name }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Edad</td>
            <td class="border border-black px-4 py-2">{{ user.age }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Fecha de nacimiento</td>
            <td class="border border-black px-4 py-2">{{ user.birthdate }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Sexo</td>
            <td class="border border-black px-4 py-2">{{ user.sex }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Celular</td>
            <td class="border border-black px-4 py-2">{{ user.phone_number }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Estado Civil</td>
            <td class="border border-black px-4 py-2">{{ user.civil_status }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Objetivo</td>
            <td class="border border-black px-4 py-2">{{ user.objectives }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Alergias</td>
            <td class="border border-black px-4 py-2">{{ nutritional_profile.allergies?.length > 0 ? translateAllergies(nutritional_profile.allergies).join(', ') : 'No especificadas' }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Comentario Físico</td>
            <td class="border border-black px-4 py-2">{{ nutritional_profile.physical_comentario || 'No especificado' }}</td>
          </tr>
          <tr>
            <td class="border border-black px-4 py-2">Estado Físico</td>
            <td class="border border-black px-4 py-2">{{ nutritional_profile.physical_status || 'No especificado' }}</td>
          </tr>
          <!-- Hábitos (tabla dentro de la tabla) -->
          <tr>
            <td class=" bg-forest-green text-white text-center border border-black px-4 py-2" colspan="2" >Hábitos</td>
          </tr>
          <tr>
            <td colspan="2" class="border border-black px-4 py-2">
              <table class="min-w-full table-auto">
                <tbody>
                  <tr>
                    <td class="border border-black px-4 py-2">Alcohol</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.habits?.alcohol || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Tabaco</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.habits?.tabaco || 'No especificado' }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <!-- Antecedentes Personales (tabla anidada) -->
          <tr>
            <td class=" bg-forest-green text-white text-center border border-black px-4 py-2" colspan="2" >Antecedentes Personales</td>
          </tr>
          <tr>
            <td colspan="2" class="border border-black px-4 py-2">
              <table class="min-w-full table-auto">
                <tbody>
                  <tr>
                    <td class="border border-black px-4 py-2">DM2</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.dm2 ? 'Sí' : 'No' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">HTA</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.hta ? 'Sí' : 'No' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Tiroides</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.tiroides ? 'Sí' : 'No' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Resistencia a la Insulina</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.insulin_resistance ? 'Sí' : 'No' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Dislipidemia</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.dislipidemia ? 'Sí' : 'No' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Cirugías</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.cirugias || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Farmacos</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.farmacos || 'No especificado' }}</td>
                  </tr>
                  <tr> 
                    <td class="border border-black px-4 py-2">Examenes</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.morbid_antecedents?.exams || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Otros</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.otros?.length > 0 ? nutritional_profile.otros.join(', ') : 'No especificadas' }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <!-- Repetir la misma lógica para otros campos que contengan listas o múltiples valores -->
          <!-- Antecedentes Familiares, Anamnesis Nutricional, etc. -->
          <tr>
            <td class=" bg-forest-green text-white text-center border border-black px-4 py-2" colspan="2" >Anamnesis Nutricional</td>
          </tr>
            <tr>
              <td colspan="2" class="border border-black px-4 py-2">
                <table class="min-w-full table-auto">
                  <tbody>
                    <tr>
                      <td class="border border-black px-4 py-2">Plan Nutricional Anterior</td>
                      <td class="border border-black px-4 py-2">{{ nutritional_profile.nutritional_anamnesis?.plan_anterior ? 'Si' : 'No especificado' }}</td>
                    </tr>
                    <tr>
                      <td class="border border-black px-4 py-2">Consumo de Agua</td>
                      <td class="border border-black px-4 py-2">{{ nutritional_profile.nutritional_anamnesis?.agua ? 'Si' : 'No especificado' }}</td>

                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          <tr>
            <td class=" bg-forest-green text-white text-center border border-black px-4 py-2" colspan="2" >Antecedentes Familiares</td>
          </tr>
            <tr>
              <td colspan="2" class="border border-black px-4 py-2">
                <table class="min-w-full table-auto">
                  <tbody>
                    <tr>
                      <td class="border border-black px-4 py-2">DM2</td>
                      <td class="border border-black px-4 py-2">{{ nutritional_profile.family_antecedents?.dm2 ? 'Sí' : 'No' }}</td>
                    </tr>
                    <tr>
                      <td class="border border-black px-4 py-2">HTA</td>
                      <td class="border border-black px-4 py-2">{{ nutritional_profile.family_antecedents?.hta ? 'Sí' : 'No' }}</td>
                    </tr>
                    <tr>
                      <td class="border border-black px-4 py-2">Tiroides</td>
                      <td class="border border-black px-4 py-2">{{ nutritional_profile.family_antecedents?.tiroides ? 'Sí' : 'No' }}</td>
                    </tr>
                    <tr>
                      <td class="border border-black px-4 py-2">Dislipidemia</td>
                      <td class="border border-black px-4 py-2">{{ nutritional_profile.family_antecedents?.dislipidemia ? 'Sí' : 'No' }}</td>
                    </tr>
                    <tr>
                      <td class="border border-black px-4 py-2">Comentarios</td>
                      <td class="border border-black px-4 py-2">{{ nutritional_profile.family_antecedents?.comments || 'No especificado' }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          <!-- Continuar con el resto de los campos -->
          <tr>
            <td class=" bg-forest-green text-white text-center border border-black px-4 py-2" colspan="2">Anamnesis Nutricional</td>
          </tr>
          <tr>
            <td colspan="2" class="border border-black px-4 py-2">
              <table class="min-w-full table-auto">
                <tbody>
                  <tr>
                    <td class="border border-black px-4 py-2">Peso Usual</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.subjective_assessment?.usual_weight || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Síntomas Gastrointestinales</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.subjective_assessment?.gastrointestinal_symptoms || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Variación de Peso</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.subjective_assessment?.weight_variation || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Apetito</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.subjective_assessment?.appetite || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Digestión</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.subjective_assessment?.digestion || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Frecuencia de Digestión</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.subjective_assessment?.digestion_frequency || 'No especificado' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-black px-4 py-2">Medidas de Digestión</td>
                    <td class="border border-black px-4 py-2">{{ nutritional_profile.subjective_assessment?.digestion_measures || 'No especificado' }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
