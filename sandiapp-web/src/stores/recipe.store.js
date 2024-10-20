import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useRecipeStore = defineStore('newrecipe',{
  state: () => ({
    recipe: {},
    recipesList: [],
    links: {},
    meta: {}
  }),
  
  getters: {
    GetRecipe: (state) => state.recipe,
    GetRecipesList: (state) => state.recipesList,
    GetMeta: (state) => state.meta,
    GetLinks: (state) => state.links
  },

  actions: {
    async IndexRecipe(page, paginate = 0){
      const res = (await APIAxios.get(`/api/recetas?page=${page}&paginate=${paginate}`));
      this.recipesList = res.data.data;
      this.links = res.data.links ? res.data.links : {};
      this.meta = res.data.meta ? res.data.meta : {};
    },

    async ShowRecipe(id){
      const res = (await APIAxios.get(`/api/receta/${id}`));
      this.recipe = res.data.data;
    },

    async CreateRecipe(newrecipe){
      await APIAxios.post(`/api/receta`,newrecipe)
      Swal.fire({
        title: "La receta se ha guardado con exito",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        heightAuto: false,
      });
    },

    async UpdateRecipe(recipe, id_recipe) {
      await APIAxios.put(`/api/receta/${id_recipe}`,recipe)
      Swal.fire({
        title: "La receta se ha actualizado con exito",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        heightAuto: false,
      });
    },

    async DeleteRecipe(id){
        const res = await APIAxios.delete(`/api/receta/${id}`);
        Swal.fire({
          title: "La receta se ha eliminado con exito",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          heightAuto: false,
      });

    }
  }

})