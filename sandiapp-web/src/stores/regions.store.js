import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";

export const useRegionStore = defineStore('regions', {
    state: () => ({
      /*regions: [
        id = "",
        ordinal = ""
        ]
         */
      regions: [],
      communes: [],
      commune: {}
    }),
  
    getters: {
      GetRegions: (state) => state.regions,
      GetCommunes: (state) => state.communes,
      GetCommune: (state) => state.commune
    },
  
    actions: {
      
      async RegionsList(){
        await APIAxios.get(`/api/regions`).then((data) => {
          this.regions = data.data
        });
      },

      async CommunesList(ordinal){
        await APIAxios.get(`/api/communes?region=${ordinal}`).then((data) => {
            this.communes = data.data.data
        });
      },

      async ShowCommune(commune_id){
        await APIAxios.get(`/api/communes/${commune_id}`).then((data) => {
            this.commune = data.data.data
        });
      }
  
    }
  });
  