import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "mainStore",
  state: () => ({
    username: "", // Initial empty value
  }),
  actions: {
    update(input) {
      this.username = input;
      //console.log("Username: " + this.username);
    },

    clear() {
      this.username = "";
    },
  },
});

export default {
  useStore,
};
