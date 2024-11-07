<script setup>
import { nextTick, onMounted, watch, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePatientsStore, useChatStore } from "@/stores"
import { echo } from "@/plugins/reverb";
import AppButton from "@/common/AppButton.vue"

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const router = useRouter();
const patientsStore = usePatientsStore();
const { patient, patientslist } = storeToRefs(usePatientsStore());
const authUser = localStorage.getItem('user')
const currentUser = JSON.parse(authUser.toString());
const chatStore = useChatStore();
const messages = ref([]);
const messagesContainer = ref(null);
const isPatientTyping = ref(false);
const isPatientTypingTimer = ref(null);
const form = ref({
    message: '',
});
const userPatient = ref({})
const patientList = ref([])
const showFiled = ref(false)
const verifyFiled = ref(false)
const filter = ref(0);
const hover = ref(false);
const lastMessages = ref({});
const isLoading = ref(true);
const isLoadingPatientList = ref(true);
const pendingMessages = ref(new Set()); // Track pending messages

// Function to format date/time
const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

// Group messages by date
const groupedMessages = computed(() => {
    const groups = {};
    messages.value.forEach(message => {
        const date = formatDate(message.created_at);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
    });
    return groups;
});

const getLastMessage = (patientId) => {
        const allMessages = chatStore.GetAllMessages?.data || [];
        const patientMessages = allMessages.filter(
                msg => msg && (msg.sender_id === patientId || msg.receiver_id === patientId) && msg.text
        );
        if (patientMessages.length) {
                const lastMsg = patientMessages[patientMessages.length - 1];
                lastMessages.value[patientId] = {
                        text: lastMsg.text.length > 30 ? lastMsg.text.substring(0, 30) + '...' : lastMsg.text,
                        time: formatTime(lastMsg.created_at)
                };
        } else {
                lastMessages.value[patientId] = { text: 'No hay mensajes...', time: '' };
        }
};

const goToChat = async (id) => {
    isLoading.value = true;
    try {
        await getData(id, filter.value);
        router.push({ name: 'ChatPatients', params: { id: id }});
    } finally {
        isLoading.value = false;
    }
};

const handleFilter = async () => {
        showFiled.value = !showFiled.value
        filter.value = showFiled.value ? 1 : 0
        isLoadingPatientList.value = true;
        await patientsStore.IndexPatient(filter.value)
        goToChat(patientsStore.GetFirstPatient)
        isLoadingPatientList.value = false;
        
};

const VerifyFiled = async () => {
        await patientsStore.IndexPatient(1,1,0,true);
        verifyFiled.value = patientsStore.GetVerifyFiled;
};

const getData = async (id = props.id, filter=0) => {
    isLoading.value = true;
    try {
        const [patientData, messagesData, allMessagesData, patientListData] = await Promise.all([
            patientsStore.ShowPatient(id),
            chatStore.ShowMessage(id),
            chatStore.ShowAllMessages(),
            patientsStore.IndexPatient(filter)
        ]);

        messages.value = chatStore.GetMessages;
        await VerifyFiled();

        // Reset any existing Echo listeners
        echo.private(`chat.${currentUser.id}`).stopListening('MessageSent');
        
        // Set up new Echo listeners
        echo.private(`chat.${currentUser.id}`)
            .listen('MessageSent', async (response) => {
                messages.value.push(response.message);
            })
            .listenForWhisper("typing", (response) => {
                isPatientTyping.value = response.userID == Number(id);

                if (isPatientTypingTimer.value) {
                    clearTimeout(isPatientTypingTimer.value);
                }

                isPatientTypingTimer.value = setTimeout(() => {
                    isPatientTyping.value = false;
                }, 1000);
            });
    } finally {
        isLoading.value = false;
        isLoadingPatientList.value = false;
    }
};

const sendMessage = async (message, receiver_id) => {
    if (!message.message.trim()) return;

    // Create temporary message object
    const tempMessage = {
        id: `temp-${Date.now()}`, // Temporary ID
        text: message.message,
        sender_id: currentUser.id,
        receiver_id: receiver_id,
        created_at: new Date().toISOString(),
        pending: true
    };

    // Add to pending set
    pendingMessages.value.add(tempMessage.id);

    // Add message to local state immediately
    messages.value.push(tempMessage);

    // Clear input
    form.value.message = '';

    try {
        // Send to API
        const response = await chatStore.SendMessage(
            { message: tempMessage.text },
            receiver_id
        );

    
        
        // Remove temporary message
        const messageIndex = messages.value.findIndex(m => m.id === tempMessage.id);
        if (messageIndex !== -1) {
            messages.value.splice(messageIndex, 1);
        }
        

        // Remove from pending set
        pendingMessages.value.delete(tempMessage.id);

        

        // Refresh all messages
        await chatStore.ShowMessage(receiver_id);
        messages.value = chatStore.GetMessages;
        await chatStore.ShowAllMessages();
    } catch (error) {
        // Handle error - mark message as failed
        const messageIndex = messages.value.findIndex(m => m.id === tempMessage.id);
        if (messageIndex !== -1) {
            messages.value[messageIndex] = {
                ...tempMessage,
                pending: false,
                failed: true
            };
        }
        pendingMessages.value.delete(tempMessage.id);
        console.error('Failed to send message:', error);
    }
};


const sendTypingEvent = () => {
        echo.private(`chat.${props.id}`).whisper("typing", {
                userID: currentUser.id,
        });
};

const setValue = (value) => {
    form.value[value] = event.target.value;
    delete errorsForm.value[value];
};

onMounted(() => {
        showFiled.value = false
        getData(props.id)
});

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

const updateAllLastMessages = () => {
    patientList.value.forEach(patient => {
        getLastMessage(patient.id);
    });
};

const computedLastMessages = computed(() => {
    const messagesMap = {};
    const allMessages = allStoreMessages.value;
    
    patientList.value.forEach(patient => {
        const patientMessages = allMessages.filter(
            msg => msg && (msg.sender_id === patient.id || msg.receiver_id === patient.id) && msg.text
        );
        
        if (patientMessages.length) {
            const lastMsg = patientMessages[patientMessages.length - 1];
            messagesMap[patient.id] = {
                text: lastMsg.text.length > 30 ? lastMsg.text.substring(0, 30) + '...' : lastMsg.text,
                time: formatTime(lastMsg.created_at)
            };
        } else {
            messagesMap[patient.id] = { text: 'No hay mensaje...', time: '' };
        }
    });
    
    return messagesMap;
});

const allStoreMessages = computed(() => chatStore.GetAllMessages?.data || []);



</script>

<template>
        <div class="absolute w-screen h-screen top-0 pt-[90px] flex">
                <div class="w-1/5 shadow-xl">
                    <div v-if="isLoadingPatientList" class="h-full flex items-center justify-center">
                        <div class="flex flex-col items-center gap-4">
                            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-light-green"></div>
                            <p class="text-gray-600 text-lg">Cargando mensajes...</p>
                        </div>
                    </div>
                    <div v-else class="p-4 grid grid-cols-2">
                        <div class="text-2xl flex items-center gap-2">
                                <font-awesome-icon :icon="['fas', 'comments']" class="text-2xl" />
                                Chats
                        </div>
                        <div class="self-center justify-self-end">
                                <AppButton
                                v-if="verifyFiled"
                                class="flex items-center justify-center gap-2 text-base border rounded px-3.5 min-h-[1.625rem] min-w-[53px] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed bg-light-green text-black border-light-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black"
                                type="icon"
                                :icons="showFiled ? ['fas', 'comment-dots'] : ['fas', 'box-archive']"
                                :hoverText="showFiled ? 'Chats' : 'Chats archivados'"
                                @click="handleFilter"
                                />
                        </div>
                        </div>
                        <!--Listado de pacientes-->
                        <div class="flex flex-col">
                            <template v-for="patient in patientList" :key="patient.id">
                                <div 
                                    @click="goToChat(patient.id)"
                                    class="p-4 cursor-pointer border-b-2 border-neutral-gray w-full"
                                    :class="[{ 'bg-neutral-beige': patient.id == props.id }, { 'hover:bg-gray-200': hover && patient.id != props.id }]"
                                    :style="{ transition: 'background-color 0.3s' }"
                                    @mouseover="hover = true"
                                    @mouseleave="hover = false"
                                >
                                    <div class="text-base font-medium">
                                        {{ patient.name }} {{ patient.last_name }}
                                    </div>
                                    <div class="flex justify-between text-sm text-gray-500 mt-1">
                                        <span class="truncate">{{ computedLastMessages[patient.id]?.text || 'No hay mensajes...' }}</span>
                                        <span class="ml-2">{{ computedLastMessages[patient.id]?.time || '' }}</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                </div>
                <div class="h-full flex flex-col justify-between flex-grow">
                        <!--Nombre de paciente-->
                        <div class="bg-neutral-beige p-4 shadow-2xl">
                                <h1>{{ userPatient.name }} {{ userPatient.last_name }}</h1>
                        </div>
                        <div class="bg-lavender flex-grow p-2 overflow-y-auto h-max-48" ref="messagesContainer">
                        <!-- Loading Screen -->
                        <div v-if="isLoading" class="h-full flex items-center justify-center">
                            <div class="flex flex-col items-center gap-4">
                                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-light-green"></div>
                                <p class="text-gray-600 text-lg">Cargando mensajes...</p>
                            </div>
                        </div>

                        <!-- Messages Content -->
                        <template v-else>
                    <template v-for="(messageGroup, date) in groupedMessages" :key="date">
                        <div class="flex justify-center my-4">
                            <div class="bg-gray-200 rounded-full px-4 py-1 text-sm text-gray-600">
                                {{ date }}
                            </div>
                        </div>
                        
                        <template v-for="message in messageGroup" :key="message.id">
                            <div class="flex mb-2" :class="message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'">
                                <div class="flex flex-col px-2 py-3 rounded-2xl shadow-md max-w-[60%]" 
                                    :class="[
                                        message.sender_id === currentUser.id ? 'bg-light-green rounded-tr-none' : 'bg-light-gray rounded-tl-none',
                                        { 'opacity-70': message.pending },
                                        { 'bg-red-100': message.failed }
                                    ]"
                                >
                                    <div class="w-full text-black">{{ message.text }}</div>
                                    <div v-if="message.pending" class="text-xs text-gray-500">
                                        Enviando...
                                    </div>
                                    <div v-if="message.failed" class="text-xs text-red-500">
                                        Error al enviar. Toca para reintentar.
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs text-gray-500 mt-1 self-end" 
                                :class="message.sender_id === currentUser.id ? 'text-right' : 'text-left'">
                                {{ formatTime(message.created_at) }}
                            </div>
                        </template>
                    </template>

                    <div class="flex mb-2 justify-start" v-if="isPatientTyping">
                        <div class="flex px-2 py-3 rounded-2xl shadow-md max-w-[60%] bg-white rounded-tl-none opacity-70">
                            <div class="w-full text-black">{{ userPatient.name }} está escribiendo...</div>
                        </div>
                    </div>
                </template>
            </div>
            <form @submit.prevent="sendMessage(form, props.id)">
                <div class="bg-white py-4 px-2 shadow-2xl flex rounded-full">
                    <input 
                        class="input-message w-full text-wrap rounded-full"
                        :class="showFiled ? 'cursor-not-allowed': ''"
                        type="text"
                        placeholder="Escribe un mensaje..."
                        :disabled="showFiled"
                        @keydown="sendTypingEvent"
                        v-model="form.message"
                        @update:modelValue="setValue('message')"
                    />
                    <div class="px-4">
                        <button class="bg-pink px-4 py-2 rounded-full disabled:opacity-50" 
                                type="submit" 
                                :disabled="form.message.trim() === ''">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.input-message {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
}
</style>