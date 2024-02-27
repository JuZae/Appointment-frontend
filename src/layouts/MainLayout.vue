<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title id="title">A-Point </q-toolbar-title>
        <q-toolbar-title id="username"
          ><div>{{ username }}</div></q-toolbar-title
        >
        <q-btn
          @click="toggleTheme"
          icon="brightness_4"
          round
          flat
          class="q-ml-md"
        />

        <RouterLink to="/registration">
          <q-btn id="logout" @click="logout()" no-caps>Abmelden</q-btn>
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

    <div v-if="showInstallPrompt" class="install-btn q-pa-md">
      <q-btn icon="download" @click="promptInstall">Install App</q-btn>
      <q-btn icon="close" flat @click="dismissInstallPrompt"></q-btn>
    </div>

    <q-page-container>
      <q-pull-to-refresh @refresh="refreshPage">
        <router-view />
      </q-pull-to-refresh>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch, provide, computed } from "vue";
import UserStore from "src/stores/user";
import AuthStore from "src/stores/authStore";
import "src/css/app.scss";

// const BACKEND_BASE_URL = "http://49.13.170.189:8081/";
const BACKEND_BASE_URL = "https://localhost:8443/";
provide("BACKEND_BASE_URL", BACKEND_BASE_URL);

console.log("PARENT URL_BACKEND: " + BACKEND_BASE_URL);

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
  // {
  //   icon: "email",
  //   label: "Mail",
  //   to: "/mailevent",
  //   separator: true,
  // },
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
    separator: true,
  },
  {
    icon: "feedback",
    label: "Feedback",
    to: "/feedback",
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

// Assuming you have a reactive property for the theme
const theme = ref("dark"); // or 'dark' based on user preference or system settings

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
}
// Watch for changes in the user store's username
watch(
  () => userStore.username,
  (newUsername) => {
    username.value = newUsername;
  }
);

/**
 * PWA Install Button
 */
const showInstallPrompt = ref(false);
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  console.log("beforeinstallprompt event fired");

  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to show the install button
  showInstallPrompt.value = true;
});

function promptInstall() {
  console.log("Install button clicked.");

  if (deferredPrompt) {
    // Show the install prompt to the user
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      // We no longer need the prompt. Clear it up.
      deferredPrompt = null;
      showInstallPrompt.value = false;
    });
  }
}

// Call toggleTheme on mount to apply the initial theme
onMounted(() => {
  document.documentElement.setAttribute("data-theme", theme.value);
  // For testing purposes only
  setTimeout(() => {
    if (!deferredPrompt) {
      console.log("Showing install prompt button for testing.");
      showInstallPrompt.value = true;
    }
  }, 2000);
});
</script>

<style>
#title,
#username,
#logout {
  margin: 10px;
  color: var(--primary-text-color); /* Ensuring text color consistency */
}

#title,
#username {
  text-align: left;
  width: 100%;
}

#logout {
  border-radius: 5px;
  background-color: var(--accent-color);
  color: white;
  border: none; /* Removing border for a cleaner look */
}

#logout {
  background-color: var(--button-color); /* Use the custom property */
  color: var(--primary-text-color);
}

.q-header {
  background-color: var(--header-bg-color);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1); /* Adding subtle shadow */
}

.q-toolbar {
  color: white; /* For better visibility against the header background */
}

.q-btn {
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
}

.q-btn:hover {
  background-color: var(--accent-color);
  color: white;
}

.q-drawer {
  background-color: var(--secondary-bg-color);
  border-right: 1px solid #ccc; /* Adding a border for visual separation */
}

.q-item {
  color: var(--secondary-text-color);
}

.q-page-container {
  background-color: var(--primary-bg-color);
}

.q-icon {
  align-self: center;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
}

.install-btn {
  position: absolute;
  margin-left: 5%;
  align-self: center;
  right: 100px;
  bottom: 20px;
  z-index: 999;
  overflow: visible;
}
</style>
