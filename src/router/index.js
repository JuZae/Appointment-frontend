import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { useStore } from "src/stores/authStore.js"; // Import your auth store
import routes from "src/router/routes.js";
import { useRouter } from "vue-router";

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

  router.beforeEach(async (to, from, next) => {
    const authStore = useStore();
    const isAuthenticated = authStore.isAuthenticated;

    // Array of public routes
    const publicRoutes = ["/login", "/register", "/dynamic-link"];

    if (
      publicRoutes.some((route) => to.path.startsWith(route)) ||
      isAuthenticated
    ) {
      // If the route starts with any public route or the user is authenticated, allow access
      next();
    } else {
      // If the route is not public and the user is not authenticated, redirect to login
      next("/login");
    }
  });

  return router;
}
