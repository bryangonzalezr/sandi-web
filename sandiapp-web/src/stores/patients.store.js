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
      const res = await APIAxios.get(`/api/pacientes?page=${page}&archivados=${archivados}&paginate=${paginate}`);
      this.patientslist = res.data.data;
      this.firstPatient = res.data.data[0].id
      this.links = res.data.links ? res.data.links : {};
      this.meta = res.data.meta ? res.data.meta : {};
    },

    async ShowPatient(id){
      const res = await APIAxios.get(`/api/paciente/${id}`);
      this.patient = res.data.data;
    },

    RemovePatient(id) {
      Swal.fire({
        title: "¿Segur@ que quieres eliminar al paciente?",
        showDenyButton: true,
        confirmButtonText: "Si",
        confirmButtonColor: "#76A95C",
        denyButtonText: `No`,
        denyButtonColor: "#DE3E3E",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await APIAxios.delete(`/api/paciente/${id}`);
          this.IndexPatient();
        }
      });
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

    async ShowProgress(id){
      const res = await APIAxios.get(`/api/progreso/${id}`)
      this.patientprogress = res.data.data;
    }
      
  }
})