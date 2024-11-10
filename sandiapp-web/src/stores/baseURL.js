import axios from "axios";
import router from "@/router";
import { getValidationError } from "@/utilities"
import Swal from "sweetalert2";

axios.defaults.withCredentials = false;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["ngrok-skip-browser-warning"] = "1";
axios.defaults.headers.post["ngrok-skip-browser-warning"] = "1";
axios.defaults.headers.put["ngrok-skip-browser-warning"] = "1";
axios.defaults.headers.delete["ngrok-skip-browser-warning"] = "1";

const APIAxios = axios.create({
    baseURL: import.meta.env.VITE_SANDIAPI_URL
});

const RTXAxios = axios.create({
    baseURL: import.meta.env.VITE_RTX_URL
});

APIAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken'); // o sessionStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

APIAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && router.currentRoute.value.meta.requiresAuth){
      localStorage.removeItem("authToken");
      router.push({ name: 'Login' });
    }
    else if(error.response.status != 401 && error.response.status != 422){
        Swal.fire({
          title: "Error",
          text: getValidationError(error.response.status, error.response.message),
          icon: "error",
          confirmButtonColor: "#B8D0A7",
          confirmButtonText: "Aceptar",
          heightAuto: false,
        });
    }
  return Promise.reject(error);
  }
);

export { APIAxios, RTXAxios };