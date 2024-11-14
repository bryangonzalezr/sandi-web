import { defineStore } from "pinia";
import router from "@/router";
import { APIAxios } from "./baseURL";
import Swal from "sweetalert2";
import { usePatientsStore } from './patients.store';

export const useAuthStore = defineStore('auth', {
        state: () => ({
            user: JSON.parse(localStorage.getItem("user")) || null, // Aquí se guarda los datos del usuario logueado
            rolUser: JSON.parse(localStorage.getItem("rolUser")) || null,
            roles: JSON.parse(localStorage.getItem("roles")) || null,
            register: {
                objectives: '',
                role: ''
            },
            loadingPage: false,
            shouldDisplayHeader: JSON.parse(localStorage.getItem("shouldDisplayHeader")) || false,
        }),
    
        getters: {
            // Esto es para saber si el usuario esta logueado
            isAuth: (state) => state.user !== null,
            userInfo: (state) => state.user,
            permissionList: (state) => state.permission,
            ipsipInfo: (state) => state.ipsip,
        },
    
        actions: {

            async SessionUser() {
                try{
                    const data = await APIAxios.get("/api/check-session")
                    return data.data
                }catch{
                    return false;
                }
            },

            async ShowRoles() {
                const data = await APIAxios.get(`/api/roles`);
                return data.data;
            },

            async UpdateProfile(id){
                await APIAxios.put(`/api/usuario/${id}`).then((res) => {
                    Swal.fire({
                        title: "Se han actualizado tus datos",
                        text: "Tu información se ha actualizado correctamente.",
                        icon: "success",
                        timer: 1000,
                        showConfirmButton: false,
                        heightAuto: false,
                      });
                    this.user = res.data.data
                    localStorage.setItem("user", JSON.stringify(this.user))
                })
            },

            async Login(credentials){
                // Hace el login
                const data = await APIAxios.post(`/api/login`, credentials);
                const user = data.data.user
                const role = user.role
                if(role == 'paciente' || role == 'usuario_basico'){
                    Swal.fire({
                        title: "ACCESO RESTRINGIDO",
                        text: "Tu cuenta solo puede iniciar sesión desde la aplicación móvil. Por favor, ingresa desde nuestra app para continuar.",
                        icon: "error",
                        confirmButtonColor: "#B8D0A7",
                        confirmButtonText: "Aceptar",
                        heightAuto: false,
                      });
                }else{
                    const patientStore = usePatientsStore()
                    localStorage.setItem("authToken", data.data.token);
                    APIAxios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
                    await patientStore.IndexPatient()
                    let roles = [];
                    try {
                      roles = await this.ShowRoles();
                    } catch (err) {
                        console.error(err);
                    }
                    router.push( {name: 'Patients'});
                    this.user = user;
                    this.rolUser = role;
                    this.roles = roles.data;
                    this.shouldDisplayHeader = true;
                    localStorage.setItem("user", JSON.stringify(user))
                    localStorage.setItem("rolUser", JSON.stringify(role))
                    localStorage.setItem("roles", JSON.stringify(roles))
                    localStorage.setItem("shouldDisplayHeader", true);
                }
            },

            async Logout(){
                this.loadingPage = true;
                try{
                    this.user = null
                    this.shouldDisplayHeader = false;
                    localStorage.removeItem("shouldDisplayHeader");
                    localStorage.removeItem("user");
                    localStorage.removeItem("rolUser");
                    localStorage.removeItem("roles");
                    localStorage.removeItem("lastPath");
                    localStorage.getItem('authToken');
                    await router.push({name: 'Login'});

                    await APIAxios.post(`/api/logout`);
                    this.loadingPage = false;
                }catch(error){
                    this.loadingPage = false;
                    Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        showConfirmButton: true,
                        confirmButtonColor: "#B8D0A7",
                        confirmButtonText: "Aceptar",
                        heightAuto: false,
                      });
                }
            },
    
            async Register(credentials) {
                credentials.role = 'nutricionista'
                await APIAxios.post(`api/register`, credentials).then(() => {
                    router.push({name: 'Login'});  
                })
            }

        },

    },
)