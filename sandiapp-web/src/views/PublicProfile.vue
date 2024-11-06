<script setup>
import { ref, onMounted } from "vue";
import { useContactCardStore } from "@/stores/contact-card.store";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import AppButton from "@/common/AppButton.vue";
import AppPagination from '@/common/AppPagination.vue';
import { storeToRefs } from "pinia";

const contactCardStore = useContactCardStore();
const {experiences, links, meta} = storeToRefs(contactCardStore)
const router = useRouter();
const loading = ref(false);
const contactCard = ref(null);

const authUser = localStorage.getItem('user');
const currentUser = JSON.parse(authUser.toString());


const loadContactCard = async () => {
  loading.value = true;
  try {
    console.log(currentUser.id)
    await contactCardStore.ShowContactCard(currentUser.id);
    contactCard.value = contactCardStore.contact_card;

    if (!contactCard.value || Object.keys(contactCard.value).length === 0) {
      contactCard.value = null;
    }
  } catch (error) {
    console.error("Error cargando perfil de contacto:", error);
    contactCard.value = null; // Asegura que se muestra el botón para crear perfil en caso de error
  }
  loading.value = false;
};

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

const goToBack = () => {
  router.push({ name: 'Profile'});
}

const goToCreateContactCard = () => {
  router.push({ name: "PublicProfileNew" });
};

const goToEditContactCard = () => {
  router.push({ name: "PublicProfileEdit"});
};

const deleteContactCard = async () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Asegúrate de cargar las experiencias si aún no están en experiences.value
      if (!experiences.value || experiences.value.length === 0) {
        await contactCardStore.IndexExperience();
      }

      // Recorre y elimina cada experiencia
      for (const exp of contactCard.value.experiences) {
        await contactCardStore.DeleteExperience(exp.id);
      }
      // Eliminar la tarjeta de contacto después de eliminar las experiencias
      await contactCardStore.DeleteContactCard(contactCard.value.id);
      contactCard.value = null;
      router.push({ name: "Profile" }); // Redirige a la página principal tras eliminar
    }
  });
};

const GetExperiences = async (page = 1) => {
  loading.value = true;
  await contactCardStore.IndexExperience(1,page)
  experiences.value = contactCardStore.GetExperiences
  links.value = contactCardStore.GetLinks
  meta.value = contactCardStore.GetMeta
  loading.value = false;
}

onMounted(() => {
  loadContactCard();
  GetExperiences();
});
</script>

<template>
  <AppButton
    class="w-fit bg-light-gray border-0 px-3 mx-6 mb-5 rounded-none rounded-b-lg"
    type="button"
    text="Volver"
    :icons="['fas', 'arrow-left']"
    @click="goToBack"
  />
  <div class="flex flex-col py-2 px-10 gap-y-5">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <div class="flex flex-row items-center gap-2">
          <font-awesome-icon class="" :icon="['fas', 'address-book']"></font-awesome-icon><h1 class="uppercase text-2xl">Perfil de Contacto</h1>
        </div>
        <h2>Tarjeta de contacto que podrán ver otros usuarios que no tienen nutricionista</h2>
      </div>
      <div class="flex gap-x-2 self-end" v-if="contactCard">
        <AppButton
          @click="goToEditContactCard"
          text="Editar Perfil"
          :icons="['fas', 'pencil']"
          class="bg-light-orange text-dark-orange border-0 p-1 hover:bg-dark-orange hover:text-light-orange h-fit"
        />
        <AppButton
            text="Eliminar Perfil"
            @click="deleteContactCard"
            :icons="['fas', 'trash-can']"
            class="bg-mid-red text-dark-red border-0 p-1 hover:bg-dark-red hover:text-mid-red h-fit"
          />
      </div>
    </div>
    <div v-if="loading" class="text-center text-gray-500">Cargando...</div>
    <div v-else>
      <div v-if="contactCard" class="flex flex-col gap-y-3">
        <div>
          <div class="px-3 py-3 bg-neutral-beige rounded-t text-left leading-4 text-black tracking-wider items-center">
            Datos Geográficos
          </div>
          <div class="bg-white w-full px-2 border-b border-b-light-gray">
            <div v-for="(field, label) in {
            'Región': contactCard.region.name,
            'Comuna': contactCard.commune_id.name,
            'Dirección': contactCard.address,
            }" :key="label" class="grid grid-cols-4 border-b last:border-b-0">
              <div class="p-2 border-r">{{ label }}</div>
              <div class="p-2 col-span-3">{{ field || 'No especificado' }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="px-3 py-3 bg-neutral-beige rounded-t text-left leading-4 text-black tracking-wider items-center">
            Datos de Presentación
          </div>
          <div class="bg-white w-full px-2 border-b border-b-light-gray">
            <div v-for="(field, label) in {
              'Eslogan': contactCard.slogan,
              'Especialidad Principal': contactCard.specialties,
              'Descripción': contactCard.description,
              }" :key="label" class="grid grid-cols-4 border-b last:border-b-0">
              <div class="p-2 border-r">{{ label }}</div>
              <div class="p-2 col-span-3">{{ field || 'No especificado' }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="px-3 py-3 bg-neutral-beige rounded-t text-left leading-4 text-black tracking-wider items-center">
            Tabla de Experiencia
          </div>
          <table class="min-w-full">
            <thead class="bg-mid-beige">
              <tr class="border-b border-b-extralight-beige">
                <th 
                  class="px-4 py-2 text-left text-sm"
                  v-for="header in ['Tipo', 'Título', 'Organización', 'Fecha de Inicio', 'Fecha de Término']"
                  :key="header"
                >{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(experience, index) in contactCard.experiences" :key="index" class="border-b border-b-extralight-beige">
                <td class="px-4 py-2 text-sm">{{ experience.type }}</td>
                <td class="px-4 py-2 text-sm">{{ experience.title }}</td>
                <td class="px-4 py-2 text-sm">{{ experience.institution }}</td>
                <td class="px-4 py-2 text-sm">{{ experience.start_date }}</td>
                <td class="px-4 py-2 text-sm">{{ experience.end_date || 'Actualidad' }}</td>
              </tr>
            </tbody>
          </table>
          <AppPagination :meta="meta" :links="links" @handlePage="GetExperiences" />
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center mt-8">
        <p class="text-black">No tienes un perfil de contacto creado.</p>
        <AppButton 
          @click="goToCreateContactCard" 
          text="Crear Perfil de Contacto" 
          :icons="['fas', 'plus']"
          class="bg-mid-green text-dark-green border-0 p-1 hover:bg-dark-green hover:text-mid-green" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-w-2xl {
  max-width: 50rem;
}
</style>