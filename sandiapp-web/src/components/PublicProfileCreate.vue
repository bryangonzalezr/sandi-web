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

const authUser = localStorage.getItem('user');
const currentUser = JSON.parse(authUser.toString());

const regions = ref([]);
const communes = ref([]);
const selectedRegionOption = ref('');
const selectedCommuneOption = ref('');
const selectedOrdinal = ref('');
const loading = ref(false);
const loadingExperience = ref(false);
const isExperiencePopupOpen = ref(false);

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

  await regionStore.RegionsList();
  regions.value = regionStore.GetRegions;
  loading.value = false;
};

const loadCommunes = async (regionOrdinal) => {
  await regionStore.CommunesList(regionOrdinal.trim());
  communes.value = regionStore.GetCommunes;
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
  loadingExperience.value = true;
  await contactCardStore.IndexExperience(1,page).finally(() => {
    loadingExperience.value = false;
  })
  
}

const EliminateExperience = async (id) => {
  try{
    Swal.fire({
        title: "¿Segur@ que quieres eliminar esta experiencia?",
        showDenyButton: true,
        confirmButtonText: "Si",
        confirmButtonColor: "#B8D0A7",
        denyButtonText: `No`,
        denyButtonColor: "#EC9B98",
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
  await contactCardStore.CreateContactCard(contactCard.value).then(async () => {
    await contactCardStore.ShowContactCard(currentUser.id).then(() => {
      goProfile();
    })
  });

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
});

watch(selectedRegionOption, (selectedCommuneOption) => {selectedCommuneOption = "";})

</script>

<template>
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="text-left">
      <div class="flex flex-row items-center gap-2">
        <font-awesome-icon class="" :icon="['fas','address-card']"></font-awesome-icon><h1 class="uppercase text-2xl">Crear Trajeta de contacto</h1>
      </div>
      <p class="text-sm">
        Esta tarjeta servirá para que usuarios sin nutricionista puedan conocerte y contactarte
      </p>
    </div>

    <form @submit.prevent="saveContactCard" class="flex flex-col gap-y-2">
      <div class="flex justify-center items-center" v-if="loading">
        <div class="animate-spin w-8 h-8 border-4 border-t-mid-green border-b-mid-red border-l-light-violet border-r-light-orange rounded-full"></div>
        <span class="visually-hidden">  Cargando...</span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3" v-else>
        <div class="lg:col-span-2 lg:grid lg:grid-cols-4 lg:gap-x-2 gap-y-2 flex flex-col">
            <AppSelect
            :options="regions.data"
            label="Región"
            v-model:selectedOption="selectedRegionOption"
            value="ordinal"
            optionText="name"
            placeholder="Seleccione una región"
            @update:selectedOption="handleRegionChange"
            class="w-full rounded"
          />
          <AppSelect
            :options="communes"
            label="Comuna"
            value="id"
            optionText="commune"
            placeholder="Seleccione una comuna"
            :disabled="!selectedOrdinal"
            class="w-full rounded"
            @update:selectedOption="setValue('commune_id')"
          />
          <div class="lg:col-span-2">
            <AppInput
              v-model="contactCard.address"
              label="Dirección"
              type="text" 
              class="w-full rounded"
              placeholder="Direccion..."
            />
          </div>
        </div>
        <AppInput
            v-model="contactCard.slogan"
            label="Eslogan"
            type="text" 
            class="w-full rounded"
            placeholder="Escribe tu slogan"
          />
          <AppInput
            v-model="contactCard.specialties"
            label="Especialidad Principal"
            type="text" 
            class="w-full rounded"
            placeholder="Escribe tu especialidad"
          />
      </div>
      <div class="flex flex-col gap-y-2 py-3">
        <label class="">Descripción</label>
        <textarea 
          v-model="contactCard.description" 
          class="w-full border border-light-gray rounded px-3 py-2 h-24"
          placeholder="Descripción..."
          maxlength="200"
        ></textarea>
      </div>

      <div class="flex flex-col gap-y-1">
        <div class="flex gap-3">
            <h2 class="text-lg font-bold text-gray-800">Experiencia</h2>
            <AppButton 
              @click="goExp" 
              type="button" 
              :icons="['fas', 'plus']"
              class="text-dark-violet bg-light-violet border-0 hover:bg-dark-violet hover:text-light-violet h-fit"
              text="Añadir Experiencia"
            />
          </div>
          <!-- Tabla de experiencias -->
          <div class="overflow-x-auto mt-2">
            <table class="min-w-full border border-light-gray">
              <thead class="bg-mid-beige">
                <tr class="border-b border-b-extralight-beige">
                  <th class="px-4 py-2 text-left text-sm">Tipo</th>
                  <th class="px-4 py-2 text-left text-sm">Título</th>
                  <th class="px-4 py-2 text-left text-sm">Organización</th>
                  <th class="px-4 py-2 text-left text-sm">Fecha de Inicio</th>
                  <th class="px-4 py-2 text-left text-sm">Fecha de Término</th>
                  <th class="px-4 py-2 text-left text-sm">Borrar Experiencia</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingExperience">
                  <td class="flex justify-center items-center" colspan="6">
                    <div class="animate-spin w-8 h-8 border-4 border-t-mid-green border-b-mid-red border-l-light-violet border-r-light-orange rounded-full"></div>
                    <span class="visually-hidden">  Cargando...</span>
                  </td>
                </tr>
                <template v-else>
                  <tr v-for="(experience, index) in experiences" :key="index" class="border-b border-b-extralight-beige">
                    <td class="px-4 py-2 text-sm">{{ experience.type }}</td>
                    <td class="px-4 py-2 text-sm">{{ experience.title }}</td>
                    <td class="px-4 py-2 text-sm">{{ experience.institution }}</td>
                    <td class="px-4 py-2 text-sm">{{ experience.start_date }}</td>
                    <td class="px-4 py-2 text-sm">{{ experience.end_date || 'Actualidad' }}</td>
                    <td class="px-4 py-2">
                      <AppButton
                      class="bg-mid-red text-dark-red border-0 hover:bg-mid-red hover:text-dark-red"
                      type="button"
                      text="Eliminar"
                      :icons="['fas', 'xmark']"
                      @click="EliminateExperience(experience.id)"
                    /></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <AppPagination :meta="meta" :links="links" @handlePage="GetExperiences" />
        </div>

      <div v-if="isExperiencePopupOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <ContactCardExperience @close="closeExperiencePopup"/>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <AppButton
          text="Guardar"
          type="submit"
          :icons="['fas', 'floppy-disk']"
          class="bg-mid-green text-dark-green border-0 hover:bg-dark-green hover:text-mid-green h-fit"
        />
        <AppButton
          text="Cancelar"
          type="button"
          :icons="['fas', 'circle-xmark']"
          class="bg-mid-red text-dark-red border-0 hover:bg-dark-red hover:text-mid-red h-fit"
          @click="goBack"
        />
      </div>
    </form>
  </div>
</template>

