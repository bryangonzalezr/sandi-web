<script setup>
import { reactive, watchEffect, onMounted, watch, ref } from 'vue';
import AppInput from '@/common/AppInput.vue';
import AppButton from '@/common/AppButton.vue';
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  portionsGroup: {
    type: Object,
    required: true,
  },
  indicadores: {
    type: Object,
    required: true,
  },
  totalCalories: {
    type: Number,
    required: true,
  },
  portionsServices: {
    type: Object,
    required: false,
  }
});

const emit = defineEmits(["goToStep", "getPortionsServices"]);

// const portion_service_id = 

const food = {
    "cereales": "Cereales",
    "verduras_gral": "Verduras general",
    "verduras_libre_cons": "Verduras libre consumo" ,
    "frutas": "Frutas" ,
    "carnes_ag": "Carnes altos en grasas", 
    "carnes_bg": "Carnes bajos en grasas",
    "legumbres": "Legumbres",
    "lacteos_ag": "Lácteos altos en grasas",
    "lacteos_mg": "Lácteos medios en grasas",
    "lacteos_bg": "Lácteos bajos en grasas",
    "aceites_grasas": "Aceites y Grasas",
    "alim_ricos_lipidos": "Ricos en lípidos",
    "azucares": "Azúcares", 
}

const portionsFood = reactive({
    "patient_id": props.id,
    "total_calorias": 0,
    "desayuno": {
        "cereales": 0,
        "verduras_gral": 0,
        "verduras_libre_cons": 0,
        "frutas": 0,
        "carnes_ag": 0,
        "carnes_bg": 0,
        "legumbres": 0,
        "lacteos_ag": 0,
        "lacteos_mg": 0,
        "lacteos_bg": 0,
        "aceites_grasas": 0,
        "alim_ricos_lips":0,
        "azucares": 0,
        "total_calorias":0
    },
   
    "colacion": {
        "cereales": 0,
        "verduras_gral": 0,
        "verduras_libre_cons": 0,
        "frutas": 0,
        "carnes_ag": 0,
        "carnes_bg": 0,
        "legumbres":0,
        "lacteos_ag": 0,
        "lacteos_mg": 0,
        "lacteos_bg": 0,
        "aceites_grasas": 0,
        "alim_ricos_lips":0,
        "azucares": 0,
        "total_calorias":0
    },
    "almuerzo": {
        "cereales": 0,
        "verduras_gral": 0,
        "verduras_libre_cons": 0,
        "frutas": 0,
        "carnes_ag": 0,
        "carnes_bg": 0,
        "legumbres":0,
        "lacteos_ag": 0,
        "lacteos_mg": 0,
        "lacteos_bg": 0,
        "aceites_grasas": 0,
        "alim_ricos_lips":0,
        "azucares": 0,
        "total_calorias":0
    },
    "once": {
        "cereales": 0,
        "verduras_gral": 0,
        "verduras_libre_cons": 0,
        "frutas": 0,
        "carnes_ag": 0,
        "carnes_bg": 0,
        "legumbres":0,
        "lacteos_ag": 0,
        "lacteos_mg": 0,
        "lacteos_bg": 0,
        "aceites_grasas": 0,
        "alim_ricos_lips":0,
        "azucares": 0,
        "total_calorias":0
    },
    "cena": {
        "cereales": 0,
        "verduras_gral": 0,
        "verduras_libre_cons": 0,
        "frutas": 0,
        "carnes_ag": 0,
        "carnes_bg": 0,
        "legumbres":0,
        "lacteos_ag": 0,
        "lacteos_mg": 0,
        "lacteos_bg": 0,
        "aceites_grasas": 0,
        "alim_ricos_lips":0,
        "azucares": 0,
        "total_calorias":0
    }
})

const totales = reactive({
    desayuno: 0,
    colacion: 0,
    almuerzo: 0,
    once: 0,
    cena: 0
})

const percentages = reactive({
    desayuno: 0,
    colacion: 0,
    almuerzo: 0,
    once: 0,
    cena: 0
})

const filteredPort=ref([])

const Next = () =>{
    emit("goToStep", props.currentStep + 1);
    emit("getPortionsServices", portionsFood, props.portionsServices['_id']? props.portionsServices['_id'] : null);

}

const Previous = () =>{
    emit("goToStep", props.currentStep - 1);
}

const TotalPortions = (service) => {
    const valores = Object.values(portionsFood[service])
    totales[service] = 0
    for(let i=0; i< 13; i++){
        totales[service] += valores[i] * props.indicadores[i].calorias
    }
    portionsFood[service].total_calorias = totales[service]
    percentages[service] = Math.round((totales[service]/props.totalCalories) * 100)
}

const setValue = (service, value) => {
    portionsFood[service][value] = Number(event.target.value);
}

const dataResults = (service) => {
    const valores = Object.values(portionsFood[service])
    for(let i=0; i< valores.length; i++){
        portionsFood[service] = props.portionsServices[service]
        portionsFood[service].cereales = props.portionsServices[service].cereales
        portionsFood[service].verduras_gral = props.portionsServices[service].verduras_gral
        portionsFood[service].verduras_libre_cons = props.portionsServices[service].verduras_libre_cons
        portionsFood[service].frutas = props.portionsServices[service].frutas
        portionsFood[service].carnes_ag = props.portionsServices[service].carnes_ag
        portionsFood[service].carnes_bg = props.portionsServices[service].carnes_bg
        portionsFood[service].legumbres = props.portionsServices[service].legumbres
        portionsFood[service].lacteos_ag = props.portionsServices[service].lacteos_ag
        portionsFood[service].lacteos_mg = props.portionsServices[service].lacteos_mg
        portionsFood[service].lacteos_bg = props.portionsServices[service].lacteos_bg
        portionsFood[service].aceites_grasas = props.portionsServices[service].aceites_grasas
        portionsFood[service].alim_ricos_lips = props.portionsServices[service].alim_ricos_lips
        portionsFood[service].azucares = props.portionsServices[service].azucares
        portionsFood[service].total_calorias = props.portionsServices[service].total_calorias
    }
}

const getData = () => {
    dataResults('desayuno')
    dataResults('almuerzo')
    dataResults('colacion')
    dataResults('once')
    dataResults('cena')
}

watchEffect(() => {
    TotalPortions('desayuno')
    TotalPortions('almuerzo')
    TotalPortions('colacion')
    TotalPortions('once')
    TotalPortions('cena')
    portionsFood.total_calorias = portionsFood.desayuno.total_calorias + portionsFood.almuerzo.total_calorias + portionsFood.colacion.total_calorias + portionsFood.once.total_calorias + portionsFood.cena.total_calorias
});

watch(() => props.portionsServices, () => {
  getData()

})

onMounted(() => {
  if('desayuno' in props.portionsServices){
    getData()
  }
})



</script>

<template>
    <div class="flex flex-col gap-4">
      <div class="flex gap-2">
        <div class="font-PoppinsBold">Paso 3:</div>
        Definición de porciones por tipo de servicio
      </div>
      
      <div class="flex flex-col gap-y-2">
        <div>Porciones definidas anteriormente</div>
        <div class="w-full flex flex-wrap gap-2">
          <div
            v-for="(group, key) of food"
            :key="key"
            class="bg-light-green rounded-xl px-2"
          >
            {{ group }}: {{ portionsGroup[key] }}
          </div>
        </div>
      </div>
  
      <div class="flex flex-col gap-y-2">
        <div class="text-center text-2xl font-bold">Definición de porciones por servicio</div>
        
        <!-- Single table for all service keys -->
        <table class="w-full text-sm text-left bg-forest-green text-black rounded">
          <thead class="bg-neutral-beige text-left leading-4 text-black tracking-wider">
            <tr>
              <th class="px-4 py-2">Alimento</th>
              <th
                v-for="serviceKey in Object.keys(portionsFood).filter(key => key !== 'patient_id' && key !== 'total_calorias')"
                :key="serviceKey"
                class="px-4 py-2 text-center"
              >
                {{ serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Rows for each food item -->
            <tr v-for="(label, key) in food" :key="key" class="border-b border-light-gray">
              <td class="px-4 py-2">{{ label }}</td>
              <td
                v-for="serviceKey in Object.keys(portionsFood).filter(key => key !== 'patient_id' && key !== 'total_calorias')"
                :key="`${serviceKey}-${key}`"
                class=" px-4 py-2"
              >
                <AppInput
                  type="number"
                  v-model="portionsFood[serviceKey][key]"
                  @update:modelValue="setValue(serviceKey, key)"
                />
              </td>
            </tr>
            <!-- Row for total calories per service -->
            <tr class="border-b border-light-gray">
              <td class="px-4 py-2 font-bold">Total calorías</td>
              <td
                v-for="serviceKey in Object.keys(portionsFood).filter(key => key !== 'patient_id' && key !== 'total_calorias')"
                :key="`total-${serviceKey}`"
                class=" px-4 py-2 text-center"
              >
                {{ totales[serviceKey] }}
              </td>
            </tr>
            <!-- Row for calorie percentages per service -->
            <tr>
              <td class=" px-4 py-2 font-bold">% Calorías</td>
              <td
                v-for="serviceKey in Object.keys(portionsFood).filter(key => key !== 'patient_id' && key !== 'total_calorias')"
                :key="`percent-${serviceKey}`"
                class="px-4 py-2 text-center"
              >
                {{ percentages[serviceKey] }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div class="flex justify-between m-2 w-full">
        <AppButton text="Volver" @click="Previous()" />
        <AppButton
          text="Siguiente"
          @click="Next()"
          :disabled="Object.values(totales).some(total => total === 0)"
        />
      </div>
    </div>
  </template>
  

