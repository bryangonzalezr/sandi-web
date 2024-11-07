<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { usePatientsStore } from '@/stores/patients.store';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { useRouter } from 'vue-router';
import AppButton from '@/common/AppButton.vue';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const patientsStore = usePatientsStore();
const loading = ref(true);

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const progress = ref([]);
const currentprogress = ref({});
const dateprogress = ref([]);
const heightprogress = ref([]);
const weightprogress = ref([]);
const fatprogress = ref([]);
const muscleprogress = ref([]);
const imcprogress = ref([]);

const loadData = async () => {
  try {
    loading.value = true;
    await patientsStore.ShowProgress(props.id);
    const fetchedProgress = patientsStore.GetProgress || [];

    progress.value = fetchedProgress;

    if (!progress.value.length) {}
    if (!fetchedProgress.length) {
      loading.value = false;
      return;
    }

    const lastProgress = fetchedProgress[fetchedProgress.length - 1];

    if (lastProgress) {
      currentprogress.value = {
        nutritional_state: lastProgress.nutritional_state || "Desconocido",
        weight: lastProgress.weight || 0,
        height: lastProgress.height || 0,
        fat_percentage: lastProgress.fat_percentage || 0,
        muscular_percentage: lastProgress.muscular_percentage || 0,
        imc: lastProgress.imc || 0
      };
    } else {
      currentprogress.value = {};
    }

    dateprogress.value = fetchedProgress.map(p => p.date || "Fecha no disponible");
    heightprogress.value = fetchedProgress.map(p => p.height || 0);
    weightprogress.value = fetchedProgress.map(p => p.weight || 0);
    fatprogress.value = fetchedProgress.map(p => p.fat_percentage || 0);
    muscleprogress.value = fetchedProgress.map(p => p.muscular_percentage || 0);
    imcprogress.value = fetchedProgress.map(p => p.imc || 0);

    // Asegurarse de que el DOM esté actualizado antes de dibujar gráficos
    await nextTick();
    loadCharts();
    loading.value = false;
  } catch (error) {
    console.error('Error cargando los datos del progreso:', error);
  }
};

const loadCharts = () => {
  if (!dateprogress.value.length || !heightprogress.value.length || !weightprogress.value.length || !fatprogress.value.length || !muscleprogress.value.length || !imcprogress.value.length) {
    return;
  }

  const ctxHeight = document.getElementById('heightChart').getContext('2d');
  new Chart(ctxHeight, {
    type: 'line',
    data: {
      labels: dateprogress.value,
      datasets: [{
        label: 'Altura',
        data: heightprogress.value,
        backgroundColor: 'rgba(236,196,220, 1)',
        borderColor: 'rgba(196,156,180, 1)',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Desactiva el ratio para ajustar el tamaño
      plugins: {
        title: {
          display: true,
          text: 'Altura por consulta'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          }
        }
      }
    }
  });

  const ctxWeight = document.getElementById('weightChart').getContext('2d');
  new Chart(ctxWeight, {
    type: 'line',
    data: {
      labels: dateprogress.value,
      datasets: [{
        label: 'Peso',
        data: weightprogress.value,
        backgroundColor: 'rgba(136,196,220, 1)',
        borderColor: 'rgba(96,156,180, 1)',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Ajustar el tamaño
      plugins: {
        title: {
          display: true,
          text: 'Peso por consulta'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          }
        }
      }
    }
  });

  const ctxFat = document.getElementById('fatChart').getContext('2d');
  new Chart(ctxFat, {
    type: 'line',
    data: {
      labels: dateprogress.value,
      datasets: [{
        label: 'Grasa',
        data: fatprogress.value,
        backgroundColor: 'rgba(217,138,10, 1)',
        borderColor: 'rgba(217,98,10, 1)',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Ajustar el tamaño
      plugins: {
        title: {
          display: true,
          text: 'Grasa por consulta'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          }
        }
      }
    }
  });

  const ctxMuscle = document.getElementById('muscleChart').getContext('2d');
  new Chart(ctxMuscle, {
    type: 'line',
    data: {
      labels: dateprogress.value,
      datasets: [{
        label: 'Musculo',
        data: muscleprogress.value,
        backgroundColor: 'rgba(255,210,33, 1)',
        borderColor: 'rgba(255,187,33, 1)',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Ajustar el tamaño
      plugins: {
        title: {
          display: true,
          text: 'Musculo por consulta'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          }
        }
      }
    }
  });

  const ctxIMC = document.getElementById('imcChart').getContext('2d');
  new Chart(ctxIMC, {
    type: 'line',
    data: {
      labels: dateprogress.value,
      datasets: [{
        label: 'IMC',
        data: imcprogress.value,
        backgroundColor: 'rgba(0,202,19, 1)',
        borderColor: 'rgba(0,164,19, 1)',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Ajustar el tamaño
      plugins: {
        title: {
          display: true,
          text: 'IMC por consulta'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          }
        }
      }
    }
  });
};

const router = useRouter();

const goToConsults = () => {
  router.push({ name: 'PatientConsult', params: { id: props.id } });
};

const goBack = () => {
  router.push({name: 'PatientsShow', params: {id: props.id}});
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <AppButton
      class="w-fit bg-light-gray border-0 px-3 mx-6 mb-5 rounded-none rounded-b-lg"
      type="button"
      text="Volver"
      :icons="['fas', 'arrow-left']"
      @click="goBack"
    />
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin w-8 h-8 border-4 border-t-mid-green border-b-mid-red border-l-light-violet border-r-light-orange rounded-full"></div>
      <span class="visually-hidden">  Cargando...</span>
    </div>

    <div v-else-if="!progress.length">
      <div class="flex flex-col">
        <h1 class="text-2xl flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'chart-line']" class="text-black" />
          Progreso
        </h1>
      </div>
      <p class="text-center text-xl font-bold mt-4">No tiene progreso registrado.</p>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-center mt-4">
        <AppButton 
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
          type="button" 
          text="Crear Consulta"
          :icons="['fas', 'plus']" 
          @click="goToConsults" 
        />
      </div>
    </div>
    <div v-if="progress.length" class="flex flex-col gap-y-6">
      <div class="flex justify-between">
        <div class="flex flex-col">
          <h1 class="text-2xl flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'chart-line']" class="text-black" />
            Progreso
          </h1>
        </div>
        <AppButton 
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green"
          type="button" 
          text="Agregar Antropometría"
          :icons="['fas', 'plus']" 
          @click="goToConsults" 
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="col-span-2 text-xl">Últimas medidas</div>
        <div>
          <h2 class="text-base">Estado Nutricional: {{ currentprogress.nutritional_state }}</h2>
          <p class="text-base">Peso: {{ currentprogress.weight }} kg</p>
          <p class="text-base">Altura: {{ currentprogress.height }} m</p>
          <p class="text-base">IMC: {{ currentprogress.imc }}</p>
          <p class="text-base">Grasa: {{ currentprogress.fat_percentage }}%</p>
          <p class="text-base">Musculatura: {{ currentprogress.muscular_percentage }}%</p>
        </div>
      </div>

      <div class="mt-2">
        <h2 class="text-xl font-bold mb-4">Gráficas de Progreso</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="h-64">
            <canvas id="heightChart"></canvas>
          </div>
          <div class="h-64">
            <canvas id="weightChart"></canvas>
          </div>
          <div class="h-64">
            <canvas id="fatChart"></canvas>
          </div>
          <div class="h-64">
            <canvas id="muscleChart"></canvas>
          </div>
          <div class="col-span-2 h-96">
            <canvas id="imcChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
