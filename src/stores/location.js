import { defineStore } from "pinia";

const useStore = defineStore("location", {
  state: () => ({
    location: "",
    options: ["A", "B"],
  }),
  getters: {
    location2: (state) => state.location,
  },
  actions: {
    update(inLoc) {
      console.log(inLoc);
      // console.log("Marke1");

      this.location = inLoc;
      this.options = [""];
    },
  },
});

export default {
  useStore,
};
