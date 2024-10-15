import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";

export const useNutritionalProfileStore = defineStore('nutritional-profile', {
  state: () => ({
    /* 1. data por ahora esta definido así, la idea es que quede como data: {} y en la vista se definan los demás atributos
       2. Debe haber una vista de crear y otro de editar, estas vistas deberan ser componentes y la vista global debera manejar
        la variable que active y desactive la edición haciendo change entre los componentes */
    /* data: { 
      user:{ 
        X name: '',
        X last_name: '',
        X sex: '',
        X birthdate: '',
        X age: '',
        X phone_number: '',
        X civil_status: '',
        X objectives: '',
      },
      nutritional_profile: {
        patient_id: 0,
        height: 0,
        weight: 0,
        physical_comentario: '',
        physical_status: '',
        habits: {
          X alcohol: '',
          X tabaco: ''
        },
         X allergies: [],
        nutritional_anamnesis: {
          X plan_anterior: '',
          X agua: ''
        },
        X morbid_antecedents: {
          X X dm2: false,
          X X hta: false,
          X X insulin_resistance: false,
          X X tiroides: false,
          X X dislipidemia: false,
          X cirugias: '',
          X farmacos: null,
          X exams: null,
          X otros: [],
        },
        X family_antecedents: {
         X X dm2: false,
         X X hta: false,
         X X tiroides: false,
         X X dislipidemia: false,
         X x comments: null,
        },
        subjective_assessment: {
         X X usual_weight: '',
         X X gastrointestinal_symptoms: '',
         X X weight_variation: '',
         X X appetite: '',
         X X digestion: '',
         X X digestion_frequency: '',
         X X digestion_measures: '',
        }
      }
    }, */
    data: {},
    profile_id: '',
  }),

  getters: {
    GetData: (state) => state.data,
  },

  actions: {
    async EditPatientProfile(id, nutritional_profile){
      await APIAxios.put(`/api/perfil-nutricional/${id}`, nutritional_profile);
    },

    async ShowPatientProfile(id){
      if(id !== undefined){
        const res = (await APIAxios.get(`/api/paciente/${id}`)).data.data;
        this.data = res;
      }
    }
  }
})