 <script setup>
import { reactive , ref, watch, onMounted } from 'vue';
import { usePlanStore } from "@/stores";
import AppSelect from '@/common/AppSelect.vue';
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
  type_patient: {
    type: String,
    required: true,
  },
  requirementsResult: {
    type: Object,
    required: false,
  },
  lastMethod:{
    type: Object,
    required: false,
  }
});

const emit = defineEmits(["goToStep", 'getRequirements']);

const planStore = usePlanStore();

const typesMethods = {
    'Normal': {
        text: 'Factorial paciente sano',
        required: true
    },
    'Factorial': {
        text: 'Facotorial paciente enfermo',
        required: props.type_patient == 'Enfermo'
    },
    'FAO/OMS/ONU' : {
        text: 'FAO/OMS/ONU',
        required: true
    },
    'Harris-Benedict': {
        text: 'Harris-Benedict',
        required: props.type_patient == 'Enfermo'
    },
}

const typesRest = {
    'Absoluto' : 'Absoluto (cama)',
    'Relativo' : 'Relativo (cama-sillón-baño)',
    'Ambulatorio' : 'Ambulatorio (deambulación)'
}

const selectedMethod = reactive({
  patient_id: props.id,
  method: '',
  rest_type: ''
})

const viewResults = ref(false)

const Results = reactive({})

const Next = () =>{
  emit('getRequirements', selectedMethod);
  emit("goToStep", props.currentStep + 1);
}

const Consult = (method) =>{
  emit('getRequirements', method);
  getResult(method)
}

const setValue = (value) => {
    selectedMethod[value] = event.target.value;
}

const getResult = async (method) => {
  await planStore.CreateRequeriments(method)
  Results.value = planStore.GetRequirements.data.data;
  viewResults.value = true;
}

const getData = () => {
  Results.value = props.requirementsResult
  selectedMethod.method = props.lastMethod.method
  selectedMethod.rest_type = props.lastMethod.rest_type
  viewResults.value = true;
}
 
watch(selectedMethod,(newMethod, oldMethod) => {
  if(newMethod.method != ''){
    if(newMethod.method == 'Harris-Benedict' && newMethod.rest_type != ''){
      Consult(newMethod)
    }
    if(newMethod.method != 'Harris-Benedict'){
      Consult(newMethod)
    }
  }
  if(newMethod.method != oldMethod.method){
    if(newMethod.method == 'Harris-Benedict' && newMethod.rest_type != ''){
      Consult(newMethod)
    }
    if(newMethod.method != 'Harris-Benedict'){
      Consult(newMethod)
    }
  }
})

watch(() => props.requirementsResult, () => {
  getData()
})

onMounted(() => {
  if('get' in props.requirementsResult){
    getData()
  }
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="flex gap-2">
          <div class="font-PoppinsBold">
            Paso 1:
          </div>
          Cálculo de Requerimientos
        </div>
        <div :class="selectedMethod.method == 'Harris-Benedict' ? 'grid grid-cols-2 gap-2' : ''">
            <AppSelect  
                label="Método para calcular GEB"
                :options="typesMethods"
                :selectedOption="selectedMethod.method"
                firstOptionValue="Selecciona el método"
                @update:selectedOption="setValue('method')"
                class="profile-edit"
            />
            <AppSelect  
                v-if="selectedMethod.method == 'Harris-Benedict'"
                label="Factor de reposo"
                :options="typesRest"
                :selectedOption="selectedMethod.rest_type"
                firstOptionValue="Selecciona el factor"
                @update:selectedOption="setValue('rest_type')"
            />
        </div>
        <div v-if="viewResults"
          class="flex flex-col w-full"
        >
          <div class="border border-black p-2 bg-neutral-violet">Resultados</div>
          <div class="grid grid-cols-5 bg-light-violet border border-black ">
            <div class="text-center border-r border-black">
              GEB: {{ Results.value.get }}
            </div>
            <div class="text-center border-r border-black">
              Proteina: {{ Results.value.proteina }}
            </div>
            <div class="text-center border-r border-black">
              Lipidos: {{ Results.value.lipidos }}
            </div>
            <div class="text-center border-r border-black">
              Carbohidratos: {{ Results.value.carbohidratos }}
            </div>
            <div class="text-center">
              Agua: {{ Results.value.agua }}
            </div>
          </div>
        </div>
        <div class="flex justify-end m-2">
          <AppButton
            text="Siguiente"
            @click="Next()" 
            :disabled="selectedMethod.method=='' || (selectedMethod.method=='Harris-Benedict' && selectedMethod.rest_type=='') || !viewResults"
          />
        </div>
    </div>

</template>