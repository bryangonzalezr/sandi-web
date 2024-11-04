<script setup>
import { computed, reactive, watchEffect, onMounted, watch } from 'vue';
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
  requirementsResult: {
    type: Object,
    required: true,
  },
  indicadores: {
    type: Object,
    required: true,
  },
  portionsResult: {
    type: [Object, null],
    required: false,
  }
});


const emit = defineEmits(["goToStep", "getPortions"]);

const portionsFood = reactive({
    "Cereales": 0,
    "Verduras general": 0,
    "Verduras Libre Consumo": 0,
    "Frutas": 0,
    "Carnes altos en grasas":0 ,
    "Carnes bajos en grasas": 0,
    "legumbres": 0 ,
    "Lácteos altos en grasas": 0 ,
    "Lácteos bajos en grasas": 0,
    "Lácteos medios en grasas": 0,
    "Aceites y Grasas": 0,
    "Ricos en lípidos": 0,
    "Azúcares": 0, 
})

const dataPortions = reactive({
    patient_id: props.id,
    cereales:computed(() => portionsFood["Cereales"]),
    verduras_gral: computed(() => portionsFood["Verduras general"]),
    verduras_libre_cons: computed(() => portionsFood["Verduras Libre Consumo"]),
    frutas: computed(() => portionsFood["Frutas"]),
    carnes_ag: computed(() => portionsFood["Carnes altos en grasas"]),
    carnes_bg: computed(() => portionsFood["Carnes bajos en grasas"]),
    legumbres: computed(() => portionsFood["legumbres"]),
    lacteos_ag: computed(() => portionsFood["Lácteos altos en grasas"]),
    lacteos_bg: computed(() => portionsFood["Lácteos bajos en grasas"]),
    lacteos_mg: computed(() => portionsFood["Lácteos medios en grasas"]),
    aceites_grasas: computed(() => portionsFood["Aceites y Grasas"]),
    alim_ricos_lipidos: computed(() => portionsFood["Ricos en lípidos"]),
    azucares: computed(() => portionsFood["Azúcares"]),
    total_calorias: computed(() => totales.calorias)
})

const totales = reactive({
    calorias: 0,
    cho: 0,
    lipidos: 0,
    proteinas: 0
})

const percentages = reactive({
    calorias: 0,
    cho: 0,
    lipidos: 0,
    proteinas: 0
})

const Next = () =>{
    emit("goToStep", props.currentStep + 1);
    emit("getPortions", dataPortions)
}

const Previous = () =>{
    emit("goToStep", props.currentStep - 1);
}

const TotalPortions = () => {
    const valores = Object.values(portionsFood)
    totales.calorias = 0
    totales.cho = 0
    totales.lipidos = 0
    totales.proteinas = 0
    for(let i=0; i< 13; i++){
      totales.calorias += valores[i] * props.indicadores[i].calorias
      totales.cho += valores[i] * props.indicadores[i].cho
      totales.lipidos += valores[i] * props.indicadores[i].lipidos
      totales.proteinas += valores[i] * props.indicadores[i].proteinas
    }
    percentages.calorias = Math.round((totales.calorias/props.requirementsResult.get) * 100)
    percentages.cho = Math.round((totales.cho/props.requirementsResult.carbohidratos) * 100)
    percentages.lipidos = Math.round((totales.lipidos/props.requirementsResult.lipidos) * 100)
    percentages.proteinas = Math.round((totales.proteinas/props.requirementsResult.proteina) * 100)
}

const setValue = (value) => {
    portionsFood[value] = Number(event.target.value);
}

const getData = () => {
    portionsFood["Cereales"] = props.portionsResult.cereales;
    portionsFood["Verduras general"] = props.portionsResult.verduras_gral;
    portionsFood["Verduras Libre Consumo"] = props.portionsResult.verduras_libre_cons;
    portionsFood["Frutas"] = props.portionsResult.frutas;
    portionsFood["Carnes altos en grasas"] = props.portionsResult.carnes_ag;
    portionsFood["Carnes bajos en grasas"] = props.portionsResult.carnes_bg;
    portionsFood["legumbres"] = props.portionsResult.legumbres;
    portionsFood["Lácteos altos en grasas"] = props.portionsResult.lacteos_ag;
    portionsFood["Lácteos bajos en grasas"] = props.portionsResult.lacteos_bg;
    portionsFood["Lácteos medios en grasas"] = props.portionsResult.lacteos_mg;
    portionsFood["Aceites y Grasas"] = props.portionsResult.aceites_grasas;
    portionsFood["Ricos en lípidos"] = props.portionsResult.alim_ricos_lipidos;
    portionsFood["Azúcares"] = props.portionsResult.azucares;
}

watchEffect(() => {
    TotalPortions()
});

watch(() => props.portionsResult, () => {
    getData()
    TotalPortions()
})

onMounted(() => {
    if('patient_id' in props.portionsResult){
        getData()
    }
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="flex gap-2">
          <div class="font-PoppinsBold">
            Paso 2:
          </div>
          Definición de porciones
        </div>
        <div class="grid grid-cols-2 gap-x-3">
            <div class="flex flex-col gap-y-4 bg-pink p-2 rounded">
                <div>Porciones por grupo de alimento</div>
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="(value, key) of portionsFood" :key="key">
                        <AppInput
                          type="number"
                          v-model="portionsFood[key]"
                          :label="`${key}:`"
                          placeholder="Ingresa la cantidad de porciones"
                          @update:modelValue="setValue(key)"
                        />
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-y-4 bg-light-green p-2 rounded">
                <div>Cálculo</div>
                <table>
                    <thead class="bg-forest-green">
                        <tr
                          class="w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
                        >   
                            <th
                                class="px-3 py-3 border-b border-gray leading-4 text-black tracking-wider text-left"
                              >
                              Grupo
                            </th>  
                            <th
                              v-for="header in ['Cal', 'Cho', 'Líp', 'Pro']"
                              :key="header"
                              class="px-3 py-3 border-b border-gray leading-4 text-black tracking-wider items-center"
                            >
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(value, key, index) of portionsFood" 
                        :key="key"
                        class="bg-white w-full border-b border-b-gray"
                      >
                        <td class="col-span-2 text-left px-3">{{ key }}</td>
                        <td class="text-center">{{ props.indicadores[index].calorias * value }}</td>
                        <td class="text-center">{{ props.indicadores[index].cho * value }}</td>
                        <td class="text-center">{{ props.indicadores[index].lipidos * value }}</td>
                        <td class="text-center">{{ props.indicadores[index].proteinas * value }}</td>
                      </tr>
                      <tr class="bg-white w-full border-b border-b-gray">
                        <td class="col-span-2 text-left px-3">Total</td>
                        <td class="text-center" v-for="(value, key) of totales" :key="key" >
                            {{ value }}
                        </td>
                      </tr>
                      <tr class="bg-white w-full border-b border-b-gray">
                        <td class="col-span-2 text-left px-3">Requerimientos</td>
                        <td class="text-center">{{ props.requirementsResult.get }}</td>
                        <td class="text-center">{{ props.requirementsResult.carbohidratos }}</td>
                        <td class="text-center">{{ props.requirementsResult.lipidos }}</td>
                        <td class="text-center">{{ props.requirementsResult.proteina }}</td>
                      </tr>
                      <tr class="bg-white w-full border-b border-b-gray">
                        <td class="col-span-2 text-left px-3">%Adecuación</td>
                        <td class="text-center" v-for="(value, key) of percentages" :key="key" >
                            {{ value }} %
                        </td>
                      </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-between m-2 w-full">
            <AppButton
              text="Volver"
              @click="Previous()" 
            />
            <AppButton
              text="Siguiente"
              @click="Next()" 
              :disabled="totales.calorias == 0 && totales.cho == 0 && totales.lipidos == 0 && totales.proteinas == 0"
            />
        </div>
    </div>
</template>