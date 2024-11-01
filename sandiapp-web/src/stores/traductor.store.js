import { RTXAxios } from "./baseURL";
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useTraductorStore = defineStore('traductor',{
  state: () => ({
  }),

  getters: {
  },

  actions: {
    async EngToEsp(text) {
      const res = await RTXAxios.get(`/en_to_es/${text}`)
      return res 
    },

    async EspToEng(text) {
      const res = await RTXAxios.post(`/es_to_en/${text}`)
      return res 
    }
      
  }
})