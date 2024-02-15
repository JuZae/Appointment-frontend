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
          {{ errorMessage }}
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Close" v-close-popup @click="closeDialog" />
          <q-btn
            flat
            label="Resend Verification Email"
            @click="resendVerificationEmail"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, inject } from "vue";
import { useRouter } from "vue-router";
import AuthStore from "src/stores/authStore";
import UserStore from "src/stores/user";

//Router
const router = useRouter();

const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

//Stores
const authStore = AuthStore.useStore();
const userStore = UserStore.useStore();

/**
 * Error handling after failed login attempt
 */
//Error message from the auth store
const errorMessage = ref("");
//Dialog visibility
const isDialogOpen = ref(false);
// Watch for changes in the error message from the auth store
watch(
  () => authStore.errorMessage,
  (newMessage) => {
    errorMessage.value = newMessage;
    isDialogOpen.value = !!newMessage;
  }
);

const showSuccessMessage = (message) => {
  errorMessage.value = message;
  isDialogOpen.value = true;
};

const showErrorMessage = (message) => {
  errorMessage.value = message;
  isDialogOpen.value = true;
};

//APIs
// const API_GETUSERBYID = "http://localhost:8080/api/user/get/";
const API_GETUSERBYID = BACKEND_BASE_URL + "api/user/get/";

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
    await authStore.login(
      loginDTO.value.email,
      loginDTO.value.password,
      BACKEND_BASE_URL
    );

    if (authStore.isAuthenticated) {
      getUser(localStorage.getItem("userId"));
    }
    router.push("/overviewpage");
  } catch (error) {
    console.error("Login error:", error);
  }
};

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
  console.log("BACKENDAPIURL: " + BACKEND_BASE_URL);

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const userData = await response.json();
    // console.log("User data received:", userData);

    userStore.saveUserInfo(userData.username, userData.email);
    userStore.setUserId(userData.id);
    localStorage.setItem("userId", userData.id);

    // Here, you can update the user store with the received data
    // For example: userStore.update(userData.username);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const resendVerificationEmail = async () => {
  // Assuming you have the user's email available, possibly from the login form
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}api/auth/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginDTO.value.email }), // Adjust according to your data structure
      }
    );
    const data = await response.json(); // Assuming the backend sends a JSON response

    if (response.ok) {
      // Handle success
      console.log("Verification email resent. Please check your inbox.");
      // Close the current dialog if open
      isDialogOpen.value = false;
      // Show a success message to the user
      showSuccessMessage(
        data.message ||
          "Verification email resent successfully. Please check your inbox."
      );
    } else {
      // Handle failure
      console.error("Failed to resend verification email.");
      // Show an error message
      showErrorMessage(
        data.message ||
          "Failed to resend verification email. Please try again later."
      );
    }
  } catch (error) {
    console.error("Error resending verification email:", error);
    showErrorMessage(
      "An error occurred while trying to resend the verification email. Please try again later."
    );
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

// Reset the error message when the dialog is closed
const closeDialog = () => {
  authStore.setErrorMessage(""); // Reset the error message in the store
  isDialogOpen.value = false;
};
</script>

<style></style>
