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
    username: localStorage.getItem("username") || null,
    userMail: localStorage.getItem("userMail") || null,
  }),
  actions: {
    update(input) {
      this.username = input;
      //console.log("Username: " + this.username);
    },

    getUsername() {
      return this.username;
    },

    saveUserInfo(username, userMail) {
      localStorage.setItem("username", username);
      localStorage.setItem("userMail", userMail);
      this.username = localStorage.getItem("username");
      this.userMail = localStorage.getItem("userMail");
    },

    setUserId() {
      this.userId = localStorage.getItem("userId");
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
