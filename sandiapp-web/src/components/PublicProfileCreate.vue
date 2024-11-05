<script setup>
import { ref, onMounted, watch } from "vue";
import { useContactCardStore } from "@/stores/contact-card.store";
import { useRegionStore } from "@/stores/regions.store";
import { useRouter } from "vue-router";
import ContactCardExperience from '@/components/PublicProfileExperience.vue';
import AppPagination from '@/common/AppPagination.vue';
import AppButton from '@/common/AppButton.vue'; 
import AppSelect from "@/common/AppSelect.vue";
import AppInput from "@/common/AppInput.vue";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";

const contactCardStore = useContactCardStore();
const {experiences, links, meta} = storeToRefs(contactCardStore)
const regionStore = useRegionStore();
const router = useRouter();
const loading = ref(false);

const isExperiencePopupOpen = ref(false);

const authUser = localStorage.getItem('user');
const currentUser = JSON.parse(authUser.toString());

const regions = ref([]);
const communes = ref([]);
const selectedRegionOption = ref('');
const selectedCommuneOption = ref('');
const selectedOrdinal = ref('');

const contactCard = ref({
  nutritionist_id: currentUser.id,
  address: "",
  slogan: "",
  specialties: "",
  description: ""
});

const openExperiencePopup = () => {
  isExperiencePopupOpen.value = true;
};

const loadRegions = async () => {
  loading.value = true;
  await regionStore.RegionsList();
  regions.value = regionStore.GetRegions;

  // Verificamos que se están cargando las regiones
  console.log("Regiones cargadas:", regions.value);
  loading.value = false;
};

const loadCommunes = async (regionOrdinal) => {
  console.log("Cargando comunas para el ordinal:", regionOrdinal);
  loading.value = true;
  await regionStore.CommunesList(regionOrdinal.trim());
  communes.value = regionStore.GetCommunes;

  // Verificamos que se están cargando las comunas
  console.log("Comunidades cargadas para el ordinal", regionOrdinal, ":", communes.value);
  loading.value = false;
};

const handleRegionChange = (selected) => {
  // Encuentra la región seleccionada usando el ordinal
  const selectedRegion = regions.value.data.find(region => region.ordinal === selected.value);
  if (selectedRegion) {
    selectedOrdinal.value = selectedRegion.ordinal;
    loadCommunes(selectedRegion.ordinal);
  } else {
    selectedOrdinal.value = '';
    communes.value = { data: [] };
  }
  selectedCommuneOption.value = "";
};

const GetExperiences = async (page = 1) => {
  loading.value = true;
  await contactCardStore.IndexExperience(1,page)
  experiences.value = contactCardStore.GetExperiences
  links.value = contactCardStore.GetLinks
  meta.value = contactCardStore.GetMeta
  loading.value = false;
}

const EliminateExperience = async (id) => {
  try{
    Swal.fire({
        title: "¿Segur@ que quieres eliminar esta experiencia?",
        showDenyButton: true,
        confirmButtonText: "Si",
        confirmButtonColor: "#76A95C",
        denyButtonText: `No`,
        denyButtonColor: "#DE3E3E",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await contactCardStore.DeleteExperience(id);
          await GetExperiences();
        }
      });
    
  } catch (error) {
    errorsForm.value = error.response.data.errors;
  }
};

const saveContactCard = async () => {
  loading.value = true;
  console.log(contactCard.value);
  await contactCardStore.CreateContactCard(contactCard.value);
  loading.value = false;
  await contactCardStore.ShowContactCard(currentUser.id);
  console.log(contactCard.value);
  goProfile();
};

const goBack = () => {
  router.back();
};

const goExp = () => {
  openExperiencePopup();
};

const goProfile = () => {
  router.push({name: 'PublicProfile'});
};

const closeExperiencePopup = () => {
  isExperiencePopupOpen.value = false;
  GetExperiences();
};

const setValue = (value) => {
  contactCard.value[value] = Number(event.target.value);
};

onMounted(() => {
  loading.value = true;
  GetExperiences();
  loadRegions();
  loading.value = false;
});

watch(selectedRegionOption, (selectedCommuneOption) => {selectedCommuneOption = "";})

</script>

<template>
  <div class="max-w mx-auto p-5">
    <div class="mb-8 text-left">
      <button @click="goBack" class="text-lg text-gray-800 mb-4">&larr; Volver</button>
      <h1 class="text-2xl font-bold uppercase">Crear Panel Publicitario</h1>
      <p class="text-gray-500 text-sm mt-1">
        Este panel servirá para que usuarios sin nutricionista puedan conocerte y contactarte
      </p>
    </div>

    <form @submit.prevent="saveContactCard" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block font-semibold text-gray-700 mb-2">Región</label>
          <AppSelect
            :options="regions.data"
            v-model:selectedOption="selectedRegionOption"
            value="ordinal"
            optionText="name"
            placeholder="Seleccione una región"
            @update:selectedOption="handleRegionChange"
            class="w-full bg-gray-100 rounded py-2"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-2">Comuna</label>
          <AppSelect
            :options="communes"
            value="id"
            optionText="commune"
            placeholder="Seleccione una comuna"
            :disabled="!selectedOrdinal"
            class="w-full bg-gray-100 rounded py-2"
            @update:selectedOption="setValue('commune_id')"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-2">Eslogan</label>
          <AppInput
            v-model="contactCard.slogan"
            type="text" 
            class="w-full bg-gray-100 rounded py-2"
            placeholder="Escribe tu slogan"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-2">Especialidad Principal</label>
          <AppInput
            v-model="contactCard.specialties"
            type="text" 
            class="w-full bg-gray-100 rounded py-2"
            placeholder="Escribe tu especialidad"
          />
        </div>
      </div>

      <div>
        <label class="block font-semibold text-gray-700 mb-2">Dirección</label>
        <AppInput
            v-model="contactCard.address"
            type="text" 
            class="w-full bg-gray-100 rounded py-2"
            placeholder="Direccion..."
          />
      </div>

      <div>
        <label class="block font-semibold text-gray-700 mb-2">Descripción</label>
        <textarea 
          v-model="contactCard.description" 
          class="w-full bg-gray-100 border border-light-gray rounded px-3 py-2 h-24"
          placeholder="Descripción..."
        ></textarea>
      </div>

      <div class="mt-6">
          <h2 class="text-lg font-bold text-gray-800">Experiencia</h2>
          <!-- Tabla de experiencias -->
          <div class="overflow-x-auto mt-4">
            <table class="min-w-full border border-light-gray">
              <thead class="bg-white">
                <tr>
                  <th class="px-4 py-2 border-b border-light-gray text-left text-sm font-semibold text-black">Tipo</th>
                  <th class="px-4 py-2 border-b border-light-gray text-left text-sm font-semibold text-black">Título</th>
                  <th class="px-4 py-2 border-b border-light-gray text-left text-sm font-semibold text-black">Organización</th>
                  <th class="px-4 py-2 border-b border-light-gray text-left text-sm font-semibold text-black">Fecha de Inicio</th>
                  <th class="px-4 py-2 border-b border-light-gray text-left text-sm font-semibold text-black">Fecha de Término</th>
                  <th class="px-4 py-2 border-b border-light-gray text-left text-sm font-semibold text-black">Borrar Experiencia</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(experience, index) in contactCard.experiences" :key="index" class="border-b">
                  <td class="px-4 py-2 text-sm text-black">{{ experience.type }}</td>
                  <td class="px-4 py-2 text-sm text-black">{{ experience.title }}</td>
                  <td class="px-4 py-2 text-sm text-black">{{ experience.institution }}</td>
                  <td class="px-4 py-2 text-sm text-black">{{ experience.start_date }}</td>
                  <td class="px-4 py-2 text-sm text-black">{{ experience.end_date || 'Actualidad' }}</td>
                  <td class="px-4 py-2">
                    <AppButton
                    class="bg-mid-red text-dark-red border-0 p-1"
                    type="button"
                    text="Eliminar"
                    :icons="['fas', 'x']"
                    @click="EliminateExperience(experience.id)"
                  /></td>
                </tr>
              </tbody>
            </table>
            <AppPagination :meta="meta" :links="links" @handlePage="GetExperiences" />
          </div>
        </div>

      <div>
        <AppButton 
          @click="goExp" 
          type="button" 
          class="text-black bg-light-violet text-sm font-medium hover:underline"
          text="+ Añadir Experiencia"
        />
      </div>

      <div v-if="isExperiencePopupOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <ContactCardExperience @close="closeExperiencePopup"/>
        </div>
      </div>

      <div class="flex space-x-4 mt-8">
        <AppButton
          text="Guardar"
          type="submit"
          class="bg-neutral-green text-white px-4 py-2 rounded hover:bg-light-green"
        />
        <AppButton
          text="Cancelar"
          type="button"
          class="bg-mid-red text-white px-4 py-2 rounded hover:bg-light-red"
          @click="goBack"
        />
      </div>
    </form>
  </div>
</template>

