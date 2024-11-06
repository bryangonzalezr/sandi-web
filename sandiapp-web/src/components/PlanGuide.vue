<script setup>
import { reactive, onMounted, watch } from 'vue';
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
  portionsService: {
    type: Object,
    required: true,
  },
  pautaResults: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(["goToStep", "getPauta"]);

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
    "alim_ricos_lips": "Ricos en lípidos",
    "azucares": "Azúcares",
    'total_calorias': 'Total Calorias' 
}

const Pauta = reactive({
    "patient_id": props.id,
    "desayuno": "",
    "colacion": "",
    "almuerzo": "",
    "once": "",
    "cena": "",
    "general_recommendations": "",
    "forbidden_foods": "",
    "free_foods": ""
})

const Finish = () => {
    emit("goToStep", props.currentStep + 1);
    emit("getPauta", Pauta);
}

const Previous = () =>{
    emit("goToStep", props.currentStep - 1);
}

const getData = () => {
    Pauta.desayuno = props.pautaResults.desayuno;
    Pauta.colacion = props.pautaResults.colacion;
    Pauta.almuerzo = props.pautaResults.almuerzo;
    Pauta.once = props.pautaResults.once;
    Pauta.cena = props.pautaResults.cena;
    Pauta.general_recommendations = props.pautaResults.general_recommendations;
    Pauta.forbidden_foods = props.pautaResults.forbidden_foods;
    Pauta.free_foods = props.pautaResults.free_foods;
}

watch(() => props.pautaResults, () => {
  getData()
})

onMounted(() => {
    if('desayuno' in props.pautaResults){
        getData();
    }
})
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex gap-2">
          <div class="font-PoppinsBold">
            Paso 4:
          </div>
          Rellenar Pauta
        </div>
        <!--Tarjeta con porciones y pauta de desayuno-->
        <div class="grid grid-cols-3 grid-row-2 gap-2 bg-light-violet rounded p-4">
            <div class="text-xl uppercase col-span-3">
                Desayuno
            </div>
            <table>
                <thead>
                    <tr
                      class="bg-bold-red w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
                    >
                        <th
                            class="px-3 py-3 border-b border-dark-gray leading-4 text-black tracking-wider text-left"
                            colspan="2"
                        >
                            Porciones definidas anteriormente
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                      v-for="(value, key) of props.portionsService.desayuno" 
                    :key="key"
                      class="w-full border-y bg-white border-y-gray"
                    >
                      <td class="col-span-2 text-left px-3">{{ food[key] }}</td>
                      <td class="text-center px-2">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="col-span-2 flex flex-col gap-y-2">
                <div>Plan para el desayuno</div>
                <textarea 
                    v-model="Pauta.desayuno"
                    class="w-full h-full p-2"
                    placeholder="Defina porciones, hora y ejemplos de alimentos con sus porciones"
                />
            </div>
        </div>
        <!--Tarjeta con porciones y pauta de almuerzo-->
        <div class="grid grid-cols-3 grid-row-2 gap-2 bg-light-violet rounded p-4">
            <div class="text-xl uppercase col-span-3">
                Almuerzo
            </div>
            <table>
                <thead>
                    <tr
                      class="bg-bold-red w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
                    >
                        <th
                            class="px-3 py-3 border-b border-gray leading-4 text-black tracking-wider text-left"
                            colspan="2"
                        >
                            Porciones definidas anteriormente
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                      v-for="(value, key) of props.portionsService.almuerzo" 
                    :key="key"
                      class="w-full border-y bg-white border-y-gray"
                    >
                      <td class="col-span-2 text-left px-3">{{ food[key] }}</td>
                      <td class="text-center px-2">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="col-span-2 flex flex-col gap-y-2">
                <div>Plan para el almuerzo</div>
                <textarea 
                    v-model="Pauta.almuerzo"
                    class="w-full h-full p-2"
                    placeholder="Defina porciones, hora y ejemplos de alimentos con sus porciones"
                />
            </div>
        </div>
        <!--Tarjeta con porciones y pauta de colación-->
        <div class="grid grid-cols-3 grid-row-2 gap-2 bg-light-violet rounded p-4">
            <div class="text-xl uppercase col-span-3">
                Colación
            </div>
            <table>
                <thead>
                    <tr
                      class="bg-bold-red w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
                    >
                        <th
                            class="px-3 py-3 border-b border-gray leading-4 text-black tracking-wider text-left"
                            colspan="2"
                        >
                            Porciones definidas anteriormente
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                      v-for="(value, key) of props.portionsService.colacion" 
                    :key="key"
                      class="w-full border-y bg-white border-y-gray"
                    >
                      <td class="col-span-2 text-left px-3">{{ food[key] }}</td>
                      <td class="text-center px-2">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="col-span-2 flex flex-col gap-y-2">
                <div>Plan para el colacion</div>
                <textarea 
                    v-model="Pauta.colacion"
                    class="w-full h-full p-2"
                    placeholder="Defina porciones, hora y ejemplos de alimentos con sus porciones"
                />
            </div>
        </div>
        <!--Tarjeta con porciones y pauta de once-->
        <div class="grid grid-cols-3 grid-row-2 gap-2 bg-light-violet rounded p-4">
            <div class="text-xl uppercase col-span-3">
                Once
            </div>
            <table>
                <thead>
                    <tr
                      class="bg-bold-red w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
                    >
                        <th
                            class="px-3 py-3 border-b border-gray leading-4 text-black tracking-wider text-left"
                            colspan="2"
                        >
                            Porciones definidas anteriormente
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                      v-for="(value, key) of props.portionsService.once" 
                    :key="key"
                      class="w-full border-y bg-white border-y-gray"
                    >
                      <td class="col-span-2 text-left px-3">{{ food[key] }}</td>
                      <td class="text-center px-2">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="col-span-2 flex flex-col gap-y-2">
                <div>Plan para el once</div>
                <textarea 
                    v-model="Pauta.once"
                    class="w-full h-full p-2"
                    placeholder="Defina porciones, hora y ejemplos de alimentos con sus porciones"
                />
            </div>
        </div>
        <!--Tarjeta con porciones y pauta de cena-->
        <div class="grid grid-cols-3 grid-row-2 gap-2 bg-light-violet rounded p-4">
            <div class="text-xl uppercase col-span-3">
                Cena
            </div>
            <table>
                <thead>
                    <tr
                      class="bg-bold-red w-full px-11 shadow-[0_1px_5px_rgb(0,0,0,0.1)"
                    >
                        <th
                            class="px-3 py-3 border-b border-gray leading-4 text-black tracking-wider text-left"
                            colspan="2"
                        >
                            Porciones definidas anteriormente
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                      v-for="(value, key) of props.portionsService.cena" 
                    :key="key"
                      class="w-full border-y bg-white border-y-gray"
                    >
                      <td class="col-span-2 text-left px-3">{{ food[key] }}</td>
                      <td class="text-center px-2">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="col-span-2 flex flex-col gap-y-2">
                <div>Plan para el cena</div>
                <textarea 
                    v-model="Pauta.cena"
                    class="w-full h-full p-2"
                    placeholder="Defina porciones, hora y ejemplos de alimentos con sus porciones"
                />
            </div>
        </div>
        <!--Tarjeta para recomendaciones, restricciones y libertades-->
        <div class="grid grid-cols-3 grid-row-2 gap-2 bg-light-violet rounded p-4">
            <div class="text-xl uppercase col-span-3">
                Recomendaciones
            </div>
            <div class="flex flex-col gap-y-2">
                <div>Alimentos de libre consumo</div>
                <textarea 
                    v-model="Pauta.free_foods"
                    class="w-full h-full p-2"
                    placeholder="Defina los alimentos de libre consumo (Ej: Lechuga)"
                />
            </div>
            <div class="flex flex-col gap-y-2">
                <div>Aliementos prohibidos</div>
                <textarea 
                    v-model="Pauta.forbidden_foods"
                    class="w-full h-full p-2"
                    placeholder="Defina los alimentos que debe evitar el paciente (Ej: Frituras)"
                />
            </div>
            <div class="flex flex-col gap-y-2">
                <div>Recomendaciones generales</div>
                <textarea 
                    v-model="Pauta.general_recommendations"
                    class="w-full h-full p-2"
                    placeholder="Recomendaciones generales (Ej: Prefiera productos que digan  bajo en sodio.)"
                />
            </div>
        </div>
        <div class="flex justify-between m-2 w-full">
            <AppButton
              text="Volver"
              @click="Previous()" 
            />
            <AppButton
              text="Finalizar"
              @click="Finish()" 
              :disabled="(Pauta.desayuno == '' || Pauta.almuerzo == '' || (Pauta.colacion == '' && Pauta.once == '' && Pauta.cena == ''))"
            />
        </div>
    </div>
</template>
