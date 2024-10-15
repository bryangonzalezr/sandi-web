<script setup>
import { nextTick, onMounted, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePatientsStore, useChatStore, useAuthStore } from "@/stores"
import { echo } from "@/plugins/reverb";
import AppButton from "@/common/AppButton.vue"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const authUser = localStorage.getItem('user')
const currentUser = JSON.parse(authUser.toString());

const chatStore = useChatStore();
const { message, messages } = storeToRefs(useChatStore());
const messagesContainer = ref(null);
const form = ref({
    message: '',
});

const patientsStore = usePatientsStore();
const { patient, patientslist } = storeToRefs(usePatientsStore());

const userPatient = ref({})
const patientList = ref([])
const showFiled = ref(false)

const goToChat = (id, filter=0) => {
  router.push({ name: 'ChatPatients', params: { id: id }})
  getData(id, filter)
}

const handleFilter = async () => {
    showFiled.value = !showFiled.value
    const filter = showFiled.value ? 1 : 0
    await patientsStore.IndexPatient(filter)
    goToChat(patientsStore.GetFirstPatient, filter)
}

const getData = async (id = props.id, filter=0) => {
    await patientsStore.ShowPatient(id)
    await chatStore.ShowMessage(id)
    await patientsStore.IndexPatient(filter)
    
    messages.value = chatStore.GetMessages;

    echo.private(`chat.${currentUser.id}`)
    .listen('MessageSent', (response) => {
      messages.value.push(response.message)
    })
}

const sendMessage = async (message, receiver_id) => {
    await chatStore.SendMessage(message, receiver_id)
    form.value.message = '';
}

const setValue = (value) => {
  form.value[value] = event.target.value;
  delete errorsForm.value[value];
};

onMounted(() => {
    getData(props.id)
})

watch(patient, (newVal) => {
    userPatient.value = newVal.user
});

watch(patientslist, (newVal) => {
    patientList.value = newVal
});

watch(
    messages,
    () => {
        nextTick(() => {
            messagesContainer.value.scrollTo({
                top: messagesContainer.value.scrollHeight,
                behavior: "smooth",
            });
        });
    },
    { deep: true }
);

</script>

<template>
    <div class="w-full h-full flex">
        <div class="w-1/5 shadow-xl">
            <div class="p-4 grid grid-cols-2">
                <div class="text-2xl uppercase">
                    Chats
                </div>
                <div class="self-center justify-self-end">
                    <AppButton
                        class="flex items-center justify-center gap-2 text-base border rounded px-3.5 min-h-[1.625rem] min-w-[53px] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed bg-light-green text-black border-light-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
                        type="icon"
                        :icons="showFiled ? ['fas', 'comment-dots'] : ['fas', 'box-archive']"
                        :hoverText="showFiled ? 'Chats' : 'Chats archivados'"
                        @click="handleFilter"
                    />
                </div>
            </div>
            <!--Listado de pacientes-->
            <div class=" flex flex-col">
                <template v-for="patient in patientList" :key="patient.id">
                        <div 
                            @click="goToChat(patient.id)"
                            class="p-4 cursor-pointer border-b-2 border-gray w-full text-base"
                            :class="patient.id == props.id ? 'bg-light-green' : 'bg-white'"      
                        >
                            {{ patient.name }} {{ patient.last_name }}
                        </div>
                </template>
            </div>
        </div>
        <div class="h-full flex flex-col justify-between flex-grow">
            <!--Nombre de paciente-->
            <div class="bg-pink p-4 shadow-2xl">
                <h1>{{ userPatient.name }} {{ userPatient.last_name }}</h1>
            </div>
            <div class="bg-lavender flex-grow p-2 overflow-y-auto h-max-48" ref="messagesContainer">
                <template v-for="(message, index) in messages" :key="index">
                  <div class="flex mb-2" :class="message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'" >
                    <div class="flex px-2 py-3 rounded-2xl shadow-md max-w-[60%] bg-white" :class="message.sender_id === currentUser.id ? 'rounded-tr-none' : 'rounded-tl-none'">
                      <div class="w-full text-black">{{ message.text }}</div>
                    </div>
                  </div>
                </template>
            </div>
            <form @submit.prevent="sendMessage(form, props.id)">
                <div class="bg-white py-4 px-2 shadow-2xl flex">
                    <input 
                        class="input-message w-full text-wrap"
                        type="text"
                        placeholder="Mensaje"
                        v-model="form.message"
                        @update:modelValue="setValue('message')"
                    />
                    <div class="px-4">
                        <button class="bg-pink px-4 py-2 rounded-full disabled:opacity-50" type="submit" :disabled="form.message == ''">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>
            </form>
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