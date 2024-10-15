import { APIAxios } from "./baseURL";
import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menus: [],
        menu: {},
        links: {},
        meta: {},
    }),

    getters: {
        GetMenus: (state) => state.menus,
        GetMenu: (state) => state.menu,
        GetLinks: (state) => state.links,
        GetMeta: (state) => state.meta,
    },

    actions: {
        async IndexMenus(page,id_patient = '', type = '', sandi = ''){
            const res = await APIAxios.get(`/api/all-menus?page=${page}&patient=${id_patient}&type=${type}&sandi=${sandi}`)
            this.menus = res.data.data
            this.links = res.data.links
            this.meta = res.data.meta
        },

        async ShowMenu(id_menu){
            const res = await APIAxios.get(`/api/menu/${id_menu}`)
            this.menu = res.data.data
        },

        async ShowMenuday(id_menu){
            const res = await APIAxios.get(`/api/menu-diario/${id_menu}`)
            this.menu = res.data.data
        },

        async SaveMenu(menu){
            await APIAxios.post(`/api/menu`, menu)
            Swal.fire({
                title: "El menú se ha guardado con exito",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
                heightAuto: false,
            });
        },
        
        async SaveMenuDay(menuDay){
            await APIAxios.post(`/api/menu-diario`, menuDay)
            Swal.fire({
                title: "El menú se ha guardado con exito",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
                heightAuto: false,
            });
        },

        async DeleteMenu(id_menu){
            try{
                await APIAxios.delete(`/api/menu/${id_menu}`)
                Swal.fire({
                    title: "El menú se ha eliminado con exito",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                    heightAuto: false,
                });
            }catch(err){
                console.log(err)
            }
        },

        async DeleteMenuDay(id_menu){
            try{
                await APIAxios.delete(`/api/menu-diario/${id_menu}`)
                Swal.fire({
                    title: "El menú se ha eliminado con exito",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                    heightAuto: false,
                });
            }catch(err){
                console.log(err)
            }
        },
    }
})