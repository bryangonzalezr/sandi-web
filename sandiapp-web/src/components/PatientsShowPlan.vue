<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePatientsStore, usePlanStore } from '@/stores';
import AppButton from '@/common/AppButton.vue';
const props = defineProps({
    id: {
      type: String,
      required: true,
    },
});

const router = useRouter();

const patientsStore = usePatientsStore();
const planStore = usePlanStore();

const typesMethods = {
    'Normal': 'Factorial paciente sano',
    'Factorial': 'Facotorial paciente enfermo',
    'FAO/OMS/ONU' : 'FAO/OMS/ONU',
    'Harris-Benedict': 'Harris-Benedict'
}

const patient = ref({})
const plan = ref({})
const requerimientos = ref({})

const goBack = () => {
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

const getData = async () => {
    try{
        await patientsStore.ShowPatient(props.id);
        await planStore.ShowPauta(props.id);
        patient.value = patientsStore.GetPatient.user
        plan.value = planStore.GetPauta;
        requerimientos.value = planStore.GetPauta.nutritional_requirement
        console.log(plan.value);
    }catch(error){
        console.log(error)
    }
}

onMounted(() => {
    getData();
})
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
            <h1 class="uppercase text-2xl">
              Pauta
            </h1>
            <h2>Paciente: {{ patient.name }} {{ patient.last_name }}</h2>
        </div>
        <div class="flex flex-col gap-y-3">
            <!--Pauta-->
            <div class="flex flex-col gap-y-2 bg-pink p-2 rounded">
                <h3 class="uppercase">Pauta asignada</h3>
                <div>
                    <template v-for="servicio in ['desayuno', 'almuerzo', 'colacion', 'once', 'cena']">
                        <div 
                            v-if="plan[servicio] != ''"
                            class="grid grid-cols-5 bg-white border border-gray"
                        >
                            <div class="capitalize border-r border-r-gray px-2">{{ servicio }}</div>
                            <div class="px-2 col-span-4">{{ plan[servicio] }}</div>
                        </div>
                    </template>
                    <div 
                        class="grid grid-cols-5 bg-white border border-gray"
                    >
                        <div class="capitalize border-r border-r-gray px-2">Total calorías</div>
                        <div class="px-2 col-span-4">{{ plan.service_portion.total_calorias }}</div>
                    </div>
                </div>
            </div>
            <!--Requerimientos-->
            <div class="flex flex-col gap-y-2 bg-pink p-2 rounded">
                <h3 class="uppercase">Requerimientos calculados</h3>
                <div>
                    <div
                        class="grid grid-cols-5 bg-white border border-gray"
                    >
                        <div class="capitalize border-r border-r-gray px-2">Método usado</div>
                        <div class="px-2 col-span-4">{{ typesMethods[requerimientos.method] }}</div>
                    </div>
                    <template v-for="requerimiento in ['get', 'carbohidratos', 'proteina', 'lipidos', 'agua']">
                        <div 
                            class="grid grid-cols-5 bg-white border border-gray"
                        >
                            <div class="capitalize border-r border-r-gray px-2">{{ requerimiento }}</div>
                            <div class="px-2 col-span-4">{{ requerimientos[requerimiento] }}</div>
                        </div>
                        
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>