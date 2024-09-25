import './assets/style/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Importando Fontawesome para iconos (https://fontawesome.com/icons)
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Importando Chart.js para gráficas (https://www.chartjs.org)
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";

// Importando vue3datepicker (https://vue3datepicker.com)
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Se agrega iconos a la biblioteca
library.add(fas, far, fab);

// Se registra Chart.js para utilizarlo en el proyecto
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
  );


const app = createApp(App)

app
    .component("FontAwesomeIcon", FontAwesomeIcon)
    .component('VueDatePicker', VueDatePicker)
    .use(createPinia())
    .use(router)
    .mount('#app')
