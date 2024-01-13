import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "mainStore",
  // state: () => ({
  //   username: "", // Initial empty value
  //   userId: "",
  //   userMail: "",
  //   userPassword: "",
  // }),
  state: () => ({
    userId: localStorage.getItem("userId") || null,
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
      this.userId = "";
      this.userMail = "";
      this.userPassword = "";
    },

    setUserMail(mail) {
      this.mail = mail;
    },

    setUserPassword(password) {
      this.password = password;
    },
  },
});

export default {
  useStore,
};
