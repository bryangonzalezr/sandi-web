import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";

export const useNutritionalProfileStore = defineStore('nutritional-profile', {
  state: () => ({
    /* 1. data por ahora esta definido así, la idea es que quede como data: {} y en la vista se definan los demás atributos
       2. Debe haber una vista de crear y otro de editar, estas vistas deberan ser componentes y la vista global debera manejar
        la variable que active y desactive la edición haciendo change entre los componentes */
    data: { 
      user:{ 
        name: '',
        last_name: '',
        sex: '',
        birthdate: '',
        age: '',
        phone_number: '',
        civil_status: '',
        objectives: '',
      },
      nutritional_profile: {
        patient_id: 0,
        height: 0,
        weight: 0,
        physical_comentario: '',
        physical_status: '',
        habits: {
          alcohol: '',
          tabaco: ''
        },
        allergies: [],
        nutritional_anamnesis: {
          plan_anterior: '',
          agua: ''
        },
        morbid_antecedents: {
          dm2: false,
          hta: false,
          insulin_resistance: false,
          tiroides: false,
          dislipidemia: false,
          cirugias: '',
          farmacos: null,
          exams: null,
          otros: [],
        },
        family_antecedents: {
          dm2: false,
          hta: false,
          tiroides: false,
          dislipidemia: false,
          comments: null,
        },
        subjective_assessment: {
          usual_weight: '',
          gastrointestinal_symptoms: '',
          weight_variation: '',
          appetite: '',
          digestion: '',
          digestion_frequency: '',
          digestion_measures: '',
        }
      }
    },
    profile_id: '',
  }),

  getters: {
    GetData: (state) => state.data,
  },

  actions: {
    async EditPatientProfile(){
      const res = await APIAxios.put(`/api/perfil-nutricional/${this.profile_id}`, this.data.nutritional_profile);
      console.log(res);
    },

    async ShowPatientProfile(id){
      if(id !== undefined){
        const res = (await APIAxios.get(`/api/paciente/${id}`)).data.data;
        this.profile_id = res.nutritional_profile.id;
        this.data.nutritional_profile.patient_id = res.user.id;
        this.data.user.name = res.user.name;
        this.data.user.last_name = res.user.last_name;
        this.data.user.email = res.user.email;
        this.data.user.role = res.user.role;
        this.data.user.sex = res.user.sex;
        this.data.user.birthdate = res.user.birthdate;
        this.data.user.age = res.user.age;
        this.data.user.phone_number = res.user.phone_number;
        this.data.user.civil_status = res.user.civil_status;
        this.data.user.objectives = res.user.objectives;
        this.data.nutritional_profile.physical_comentario = res.nutritional_profile.physical_comentario;
        this.data.nutritional_profile.physical_status = res.nutritional_profile.physical_status;
        this.data.nutritional_profile.habits.alcohol = res.nutritional_profile.habits.alcohol;
        this.data.nutritional_profile.habits.tabaco = res.nutritional_profile.habits.tabaco;
        this.data.nutritional_profile.allergies = res.nutritional_profile.allergies;
        this.data.nutritional_profile.nutritional_anamnesis.plan_anterior = res.nutritional_profile.nutritional_anamnesis.plan_anterior;
        this.data.nutritional_profile.nutritional_anamnesis.agua = res.nutritional_profile.nutritional_anamnesis.agua;
        this.data.nutritional_profile.morbid_antecedents.dm2 = res.nutritional_profile.morbid_antecedents.dm2;
        this.data.nutritional_profile.morbid_antecedents.hta = res.nutritional_profile.morbid_antecedents.hta;
        this.data.nutritional_profile.morbid_antecedents.insulin_resistance = res.nutritional_profile.morbid_antecedents.insulin_resistance;  
        this.data.nutritional_profile.morbid_antecedents.tiroides = res.nutritional_profile.morbid_antecedents.tiroides;
        this.data.nutritional_profile.morbid_antecedents.dislipidemia = res.nutritional_profile.morbid_antecedents.dislipidemia;
        this.data.nutritional_profile.morbid_antecedents.cirugias = res.nutritional_profile.morbid_antecedents.cirugias;
        this.data.nutritional_profile.morbid_antecedents.farmacos = res.nutritional_profile.morbid_antecedents.farmacos;
        this.data.nutritional_profile.morbid_antecedents.exams = res.nutritional_profile.morbid_antecedents.exams;
        this.data.nutritional_profile.morbid_antecedents.otros = res.nutritional_profile.morbid_antecedents.otros;
        this.data.nutritional_profile.family_antecedents.dm2 = res.nutritional_profile.family_antecedents.dm2;
        this.data.nutritional_profile.family_antecedents.hta = res.nutritional_profile.family_antecedents.hta;
        this.data.nutritional_profile.family_antecedents.tiroides = res.nutritional_profile.family_antecedents.tiroides;
        this.data.nutritional_profile.family_antecedents.dislipidemia = res.nutritional_profile.family_antecedents.dislipidemia;
        this.data.nutritional_profile.family_antecedents.comments = res.nutritional_profile.family_antecedents.comments;
        this.data.nutritional_profile.subjective_assessment.usual_weight = res.nutritional_profile.subjective_assessment.usual_weight;
        this.data.nutritional_profile.subjective_assessment.gastrointestinal_symptoms = res.nutritional_profile.subjective_assessment.gastrointestinal_symptoms;
        this.data.nutritional_profile.subjective_assessment.weight_variation = res.nutritional_profile.subjective_assessment.weight_variation;
        this.data.nutritional_profile.subjective_assessment.appetite = res.nutritional_profile.subjective_assessment.appetite;
        this.data.nutritional_profile.subjective_assessment.digestion = res.nutritional_profile.subjective_assessment.digestion;
        this.data.nutritional_profile.subjective_assessment.digestion_frequency = res.nutritional_profile.subjective_assessment.digestion_frequency;
        this.data.nutritional_profile.subjective_assessment.digestion_measures = res.nutritional_profile.subjective_assessment.digestion_measures;
      }
    }
  }
})