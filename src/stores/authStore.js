// authStore.js
// src/stores/authStore.js
import { defineStore } from "pinia";
import UserStore from "/src/stores/user.js";
import user from "./user";

export const useStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("userToken") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      localStorage.setItem("userToken", token);
      this.token = token;
    },

    clearToken() {
      localStorage.removeItem("userToken");
      this.token = null;
    },

    setUserId(userId) {
      localStorage.setItem("userId", userId);
    },

    async login(email, password) {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      console.log(
        "authStore.js Response from backend: " + JSON.stringify(data)
      );
      this.setToken(data.token);
      this.setUserId(data.userId);
      this.setUserId(data.userId);
    },

    logout() {
      this.clearToken();
    },
  },
});

export default {
  useStore,
};
