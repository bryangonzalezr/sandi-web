import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";

export const useRecipeStore = defineStore('newrecipe',{
  state: () => ({
    recipe: {
      label: '',
      dietLabels: [],
      healthLabels: [],
      cautions: [],
      ingredientLines: [],
      calories: 0,
      mealType: [],
      dishType: [],
      instructions: '',
      user_id: null,
      sandi_recipe: false,
    }
  }),
  
  getters: {
    GetRecipe: (state) => state.data,
  },

  actions: {
    async CreateRecipe(newrecipe){
      await APIAxios.post(`/api/receta`,newrecipe)
    }
  }

})