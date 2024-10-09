<script setup>
// Importaciones desde Vue y Chart.js
import { ref, onMounted } from 'vue';
import { usePatientsStore } from '@/stores/patients.store';
import { defineProps } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

// Registrar componentes de Chart.js
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

// Importar el store de pacientes
const patientsStore = usePatientsStore();

// Definir props que recibes
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

// Variables reactivas
const progress = ref([]);
const currentprogress = ref([]);
const dateprogress = ref([]);
const heightprogress = ref([]);
const weightprogress = ref([]);

// Definir funciones asincrónicas para cargar datos
const loadData = async () => {
  try {
    // Llamada a la función ShowProgress con el id del paciente
    await patientsStore.ShowProgress(props.id);

    console.log('Datos de progreso:', patientsStore.GetProgress);

    // Asignar el progreso obtenido desde el store
    const fetchedProgress = patientsStore.GetProgress || [];

    if (fetchedProgress.length === 0) {
      console.warn('No hay datos de progreso disponibles.');
      return;
    }

    // Actualizar las variables reactivas con los datos obtenidos
    progress.value = fetchedProgress;
  
    // Obtener el último progreso
    const lastProgress = fetchedProgress[fetchedProgress.length - 1];

    // Verificar que los datos de la última consulta existan y tengan las propiedades esperadas
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

    // Mapear los datos de las consultas solo si los valores están presentes
    dateprogress.value = fetchedProgress.map(p => p.date || "Fecha no disponible");
    heightprogress.value = fetchedProgress.map(p => p.height || 0);
    weightprogress.value = fetchedProgress.map(p => p.weight || 0);

    // Cargar las gráficas con los datos obtenidos
    loadCharts();
  } catch (error) {
    console.error('Error cargando los datos del progreso:', error);
  }
};

// Función para cargar los gráficos
const loadCharts = () => {
  // Verificar que las referencias tengan datos antes de cargar los gráficos
  if (!dateprogress.value.length || !heightprogress.value.length || !weightprogress.value.length) {
    console.warn('Datos insuficientes para los gráficos.');
    return;
  }

  // Gráfico para la altura
  const ctxHeight = document.getElementById('heightChart').getContext('2d');
  new Chart(ctxHeight, {
    type: 'line',
    data: {
      labels: dateprogress.value,
      datasets: [{
        label: 'Altura',
        data: heightprogress.value,
        backgroundColor: 'rgba(236,196,220, 1)',
        borderColor: 'rgba(236,196,220, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Altura por consulta'
        }
      }
    }
  });

  // Gráfico para el peso
  const ctxWeight = document.getElementById('weightChart').getContext('2d');
  new Chart(ctxWeight, {
    type: 'line',
    data: {
      labels: dateprogress.value,
      datasets: [{
        label: 'Peso',
        data: weightprogress.value,
        backgroundColor: 'rgba(136,196,220, 1)',
        borderColor: 'rgba(136,196,220, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Peso por consulta'
        }
      },
      leyenda: {
        display: false
      }
    }
  });
};

// Cargar datos cuando se monte el componente
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="p-4">
    <!-- Mostrar información del último progreso -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h2 class="text-lg font-bold">Estado Nutricional: {{ currentprogress.nutritional_state }}</h2>
        <p>Peso: {{ currentprogress.weight }} kg</p>
        <p>Altura: {{ currentprogress.height }} m</p>
        <p>Grasa: {{ currentprogress.fat_percentage }}%</p>
        <p>Musculatura: {{ currentprogress.muscular_percentage }}%</p>
      </div>
    </div>

    <!-- Gráficos de progreso -->
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
</template>
