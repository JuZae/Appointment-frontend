<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title id="title">A-Point </q-toolbar-title>
        <q-toolbar-title id="username"> {{ status }} </q-toolbar-title>
        <q-toolbar-title id="username"> {{ username }} </q-toolbar-title>
        <RouterLink to="/registration">
          <q-btn id="logout" @click="logout()" color="primary" no-caps
            >Abmelden</q-btn
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
import { storeToRefs } from "pinia";
import UserStore from "src/stores/user";
import AuthStore from "src/stores/authStore";
import router from "src/router";
import { onMounted } from "vue";

const $my_usern = UserStore.useStore();
const authStore = AuthStore.useStore();
const { username } = storeToRefs($my_usern);
const { status } = storeToRefs(authStore);

const logout = () => {
  authStore.logout();
  $my_usern.clear();
};
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
