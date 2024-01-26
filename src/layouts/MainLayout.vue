<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title id="title">A-Point </q-toolbar-title>
        <q-toolbar-title id="username"
          ><div>{{ username }}</div></q-toolbar-title
        >
        <RouterLink to="/registration">
          <q-btn id="logout" @click="logout()" color="primary" no-caps
            >Abmelden</q-btn
          >
        </RouterLink>
        <q-btn icon="refresh" @click="refreshPage" />
      </q-toolbar>
    </q-header>

    <!-- Slide Menu -->
    <q-drawer show-if-above v-model="drawer" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <!-- Drawer Header -->
          <q-item-label header>Navigation</q-item-label>

          <!-- Menu Items -->
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable v-ripple :to="menuItem.to">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-pull-to-refresh @refresh="refreshPage">
        <router-view />
      </q-pull-to-refresh>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import UserStore from "src/stores/user";
import AuthStore from "src/stores/authStore";

const drawer = ref(false);

const menuList = [
  {
    icon: "home",
    label: "Home",
    to: "/",
    separator: true,
  },
  {
    icon: "dashboard",
    label: "Overview",
    to: "/overviewpage",
    separator: true,
  },
  {
    icon: "event",
    label: "Add Event",
    to: "/addevent",
    separator: false,
  },
  {
    icon: "email",
    label: "Mail",
    to: "/mailevent",
    separator: true,
  },
  {
    icon: "login",
    label: "Login",
    to: "/login",
    separator: false,
  },
  {
    icon: "person_add",
    label: "Register",
    to: "/register",
    separator: false,
  },
];

//Stores
const userStore = UserStore.useStore();
const authStore = AuthStore.useStore();

// Reactive reference for the username
const username = ref("");

const refreshPage = () => {
  // Refresh the current page
  setTimeout(() => {
    location.reload();
  }, 1000);
};

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
