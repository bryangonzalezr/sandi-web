import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // PUBLIC ROUTES
    {
      path: "/auth",
      name: "auth",
      component: () => import("@/views/AuthView.vue"),

      children: [
        {
          path: "login",
          name: "Login",
          component: () => import("@/components/AuthLogin.vue"),
        },
        {
          path: "registro",
          name: "Register",
          component: () => import("@/components/AuthRegister.vue"),
        },
      ],
    },
    // PRIVATE ROUTES
    {
      path: '/',
      name: 'Patients',
      meta: { requiresAuth: true },
      component: () => import('@/views/PatientsView.vue')
    },
      
    { 
      path: '/paciente/:id', 
      name: 'PatientsShow',
      meta: { requiresAuth: true },
      props: (route) => {
        const id = route.params.id;
        return { id };
      }, 
      component: () => import('../components/PatientsShow.vue') 
    },

    {
      path: '/paciente/:id/editar',
      name: 'PatientsEdit',
      meta: { requiresAuth: true },
      props: (route) => {
        const id = route.params.id;
        return { id };
      },
      component: () => import('../components/PatientsEdit.vue')
    },

    {
      path: '/paciente/:id/consulta',
      name: 'PatientConsult',
      meta: { requiresAuth: true },
      props: (route) => {
        const id = route.params.id;
        return { id };
      },
      component: () => import('../components/PatientsConsult.vue')
    },

    {
      path : '/paciente/:id/progreso',
      name: 'PatientProgress',
      meta: { requiresAuth: true },
      props: (route) => {
        const id = route.params.id;
        return { id };
      },
      component: () => import('../components/PatientsProgress.vue')
    },
    {
      path: '/chat/paciente/:id',
      name: 'ChatPatients',
      meta: { requiresAuth: true },
      props: (route) => {
        const id = route.params.id;
        return { id };
      },
      component: () => import('@/views/ChatPatientsView.vue')
    },
    {
      path: '/lista-menus',
      name: 'ListMenus',
      meta: { requiresAuth: true },
      component: () => import('@/views/MenusView.vue')
    },
    {
      path:'/nuevo-menu',
      name: 'MenusCreate',
      meta: { requiresAuth: true },
      component: () => import('@/components/MenusCreate.vue')
    },
    {
      path:'/editar-menu/:type/:id',
      name: 'MenusEdit',
      meta: { requiresAuth: true },
      props: (route) => {
        const type = route.params.type;
        const id = route.params.id;
        return { type, id };
      },
      component: () => import('@/components/MenusEdit.vue')
    },
    {
      path:'/lista-recetas',
      name: 'ListRecipes',
      meta: { requiresAuth: true },
      component: () => import('@/views/RecipesView.vue')
    },
    {
      path: '/nueva-receta',
      name: 'RecipesCreate',
      meta: { requiresAuth: true },
      component: () => import('@/components/RecipesCreate.vue')
    },
    {
      path:'/editar-receta/:id',
      name: 'RecipesEdit',
      meta: { requiresAuth: true },
      props: (route) => {
        const id = route.params.id;
        return { id };
      },
      component: () => import('@/components/RecipesEdit.vue')
    },
    {
      path: '/planes-archivados',
      name: 'ArchivedPlans',
      meta: { requiresAuth: true },
      component: () => import('@/components/NutritionistPlanFiled.vue')
      
    }
  ]
})

router.beforeEach((to, from, next) => {

  const privateRoutes = to.matched.some((record) => record.meta.requiresAuth);

  const authStore = useAuthStore();
  const data = authStore.SessionUser();

  const loggedIn = localStorage.getItem("user");

    if (!data && privateRoutes && loggedIn) {
      localStorage.setItem("lastPath", to.fullPath);
      localStorage.removeItem("user");
      localStorage.removeItem("rolUser");
      localStorage.removeItem("roles");
      localStorage.removeItem("authToken");

      next({ name: "Login"})
    }

    // Si la ruta es privada y el usuario no esta logueado lo redirecciona a la pagina de login
    if (privateRoutes && !loggedIn) {
      next({ name: "Login" });
      return;
    }

    // Si la ruta es publica y el usuario esta logueado lo redirecciona a la pagina de inicio
    if (!privateRoutes && loggedIn) {
      next({ name: "Home" });
      return;
    }

    next();
  

});

export default router
