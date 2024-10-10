import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";

export const useListMenusStore = defineStore('list-menus', {
    state: () => ({
        data: {}
    }),

    actions: {
        async ShowMenus(){
            const res = (await APIAxios.get(`/api/all-menus`)).data.data
            console.log(res)
        }
    }
})