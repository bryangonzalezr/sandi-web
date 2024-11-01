import { APIAxios } from "./baseURL";
import { defineStore  } from "pinia";
import router from "@/router";

export const useConsultStore = defineStore('consulta', {
  state: () => ({
    /*consulta: {
        "date": "05/10/2024",
        "patient_id": 4,
        "X height": 1.63,
        "X weight": 78,
        "X bicipital_skinfold" : 12,
        "X tricipital_skinfold": 12 ,
        "X subscapular_skinfold": 40 ,
        "X supraspinal_skinfold": 0 ,
        "X suprailiac_skinfold": 20 ,
        "X thigh_skinfold": 0 ,
        "X calf_skinfold": 0,
        "X abdomen_skinfold":0,
        "X pb_relaj": 23,
        "X pb_contra": 0,
        "X forearm":0,
        "X thigh":0,
        "X calf":0,
        "X waist":0,
        "X thorax":0
    } */
    consulta: {},
  }),

  getters: {
    GetConsult: (state) => state.consult,
  },

  actions: {

      async saveConsult(id,consultdata) {
        await APIAxios.post('api/consulta', consultdata).then(() =>{
          router.push({name: 'PatientProgress', params: {id: id}});
        });
      }
  }
});