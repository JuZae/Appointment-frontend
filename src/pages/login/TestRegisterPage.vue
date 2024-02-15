<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-form @submit.prevent="onSubmitRegister" @reset="onReset">
          <q-input
            v-model="register.username"
            label="Username"
            :rules="[(val) => !!val || 'Username is required']"
          />
          <q-input v-model="register.email" label="Email" :rules="emailRules" />
          <q-input
            v-model="register.password"
            type="password"
            label="Password"
            :rules="passwordRules"
          />
          <div>
            <q-btn
              label="Register"
              type="submit"
              color="primary"
              :disable="!isFormValid"
            />
            <q-btn
              label="Back to Login"
              color="primary"
              flat
              @click="goToLogin"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section class="row items-center justify-between">
          <div
            class="text-h6"
            :class="{
              'text-green': dialogType === 'success',
              'text-red': dialogType === 'error',
            }"
          >
            {{ dialogMessage }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

// Dialog state
const isDialogOpen = ref(false);
const dialogMessage = ref("");
const dialogType = ref(""); // 'success' or 'error'

// Computed property to check if the form is valid
const isFormValid = computed(() => {
  const isEmailValid = emailRules.every(
    (rule) => rule(register.value.email) === true
  );
  const isPasswordValid = passwordRules.every(
    (rule) => rule(register.value.password) === true
  );
  return register.value.username && isEmailValid && isPasswordValid;
});

// Registration Request Object
const register = ref({
  username: "",
  email: "",
  password: "",
});

const emailRules = [
  (val) => !!val || "Email is required",
  (val) => /.+@.+\..+/.test(val) || "Email must be valid",
];

const passwordRules = [
  (val) => !!val || "Password is required",
  (val) => val.length >= 8 || "Password must be at least 8 characters",
];

const registerUser = async () => {
  const URL_REGISTER = BACKEND_BASE_URL + "api/auth/register";
  try {
    const response = await fetch(URL_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: register.value.username,
        email: register.value.email,
        password: register.value.password,
      }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`Registration failed: ${responseData.message}`);
    }

    console.log("Registration successful", responseData.message);
    // Display success message and navigate to login page
    displayMessage("Registration successful. Please log in.", "success");

    localStorage.setItem("userId", data.userId);

    // Wait for 3 seconds before navigating to login page
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (error) {
    console.error("Registration error:", error);
    // Display error message
    displayMessage(error.message, "error");
  }
};

// Function to display messages in a dialog
const displayMessage = (message, type) => {
  dialogMessage.value = message;
  dialogType.value = type;
  isDialogOpen.value = true;
};

// Function to close the dialog
const closeDialog = () => {
  isDialogOpen.value = false;
};

const onSubmitRegister = () => {
  // console.log("Registration data:", register.value);
  registerUser();
};

const onReset = () => {
  register.value.username = "";
  register.value.email = "";
  register.value.password = "";
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style>
.text-green {
  color: green;
}

.text-red {
  color: red;
}
</style>
