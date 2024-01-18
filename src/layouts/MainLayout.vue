<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title id="title">A-Point </q-toolbar-title>
        <q-toolbar-title id="username"
          ><div>{{ username }}</div></q-toolbar-title
        >
        <RouterLink to="/registration">
          <q-btn id="logout" @click="logout()" color="primary" no-caps
            >Logout</q-btn
          >
        </RouterLink>
      </q-toolbar>
    </q-header>

    <!-- Hier den Username vom current User displayen in der toolbar! -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import UserStore from "src/stores/user";
import AuthStore from "src/stores/authStore";

//Stores
const userStore = UserStore.useStore();
const authStore = AuthStore.useStore();

// Reactive reference for the username
const username = ref("");

const logout = () => {
  authStore.logout();
  userStore.clear();
};

// Initialize username if it's already available in the store
if (userStore.username) {
  username.value = userStore.username;
}

// Watch for changes in the user store's username
watch(
  () => userStore.username,
  (newUsername) => {
    username.value = newUsername;
  }
);
</script>

<style>
#title {
  text-align: left;
  padding: 10px;
  margin: 10px;
  width: 100%;
}

#username {
  text-align: right;
  padding: 10px;
  margin: 10px;
  width: 100%;
}

#logout {
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background: #1976d2;
}
</style>
