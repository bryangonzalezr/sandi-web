import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useChatStore = defineStore('chat',{
  state: () => ({
    messages: [],
    message: "",
    all_messages: [],
    idLastChat: JSON.parse(localStorage.getItem("idLastChat")) || null,
  }),

  getters: {
    GetMessages: (state) => state.messages,
    GetAllMessages: (state) => state.all_messages
  },


  actions: {
    async ShowMessage(user_id) {
      await APIAxios.get(`/api/messages/${user_id}`).then((res) => {
        this.messages = res.data.message
        this.idLastChat = user_id;
        localStorage.setItem("idLastChat", JSON.stringify(user_id));
      });

    },

    async SendMessage(form, receiver_id) {
      const res = await APIAxios.post(`/api/messages/${receiver_id}`, form).then((res) => {
        this.messages.push(res.data.message) 
      });
    },

    async ShowAllMessages() {
      const res = await APIAxios.get(`/api/all-messages`).then((res) => {
        this.all_messages = res.data
      });
    }
  }
})