import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { useStore } from "src/stores/authStore.js"; // Import your auth store
import routes from "src/router/routes.js";

export default function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const router = createRouter({
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes,
  });
  router.beforeEach((to, from, next) => {
    const authStore = useStore();

    if (
      (to.path === "/login" || to.path === "/register") &&
      authStore.isAuthenticated
    ) {
      // If authenticated and trying to access login or register, redirect to home/dashboard
      next("/"); // Replace '/' with your home or dashboard path
    } else if (
      to.path !== "/login" &&
      to.path !== "/register" &&
      !authStore.isAuthenticated
    ) {
      // If not authenticated and trying to access a non-login/register page, redirect to login
      next("/login");
    } else {
      // Otherwise, proceed as normal
      next();
    }
  });

  return router;
}
