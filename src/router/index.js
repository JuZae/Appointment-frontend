// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import AuthStore from "src/stores/authStore";

export default function () {
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });

  router.beforeEach((to, from, next) => {
    const authStore = AuthStore.useStore();
    const publicRoutes = ["/login", "/register", "/dynamic-link"];
    const authRequired = !publicRoutes.includes(to.path);

    if (authRequired && !authStore.isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  });

  return router;
}
