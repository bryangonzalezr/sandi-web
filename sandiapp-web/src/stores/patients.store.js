import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const usePatientsStore = defineStore('patients',{
  state: () => ({
    patientslist: [],
    links: {},
    meta: {},
    patientprogress: [],
    patient: {},
    firstPatient: 0,
  }),

  getters: {
    GetPatients: (state) => state.patientslist,
    GetLinks: (state) => state.links,
    GetMeta: (state) => state.meta,
    GetProgress: (state) => state.patientprogress,
    GetPatient: (state) => state.patient,
    GetFirstPatient: (state) => state.firstPatient,
  },

  actions: {
    async IndexPatient(archivados = 0, page, paginate = 0) {
      try{
        const res = await APIAxios.get(`/api/pacientes?page=${page}&archivados=${archivados}&paginate=${paginate}`);
        this.patientslist = res.data.data;
        this.firstPatient = res.data.data[0].id
        this.links = res.data.links ? res.data.links : {};
        this.meta = res.data.meta ? res.data.meta : {};
      }catch(error){
        this.patientslist = [];
        this.firstPatient = null;
      }
    },

    async ShowPatient(id){
      const res = await APIAxios.get(`/api/paciente/${id}`);
      this.patient = res.data.data;
    },

    async RemovePatient(id) {
      const res =await APIAxios.delete(`/api/paciente/${id}`);
    },

    async AssociatePatient(email) {
      await APIAxios.post(`/api/paciente` , { patient_email: email});
      Swal.fire({
        title: "Se ha añadido un nuevo paciente",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        heightAuto: false,
      });
    },

    async RestorePatient(id){
      await APIAxios.put(`api/paciente/restore/${id}`).then(() => {
        Swal.fire({
          title: "Se ha restaurado al paciente exitosamente",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          heightAuto: false,
        });
      })
    },

    async ShowProgress(id){
      const res = await APIAxios.get(`/api/progreso/${id}`)
      this.patientprogress = res.data.data;
    }
      
  }
})