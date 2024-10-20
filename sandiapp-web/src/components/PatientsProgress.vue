<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { usePatientsStore } from '@/stores/patients.store';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { useRouter } from 'vue-router';
import AppButton from '@/common/AppButton.vue';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const patientsStore = usePatientsStore();

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

const loadData = async () => {
  try {
    await patientsStore.ShowProgress(props.id);
    const fetchedProgress = patientsStore.GetProgress || [];

    progress.value = fetchedProgress;

    if (!progress.value.length) {
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
      };
    } else {
      currentprogress.value = {};
    }

    dateprogress.value = fetchedProgress.map(p => p.date || "Fecha no disponible");
    heightprogress.value = fetchedProgress.map(p => p.height || 0);
    weightprogress.value = fetchedProgress.map(p => p.weight || 0);

    // Asegurarse de que el DOM esté actualizado antes de dibujar gráficos
    await nextTick();
    loadCharts();
  } catch (error) {
    console.error('Error cargando los datos del progreso:', error);
  }
};

const loadCharts = () => {
  if (!dateprogress.value.length || !heightprogress.value.length || !weightprogress.value.length) {
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
  <div class="p-4">
    <div v-if="progress.length">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h2 class="text-lg font-bold">Estado Nutricional: {{ currentprogress.nutritional_state }}</h2>
          <p>Peso: {{ currentprogress.weight }} kg</p>
          <p>Altura: {{ currentprogress.height }} m</p>
          <p>Grasa: {{ currentprogress.fat_percentage }}%</p>
          <p>Musculatura: {{ currentprogress.muscular_percentage }}%</p>
        </div>

        <div class="grid grid-flow-col auto-cols-max gap-2 justify-self-end">
          <AppButton 
            class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black" 
            type="button" 
            text="Ir a consultas"
            :icons="['fas', 'eye']" 
            @click="goToConsults" 
          />
          <AppButton 
            class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black" 
            type="button" 
            text="Volver"
            :icons="['fas', 'arrow-left']" 
            @click="goBack" 
          />
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">Gráficas de Progreso</h2>
        <div>
          <canvas id="heightChart"></canvas>
        </div>
        <div class="mt-8">
          <canvas id="weightChart"></canvas>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="text-center text-xl font-bold mt-4">No tiene progreso registrado.</p>
      <div class="grid grid-flow-col auto-cols-max gap-2 justify-center mt-4">
        <AppButton 
          class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black" 
          type="button" 
          text="Crear Consulta"
          :icons="['fas', 'plus']" 
          @click="goToConsults" 
        />
        <AppButton 
          class="bg-forest-green text-black border-forest-green enabled:hover:bg-white enabled:hover:text-black enabled:hover:border-black" 
          type="button" 
          text="Volver al perfil"
          :icons="['fas', 'arrow-left']" 
          @click="goBack" 
        />
      </div>
    </div>
  </div>
</template>
