import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useContactCardStore = defineStore('contact_card', {
  state: () => ({
    /*contact-card: {
        "nutritionist_id" = '',
        "commune_id" = '',
        "address" = '',
        "slogan" = '',
        "specialties" = '',
        "description"= '',
       }
       */
    contact_card: {},
    /*experience: {
      "nutritionist_id": 3,
      "type": "Trabajo de Tiempo Completo",
      "title": "Nutricionista Centro de Cáncer Clínica Las Condes",
      "institution": "Clínica Las Condes",
      "description": "Nutricionista Centro de Cáncer Clínica Las Condes",
      "start_date": "01/02/2024"
      }  
      */
    experiences: [],
    experience: {},
    experience_type: {},
    meta: {},
    links: {}
  }),

  getters: {
    GetContactCard: (state) => state.data,
    GetExperience: (state) => state.experience,
    GetExperiences: (state) => state.experiences,
    GetMeta: (state) => state.meta,
    GetLinks: (state) => state.links
  },

  actions: {

    async EnumExperienceType(){
      await APIAxios.get('/api/enum/experience-types').then((data) => {
        this.experience_type = data.data
        /* console.log(this.experience_type) */
      })
    },

    async IndexExperience(paginate = 0, page){
      await APIAxios.get(`/api/experiencias?paginate=${paginate}&page=${page}`).then((data) => {
        this.experiences = data.data
        this.links = data.data.links ? res.data.links : {};
        this.meta = data.data.meta ? res.data.meta : {};
        console.log(data.data)
      }).catch((error) => {
        this.experiences = []
      })
    },

    async CreateExperience(experience){
      await APIAxios.post('/api/experiencia', experience).then((data) => {
        this.experience = data.data
        console.log(this.experience)
      })
    },


    async DeleteExperience(id) {
      await APIAxios.delete(`/api/experiencia/${id}`).then(() => {
        Swal.fire({
          title: "La experiencia se ha eliminado con éxito",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          heightAuto: false,
        });
      });
    },


    async CreateContactCard(contact_card) {
      await APIAxios.post(`/api/tarjeta/`, contact_card).then(() => {
        Swal.fire({
          title: "La tarjeta de contacto se ha creado con éxito",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          heightAuto: false,
        });
      });
    },

    async EditContactCard(id, contact_card) {
      await APIAxios.put(`/api/tarjeta/${id}`, contact_card).then(() => {
        Swal.fire({
          title: "La tarjeta de contacto se ha editado con éxito",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          heightAuto: false,
        });
      });
    },

    async DeleteContactCard(id) {
      await APIAxios.delete(`/api/tarjeta/${id}`).then(() => {
        Swal.fire({
          title: "La tarjeta de contacto se ha eliminado con éxito",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          heightAuto: false,
        });
      });
    },

    async ShowContactCard(id) {
      if (id !== undefined) {
        const res = (await APIAxios.get(`/api/tarjeta/${id}`)).data.data;
        this.contact_card = res;
      }
    }

  }
});
