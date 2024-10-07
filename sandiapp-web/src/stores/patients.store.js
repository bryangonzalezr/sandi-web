import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";

export const usePatientsStore = defineStore('patients',{
  state: () => ({
    patientslist: [],
    patientprogress: {},
    patient: {},
  }),

  getters: {
    GetPatients: (state) => state.patientslist,
    GetProgress: (state) => state.patientprogress,
    GetPatient: (state) => state.patient,
  },

  actions: {
    async IndexPatient() {
      const res = await APIAxios.get(`/api/pacientes`);
      this.patientslist = res.data.data;
    },

    async ShowPatient(id){
      const res = await APIAxios.get(`/api/paciente/${id}`);
      this.patient = res.data.data;
    },

    async RemovePatient(id) {
      const res = await APIAxios.delete(`/api/paciente/${id}`);
      console.log("Eliminar paciente con id",id);
      this.IndexPatient();
    },

    async AssociatePatient(email) {
      const res = await APIAxios.post(`/api/paciente` , { patient_email: email});
      this.IndexPatient();
    },

    async ShowProgress(id){
      const res = await APIAxios.get(`/api/progreso/${id}`)
      this.patientprogress = res.data
    }
      
  }
})