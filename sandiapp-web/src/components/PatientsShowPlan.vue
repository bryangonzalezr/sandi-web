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

/* ['desayuno', 'almuerzo', 'colacion', 'once', 'cena'] */
const pauta = {
    'desayuno' : 'desayuno',
    'almuerzo' : 'almuerzo',
    'colacion' : 'colación',
    'once' : 'once',
    'cena' : 'cena',
    'free_foods': 'alimentos libres',
    'forbidden_foods' : 'alimentos a evitar',
    'general_recommendations': 'recomendaciones generales'
}

const patient = ref({})
const plan = ref({})
const requerimientos = ref({})
const loading = ref(false)

const goBack = () => {
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

const getData = async () => {
    try{
        loading.value = true;
        await patientsStore.ShowPatient(props.id);
        await planStore.ShowPauta(props.id);
        patient.value = patientsStore.GetPatient.user
        plan.value = planStore.GetPauta;
        requerimientos.value = planStore.GetPauta.nutritional_requirement
        loading.value = false;
    }catch(error){
        loading.value = false;
        console.log(error)
    }
}

onMounted(() => {
    getData();
})
</script>

<template>
    <AppButton
      class="w-fit bg-light-gray border-0 px-3 mx-6 rounded-none rounded-b-lg"
      type="button"
      text="Volver"
      :icons="['fas', 'arrow-left']"
      @click="goBack"
    />
    <div class="flex flex-col px-10 gap-y-5">
        <div class="flex flex-col">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2 mt-6 mb-4">
                    <font-awesome-icon :icon="['fas', 'book']"/>
                    <h1 class="text-2xl font-bold">Pauta</h1>
                </div>
            </div>
            <div class="bg-light-violet p-4 rounded-lg mt-2 flex items-center shadow-inner w-fit">
                <h2 class="text-lg font-semibold text-dark-violet mr-2">Paciente:</h2>
                <span class="text-xl font-bold text-dark rounded-md shadow-sm">
                    {{ patient.name }} {{ patient.last_name }}
                </span>
            </div>
        </div>
        <div v-if="loading" class="flex flex-col justify-center items-center gap-4">
          <img class="h-16 w-16 rounded-full animate-spin-slow" src="@/assets/images/Logo_instagram.svg"></img>
          <span class="visually-hidden">Cargando...</span>
        </div>
        <div v-else class="flex flex-col lg:flex-row flex-wrap gap-6">
            <!-- Pauta -->
            <div class="flex-1 flex flex-col gap-y-2 bg-light-green p-4 rounded-lg shadow-md lg:w-1/2">
                <h3 class="uppercase font-semibold text-dark-green">Pauta asignada</h3>
                <div>
                    <template v-for="(servicio,key) in pauta">
                        <div 
                            v-if="plan[key] != null"
                            class="grid grid-cols-5 bg-white border border-light-gray rounded-lg mb-2"
                        >
                            <div class="capitalize border-r border-r-light-gray px-3 py-2 font-semibold text-dark-brown bg-neutral-beige rounded-l-lg">{{ servicio }}</div>
                            <div class="px-3 py-2 col-span-4 text-dark-black">{{ plan[key] }}</div>
                        </div>
                    </template>
                    <div class="grid grid-cols-5 bg-white border border-light-gray rounded-lg">
                        <div class="capitalize border-r border-r-light-gray px-3 py-2 font-semibold text-dark-brown bg-neutral-beige rounded-l-lg">Total calorías</div>
                        <div class="px-3 py-2 col-span-4 text-dark-black">{{ plan.total_calorias }} [cal]</div>
                    </div>
                </div>
            </div>

            <!-- Requerimientos -->
            <div class="flex flex-col gap-y-2 bg-light-green p-4 rounded-lg shadow-md lg:w-1/2">
                <h3 class="uppercase font-semibold text-dark-green">Requerimientos calculados</h3>
                <div class="inline-grid gap-0">
                    <div class="grid grid-cols-5 bg-white border border-light-gray rounded-lg mb-2">
                        <div class="capitalize border-r border-r-light-gray px-3 py-2 font-semibold text-dark-brown bg-neutral-beige rounded-l-lg">Método usado</div>
                        <div class="px-3 py-2 col-span-4 text-dark-black">{{ typesMethods[requerimientos.method] }}</div>
                    </div>
                    <template v-for="requerimiento in ['get', 'carbohidratos', 'proteina', 'lipidos', 'agua']">
                        <div class="grid grid-cols-5 bg-white border border-light-gray rounded-lg mb-2">
                            <div class="capitalize border-r border-r-light-gray px-3 py-2 font-semibold text-dark-brown bg-neutral-beige rounded-l-lg">{{ requerimiento }}</div>
                            <div class="px-3 py-2 col-span-4 text-dark-black" v-if="requerimiento != 'agua'">{{ requerimientos[requerimiento] }} [calorias/dia]</div>
                            <div class="px-3 py-2 col-span-4 text-dark-black" v-else>{{ requerimientos[requerimiento] }} [cc/calorias]</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>