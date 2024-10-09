<script setup>
import { nextTick, onMounted, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePatientsStore, useChatStore, useAuthStore } from "@/stores"
import { echo } from "@/plugins/reverb";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const authUser = localStorage.getItem('user')
const currentUser = JSON.parse(authUser.toString());

const chatStore = useChatStore();
const { message, messages } = storeToRefs(useChatStore());
const messagesContainer = ref(null);
const form = ref({});

const patientsStore = usePatientsStore();
const { patient } = storeToRefs(usePatientsStore());

const userPatient = ref({})

const getData = async () => {
    await patientsStore.ShowPatient(props.id)
    await chatStore.ShowMessage(props.id)
    
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
    getData()
})

watch(patient, (newVal) => {
    userPatient.value = newVal.user
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
    <div class="w-full h-full flex flex-col justify-between">
        <!--Nombre de paciente-->
        <div class="bg-pink p-4 shadow-2xl">
            <h1>{{ userPatient.name }} {{ userPatient.last_name }}</h1>
        </div>
        <div class="bg-lavender flex-grow p-2 overflow-y-auto" ref="messagesContainer">
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
                v-model="form.message"
                @update:modelValue="setValue('message')"
            />
            <div class="px-4">
                <button class="bg-pink px-4 py-2 rounded-full" type="submit">
                <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
            </div>
        </div>
        </form>
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