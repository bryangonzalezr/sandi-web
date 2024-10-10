import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";

export const useListRecipesStore = defineStore('list-recipes',{
    state: () => ({
        recipesList: []
    }),

    getters: {
        GetRecipesList: (state) => state.recipesList,
    },

    actions: {
        async ShowRecipes(){
            const res = (await APIAxios.get(`/api/recetas`));
            this.recipesList = res.data.data;
        },

        async DeleteRecipe(id){
            const res = await APIAxios.delete(`/api/receta/${id}`);
        }
    }
})