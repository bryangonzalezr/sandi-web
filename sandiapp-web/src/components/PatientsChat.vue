<script setup>
import { onMounted, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePatientsStore } from "@/stores"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const patientsStore = usePatientsStore()
const { patient } = storeToRefs(usePatientsStore())

const userPatient = ref({})
const message = ref('hola')

const messages = [
    {
        from: 'patient',
        data: 'Hola'
    },
    {
        from: 'user',
        data: 'Hola ¿Qué necesita?'
    }
]

const getData = async () => {
    await patientsStore.ShowPatient(props.id)
}

onMounted(() => {
    getData()
})

watch(patient, (newVal) => {
    userPatient.value = newVal.user
  console.log("Paciente cargado:", newVal);
});
</script>

<template>
    <div class="w-full h-full flex flex-col justify-between">
        <!--Nombre de paciente-->
        <div class="bg-pink p-4 shadow-2xl">
            <h1>{{ userPatient.name }} {{ userPatient.last_name }}</h1>
        </div>
        <div class="bg-lavender flex-grow p-2 overflow-y-auto">
            <template v-for="(message, index) in messages" :key="index">
              <div class="flex mb-2" :class="message.from == 'user' ? 'justify-end' : 'justify-start'" >
                <div class="flex px-2 py-3 rounded-2xl shadow-md max-w-[60%] bg-white" :class="message.from == 'user' ? 'rounded-tr-none' : 'rounded-tl-none'">
                  <div class="w-full text-black">{{ message.data }}</div>
                </div>
              </div>
            </template>
        </div>
        <div class="bg-white py-4 px-2 shadow-2xl">
            <input 
                class="input-message"
                type="text"
                v-model="message"
            />
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.input-message{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
}
</style>