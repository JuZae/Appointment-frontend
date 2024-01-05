// authStore.js
import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "auth",
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    setAuthStatus(status) {
      this.isAuthenticated = status;
    },
    logout() {
      this.isAuthenticated = false;
      // Perform any other logout logic here
    },
  },
});

export default {
  useStore,
};
