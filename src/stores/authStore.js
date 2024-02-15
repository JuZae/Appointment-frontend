// authStore.js
// src/stores/authStore.js
import { defineStore } from "pinia";
import { inject } from "vue";

export const useStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("userToken") || null,
    errorMessage: "",
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      localStorage.setItem("userToken", token);
      this.token = token;
    },

    setErrorMessage(message) {
      this.errorMessage = message;
    },

    clearToken() {
      localStorage.removeItem("userToken");
      this.token = null;
    },

    setUserId(userId) {
      localStorage.setItem("userId", userId);
    },

    async login(email, password, BACKEND_BASE_URL) {
      console.log("CHILD URL: " + BACKEND_BASE_URL);
      const URL_LOGIN = BACKEND_BASE_URL + "api/auth/login";
      try {
        const response = await fetch(URL_LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          const data = await response.json();
          this.setErrorMessage(data.message);
          throw new Error(data.message);
        }
        const data = await response.json();
        console.log(
          "authStore.js Response from backend: " + JSON.stringify(data)
        );
        this.setToken(data.token);
        this.setUserId(data.userId);
      } catch (error) {
        console.log(error);
      }
    },

    logout() {
      this.clearToken();
    },
  },
});

export default {
  useStore,
};
