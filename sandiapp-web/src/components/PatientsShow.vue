<script setup>
import { ref, onMounted } from 'vue';
import { useNutritionalProfileStore, usePatientsStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import { useRouter } from 'vue-router';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const perfilStore = useNutritionalProfileStore();
const patientStore = usePatientsStore();
const user = ref({});
const nutritional_profile = ref({});
const router = useRouter();
const loading = ref(true);
const createPlan = ref(false);
const buttonProgress = ref(false);

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

const goBack = () => {
  router.push({ name: 'Patients'});
};

const goEdit = () => {
  router.push({ name: 'PatientsEdit', params: { id: props.id } });
};

const goToConsult = () => {
  router.push({ name: 'PatientConsult', params: { id: props.id } });
};

const goToCreatePlan = () => {
  router.push({ name: 'PatientPlan', params: { id: props.id } });
}

const goToProgress = () => {
  router.push({ name: 'PatientProgress', params: { id: props.id } });
};

const goToGuide = () => {
  router.push({ name: 'PatientShowPlan', params: { id: props.id } });
};

const GetData = async () => {
    loading.value = true;
    await perfilStore.ShowPatientProfile(props.id);
    await patientStore.ShowProgress(props.id);
    user.value = perfilStore.GetData.user;
    nutritional_profile.value = perfilStore.GetData.nutritional_profile;
    if(perfilStore.GetData.nutritional_plan){
      createPlan.value = perfilStore.GetData.nutritional_plan.length == 0 ? false : true;
    }
    buttonProgress.value = patientStore.GetProgress.length == 0 ? false : true;
    loading.value = false;
};

onMounted(async () => {
    GetData();
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
      <h1 class="text-2xl ">
        <font-awesome-icon :icon="faUser" class="text-black" />
        Pacientes
      </h1>
      
      <h2>Gestión del paciente: <strong>{{ user.name }}</strong></h2>
    </div>

    <div class="grid grid-cols-2 justify-between">
      <div class="grid grid-flow-col auto-cols-max gap-2">
        <AppButton
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
          type="button"
          text="Agregar consulta"
          :icons="['fas', 'plus']"
          @click="goToConsult"
        />
        <template v-if="buttonProgress">
          <AppButton
            v-if="!createPlan"
            class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
            type="button"
            text="Agregar plan nutricional"
            :icons="['fas', 'plus']"
            @click="goToCreatePlan"
          />
          <AppButton
            v-else
            class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
            type="button"
            text="Editar plan nutricional"
            :icons="['fas', 'pencil']"
            @click="goToCreatePlan"
          />
        </template>
        <AppButton
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
          type="button"
          text="Ver Progreso"
          :icons="['fas', 'eye']"
          @click="goToProgress"
        />
        <AppButton
          v-if="buttonProgress && createPlan"
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"

          type="button"
          text="Ver Pauta"
          :icons="['fas', 'eye']"
          @click="goToGuide"
        />
      </div>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end">
        <AppButton
          class="bg-light-violet text-dark-violet border-0 p-1 hover:bg-dark-violet hover:text-light-violet"
          type="button"
          text="Editar Perfil"
          :icons="['fas', 'pen']"
          @click="goEdit"
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-forest-green border-b-red border-l-transparent border-r-transparent rounded-full"></div>
      <span class="visually-hidden">Cargando...</span>
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <!-- Left Column -->
      <div class="space-y-4">
        <!-- Datos Personales -->
        <div class="rounded overflow-hidden">
          <div class="px-3 py-3 bg-neutral-beige text-left leading-4 text-black tracking-wider items-center">
            Datos Personales</div>
          <div class=" w-full px-2 border-b border-b-light-gray">
              <div v-for="(field, label) in {
              'Nombre': user.name,
              'Apellido': user.last_name,
              'Edad': user.age,
              'Fecha de nacimiento': user.birthdate,
              'Sexo': user.sex,
              'Celular': user.phone_number,
              'Estado Civil': user.civil_status,
              'Objetivo': user.objectives,
              'Alergias': nutritional_profile.allergies?.length > 0 ? translateAllergies(nutritional_profile.allergies).join(', ') : 'No especificadas',
              'Estado Físico': nutritional_profile.physical_status
            }" :key="label" class="grid grid-cols-2 border-b last:border-b-0 border-neutral-gray">
              <div class="p-2 border-r border-neutral-gray">{{ label }}</div>
              <div class="p-2">{{ field || 'No especificado' }}</div>
            </div>
          </div>
        </div>

        <!-- Hábitos -->
        <div class="rounded overflow-hidden">
          <div class="px-3 py-3 bg-neutral-beige text-left leading-4 text-black tracking-wider items-center">
            Hábitos</div>
            <div class=" w-full px-2 border-b border-light-gray">
              <div class="grid grid-cols-2 border-b border-light-gray">
                <div class="p-2 border-r border-neutral-gray">Alcohol</div>
              <div class="p-2">{{ nutritional_profile.habits?.alcohol || 'No especificado' }}</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="p-2 border-r border-neutral-gray">Tabaco</div>
              <div class="p-2">{{ nutritional_profile.habits?.tabaco || 'No especificado' }}</div>
            </div>
          </div>
        </div>

        <!-- Anamnesis Nutricional -->
        <div class="rounded overflow-hidden">
          <div class="px-3 py-3 bg-neutral-beige text-left leading-4 text-black tracking-wider items-center">
            Anamnesis Nutricional</div>
            <div class=" w-full px-2 border-b border-light-gray">
              <div class="grid grid-cols-2 border-b border-light-gray">
              <div class="p-2 border-r border-light-gray">Plan nutricional anterior</div>
              <div class="p-2">{{ nutritional_profile.nutritional_anamnesis?.plan_anterior ? 'Sí' : 'No' }}</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="p-2 border-r border-light-gray">Consumo de agua</div>
              <div class="p-2">{{ nutritional_profile.nutritional_anamnesis?.agua ? 'Sí' : 'No' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-4">
        <!-- Antecedentes Personales -->
        <div class="rounded overflow-hidden">
          <div class="px-3 py-3 bg-neutral-beige text-left leading-4 text-black tracking-wider items-center">
            Antecedentes Personales
          </div>
          <div class=" w-full px-2 border-b border-b-light-gray">
            <div v-for="(field, label) in {
              'DM2': nutritional_profile.morbid_antecedents?.dm2 ? 'Sí' : 'No',
              'HTA': nutritional_profile.morbid_antecedents?.hta ? 'Sí' : 'No',
              'Tiroides': nutritional_profile.morbid_antecedents?.tiroides ? 'Sí' : 'No',
              'Resistencia a la Insulina': nutritional_profile.morbid_antecedents?.insulin_resistance ? 'Sí' : 'No',
              'Dislipidemia': nutritional_profile.morbid_antecedents?.dislipidemia ? 'Sí' : 'No',
              'Cirugías': nutritional_profile.morbid_antecedents?.cirugias,
              'Farmacos': nutritional_profile.morbid_antecedents?.farmacos,
              'Examenes': nutritional_profile.morbid_antecedents?.exams,
              'Otros': nutritional_profile.otros?.length > 0 ? nutritional_profile.otros.join(', ') : 'No especificadas'
            }" :key="label" class="grid grid-cols-2 border-b last:border-b-0 border-light-gray">
              <div class="p-2 border-r border-neutral-gray">{{ label }}</div>
              <div class="p-2">{{ field || 'No especificado' }}</div>
            </div>
          </div>
        </div>

        <!-- Antecedentes Familiares -->
        <div class="rounded overflow-hidden">
          <div class="px-3 py-3 bg-neutral-beige text-left leading-4 text-black tracking-wider items-center">
            Antecedentes Familiares</div>
            <div class=" w-full px-2 border-b border-b-light-gray">
            <div v-for="(field, label) in {
              'DM2': nutritional_profile.family_antecedents?.dm2 ? 'Sí' : 'No',
              'HTA': nutritional_profile.family_antecedents?.hta ? 'Sí' : 'No',
              'Tiroides': nutritional_profile.family_antecedents?.tiroides ? 'Sí' : 'No',
              'Dislipidemia': nutritional_profile.family_antecedents?.dislipidemia ? 'Sí' : 'No',
              'Comentarios': nutritional_profile.family_antecedents?.comments
            }" :key="label" class="grid grid-cols-2 border-b last:border-b-0 border-light-gray">
              <div class="p-2 border-r border-neutral-gray">{{ label }}</div>
              <div class="p-2">{{ field || 'No especificado' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>