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
      router.push({ name: "Patients" }); // Redirige a la página principal tras eliminar
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
  <div class="max-w-2xl mx-auto p-6">
    <div v-if="loading" class="text-center text-gray-500">Cargando...</div>
    <div v-else>
      <h1 class="text-3xl font-bold uppercase text-center mb-6">Perfil Público de Contacto</h1>

      <div v-if="contactCard" class="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div class="border-b pb-4">
          <p class="text-lg font-semibold text-gray-800">Región</p>
          <p class="text-gray-600">{{ contactCard.region.name }}</p>
        </div>
        
        <div class="border-b pb-4">
          <p class="text-lg font-semibold text-gray-800">Comuna</p>
          <p class="text-gray-600">{{ contactCard.commune_id.name }}</p>
        </div>
        
        <div class="border-b pb-4">
          <p class="text-lg font-semibold text-gray-800">Dirección</p>
          <p class="text-gray-600">{{ contactCard.address }}</p>
        </div>
        
        <div class="border-b pb-4">
          <p class="text-lg font-semibold text-gray-800">Eslogan</p>
          <p class="text-gray-600">{{ contactCard.slogan }}</p>
        </div>
        
        <div class="border-b pb-4">
          <p class="text-lg font-semibold text-gray-800">Especialidad Principal</p>
          <p class="text-gray-600">{{ contactCard.specialties }}</p>
        </div>
        
        <div>
          <p class="text-lg font-semibold text-gray-800">Descripción</p>
          <p class="text-gray-600">{{ contactCard.description }}</p>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-bold text-gray-800">Experiencia</h2>
          <!-- Tabla de experiencias -->
          <div class="overflow-x-auto mt-4">
            <table class="min-w-full border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-800">Tipo</th>
                  <th class="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-800">Título</th>
                  <th class="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-800">Organización</th>
                  <th class="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-800">Fecha de Inicio</th>
                  <th class="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-800">Fecha de Término</th>
                  <th class="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-800">Borrar Experiencia</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(experience, index) in contactCard.experiences" :key="index" class="border-b">
                  <td class="px-4 py-2 text-sm text-gray-800">{{ experience.type }}</td>
                  <td class="px-4 py-2 text-sm text-gray-800">{{ experience.title }}</td>
                  <td class="px-4 py-2 text-sm text-gray-800">{{ experience.institution }}</td>
                  <td class="px-4 py-2 text-sm text-gray-800">{{ experience.start_date }}</td>
                  <td class="px-4 py-2 text-sm text-gray-800">{{ experience.end_date || 'Actualidad' }}</td>
                  <td class="px-4 py-2"><AppButton
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

        <AppButton
          @click="goToEditContactCard"
          text="Editar Perfil"
          class="bg-mid-green text-white px-4 py-2 rounded hover:bg-light-green"
        />

        <AppButton
            text="Eliminar Perfil"
            @click="deleteContactCard"
            class="bg-mid-red text-white px-4 py-2 rounded hover:bg-light-red"
          />
      </div>

      <div v-else class="flex flex-col items-center justify-center mt-8">
        <p class="text-black">No tienes un perfil de contacto creado.</p>
        <AppButton 
          @click="goToCreateContactCard" 
          text="Crear Perfil de Contacto" 
          class="bg-neutral-green text-white px-6 py-2 mt-4 rounded hover:bg-light-green" 
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