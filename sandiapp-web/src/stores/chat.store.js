import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useChatStore = defineStore('chat',{
  state: () => ({
    messages: ref([]),
    message: "",
  }),

  getters: {
    GetMessages: (state) => state.messages,
  },

  actions: {
    async ShowMessage(user_id) {
      const res = await APIAxios.get(`/api/messages/${user_id}`).then((res) => {
        this.messages = res.data.message
      });

    },

    async SendMessage(form, receiver_id) {
      const res = await APIAxios.post(`/api/messages/${receiver_id}`, form).then((res) => {
        this.messages.push(res.data.message) 
      });
    }
      
  }
})