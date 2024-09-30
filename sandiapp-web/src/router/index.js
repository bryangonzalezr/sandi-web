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
      component: () => import('../views/PatientsView.vue')
    },
    {
      path: '/about',
      name: 'About',
      meta: { requiresAuth: true },
      component: () => import('../views/AboutView.vue')
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
