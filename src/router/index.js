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
    const isPublicRoute =
      to.path.startsWith("/dynamic-link") ||
      ["/login", "/register"].includes(to.path);

    if (!isPublicRoute && !authStore.isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  });

  return router;
}
