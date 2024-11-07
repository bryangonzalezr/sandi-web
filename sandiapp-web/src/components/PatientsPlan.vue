<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePatientsStore, usePlanStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
import AppMultiSteps from '@/common/AppMultiSteps.vue';
import PlanRequirement from './PlanRequirement.vue';
import PlanPortions from './PlanPortions.vue';
import PlanPortionsServices from './PlanPortionsServices.vue';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import PlanGuide from './PlanGuide.vue';
const props = defineProps({
    id: {
      type: String,
      required: true,
    },
});

const router = useRouter();

const nutritional_plan_id = ref(null)

const patientsStore = usePatientsStore();
const planStore = usePlanStore();
const existPlan = ref(false)
// Estado reactivo para el paso actual del formulario
const currentStep = ref(1);
// Obtener los datos del paciente desde la store
const patientType = ref('')
const patient = ref({})
// Obtener requerimientos del primero paso
const requirementsResult = ref({})
const lastMethodResult = ref({})
// Obtener indicadores de porciones por grupo de alimento
const indicadores = ref({})
// Obtener porciones calculadas
const portionsGroup = ref({})
// Total de calorias intercambio de porciones
const totalCalories = ref(0)
// Obtener porciones por servicio calculados
const portionsServices = ref({})
// Obtener pauta
const pauta = ref({})

const goBack = () => {
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

// Función para ir a un paso específico
const goToStep = (step) => {
    currentStep.value = step;
}

const getRequirements = async (method) => {
  console.log(method)
  await planStore.CreateRequeriments(method)
  await planStore.CreateIndicadores()
  lastMethodResult.value = method
  requirementsResult.value = planStore.GetRequirements.data.data;
  indicadores.value = planStore.GetIndicadores.data.data;
}

const getPortions = async (portions, id) => {
  if (existPlan && id){
    await planStore.UpdatePortions(id,portions)

  }else{
    await planStore.CreatePortions(portions)
  }
  portionsGroup.value = planStore.GetPortions.data.data;
  totalCalories.value = portionsGroup.value.total_calorias;
  
}

const getPortionsServices = async (portions, id) => {

  if (existPlan && id){
    await planStore.UpdatePortionsServices(id,portions)
  }else{
    await planStore.CreatePortionsServices(portions)
  }
  portionsServices.value = planStore.GetPortionsServices.data.data;
}

const getPauta = async (plan) => {
  plan.nutritional_requirement_id = requirementsResult.value.id
  plan.portion_id = portionsGroup.value.id
  plan.service_portion_id = portionsServices.value['_id']
  try{
    if(existPlan && nutritional_plan_id.value){
      await planStore.UpdatePauta(nutritional_plan_id.value, plan)
    }else{
      await planStore.CreatePauta(plan)
    }
    pauta.value = planStore.GetPauta;
    if(currentStep.value == 5){
        router.push({ name: "PatientsShow", params: { id: props.id }});
      }
  }catch(error){
    console.log(error)
  }
}

const getData = async () => {
    try{
        await patientsStore.ShowPatient(props.id);
        const data = patientsStore.GetPatient
        patient.value = data.user
        patientType.value = data.nutritional_profile.patient_type;
        if(data.nutritional_plan){
          existPlan.value = true;
          nutritional_plan_id.value= data.nutritional_plan['_id']
          await planStore.ShowRequeriments(props.id)
          await planStore.ShowPortions(props.id)
          await planStore.ShowPortionsServices(props.id)
          await planStore.ShowPauta(props.id)
          requirementsResult.value = planStore.GetRequirements.data.data;
          lastMethodResult.value.patient_id = props.id
          lastMethodResult.value.method = requirementsResult.value.method
          portionsGroup.value = planStore.GetPortions.data.data[0];
          totalCalories.value = portionsGroup.value.total_calorias ? portionsGroup.value.total_calorias: 0;
          portionsServices.value = planStore.GetPortionsServices.data.data;
          pauta.value = planStore.GetPauta;
          if(patientType.value == 'Ambulatorio'){
            lastMethodResult.value.rest_type = ''
          }else{
            lastMethodResult.value.rest_type = requirementsResult.value.rest_type
          }
        }
    }catch(error){
        console.log(error)
    }
}

onMounted(() => {
    getData();
})

</script>

<template>
   <AppButton
    class="w-fit bg-light-gray border-0 px-3 mx-6 mb-5 lg:rounded-none lg:rounded-b-lg"
    type="button"
    text="Volver"
    :icons="['fas', 'arrow-left']"
    @click="goBack"
  />
    <div class="flex flex-col py-2 px-10 gap-y-5">
        <div class="flex flex-col">

            <h1 
              v-if="!existPlan"
              class="text-2xl flex items-center gap-2"
            >
              <font-awesome-icon :icon="faUser" class="text-black" />

              Crear Plan Nutricional
            </h1>
            <h1 
              v-else
              class="text-2xl flex items-center gap-2"
            >
              <font-awesome-icon :icon="faUser" class="text-black" />

              Editar Plan Nutricional
            </h1>
            <h2>Paciente: {{ patient.name }} {{ patient.last_name }}</h2>
        </div>
        <!--Pasos formualrio-->
        <AppMultiSteps 
            :titles="['Requerimientos', 'Porciones', 'Porciones por servicio', 'Pauta']"
            :currentStep="currentStep"
        />
        <!--Aca cambia dependiendo del paso en el que esté el usuario-->
        <div>
            <PlanRequirement 
                v-if="currentStep === 1"
                @goToStep="goToStep" 
                @getRequirements="getRequirements" 
                :currentStep="currentStep" 
                :id="Number(props.id)"
                :type_patient="patientType"
                :requirementsResult="requirementsResult"
                :lastMethod="lastMethodResult" 
            />
            <PlanPortions
                v-if="currentStep === 2"
                @goToStep="goToStep"
                @getPortions="getPortions" 
                :currentStep="currentStep" 
                :id="Number(props.id)" 
                :indicadores="indicadores"
                :requirementsResult="requirementsResult"
                :portionsResult="portionsGroup"
            />
            <PlanPortionsServices
                v-if="currentStep === 3"
                @goToStep="goToStep"
                @getPortionsServices="getPortionsServices" 
                :currentStep="currentStep"
                :id="Number(props.id)"
                :portionsGroup="portionsGroup" 
                :indicadores="indicadores"
                :totalCalories="totalCalories"
                :portionsServices="portionsServices"
            />
            <PlanGuide 
                v-if="currentStep === 4"
                @goToStep="goToStep" 
                @getPauta="getPauta"
                :currentStep="currentStep"
                :id="Number(props.id)"
                :portionsService="portionsServices"
                :pautaResults="pauta"
            />
        </div>
    </div>

</template>