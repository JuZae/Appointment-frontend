import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "mainStore",
  state: () => ({
    username: "", // Initial empty value
    userId: "",
  }),
  actions: {
    update(input) {
      this.username = input;
      //console.log("Username: " + this.username);
    },

    setUserId(id) {
      this.userId = id;
    },

    clear() {
      this.username = "";
    },
  },
});

export default {
  useStore,
};
