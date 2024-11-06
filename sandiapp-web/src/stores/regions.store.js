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
      communes: []
    }),
  
    getters: {
      GetRegions: (state) => state.regions,
      GetCommunes: (state) => state.communes
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
      }
  
    }
  });
  