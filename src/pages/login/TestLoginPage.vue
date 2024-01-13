<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-form
          @submit.prevent="login"
          @reset="onReset"
          v-on:keyup.enter="goToOverview"
        >
          <q-input v-model="loginDTO.email" label="Email" :rules="emailRules" />
          <q-input
            v-model="loginDTO.password"
            type="password"
            label="Password"
            :rules="passwordRules"
          />
          <div>
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              @click="goToOverview"
            />
            <q-btn
              label="Register"
              color="primary"
              flat
              @click="goToRegister"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Schließen" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthStore from "src/stores/authStore";
import UserStore from "src/stores/user";
import MainLayout from "src/layouts/MainLayout.vue";
import { data } from "autoprefixer";

//Router
const router = useRouter();

//Stores
const authStore = AuthStore.useStore();
const userStore = UserStore.useStore();

//Login status
// const status = false;

//Dialog open with message after Login attempt
const isDialogOpen = ref(false);
const message = ref("");

//APIs
// const API_LOGIN = "http://localhost:8080/api/auth/login";
// const API_GETUSERBYEMAIL = "http://localhost:8080/api/user/getOne/";
const API_GETUSERBYID = "http://localhost:8080/api/user/get/";

//LoginDTO that is sent to backend
const loginDTO = ref({
  email: "",
  password: "",
});

//Rules
const emailRules = [
  (val) => !!val || "Email is required",
  (val) => /.+@.+\..+/.test(val) || "Email must be valid",
];
const passwordRules = [(val) => !!val || "Password is required"];

const login = async () => {
  try {
    await authStore.login(loginDTO.value.email, loginDTO.value.password);

    if (authStore.isAuthenticated) {
      getUser(localStorage.getItem("userId"));
    }
    router.push("/overviewpage");
  } catch (error) {
    console.error("Login error:", error);
  }
};

// const onSubmitLogin = async () => {
//   try {
//     const response = await fetch(API_LOGIN, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(login.value),
//     });

//     if (!response.ok) {
//       throw new Error("Login failed");
//     }

//     const data = await response.json();

//     //get auth status and check if user is authenticated
//     authStore.setAuthStatus(data.status);
//     if (authStore.isAuthenticated) {
//       //get user info from backend
//       getUser(login.value.email);
//     }

//TODO: MAKE THIS A POP UP!
//     console.log("MESSAGE:" + data.message);
//     checkMessageAndOpenDialog(data);
//   } catch (error) {
//     console.error("Login error:", error);
//   }
// };

//get user info by email
const getUser = async (userId) => {
  const jwtToken = authStore.token; // JWT Token (if exists)
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const URL = API_GETUSERBYID + userId;
  console.log("GETUSERURL " + URL);

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const userData = await response.json();
    console.log("User data received:", userData);

    userStore.saveUserInfo(userData.username, userData.email);

    // Here, you can update the user store with the received data
    // For example: userStore.update(userData.username);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Check for Message and open Dialog
const checkMessageAndOpenDialog = (data) => {
  if (data.message && data.message.trim() !== "") {
    message.value = data.message;
    isDialogOpen.value = true;
  }
};

//Reset Email and Password input fields
const onReset = () => {
  login.value.email = "";
  login.value.password = "";
};

/**
 * Routing stuff
 */

//Reroute to /overviewpage on Enter key press
const goToEnter = () => {
  console.log("!!!WORKS!!!");
  router.push("/overviewpage");
};

//Reroute to /overviewpage when called
const goToOverview = () => {
  router.push("/overviewpage");
};

//Reroute to /register when called
const goToRegister = () => {
  router.push("/register");
};
</script>

<style></style>
