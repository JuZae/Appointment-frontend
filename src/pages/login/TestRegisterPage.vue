<template>
  <q-page class="register-page">
    <q-card class="register-card">
      <q-card-section>
        <q-form @submit.prevent="onSubmitRegister" @reset="onReset">
          <q-input
            v-model="register.username"
            label="Username"
            :rules="[(val) => !!val || 'Username is required']"
            class="custom-q-input"
          />
          <q-input
            v-model="register.email"
            label="Email"
            :rules="emailRules"
            class="custom-q-input"
          />
          <q-input
            v-model="register.password"
            type="password"
            label="Password"
            :rules="passwordRules"
            class="custom-q-input"
          />
          <div class="q-gutter-md">
            <q-btn label="Register" type="submit" :disable="!isFormValid" />
            <q-btn label="Back to Login" flat @click="goToLogin" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isDialogOpen">
      <q-card class="my-dialog-card">
        <q-card-section class="text-center">
          <div class="dialog-message">
            {{ dialogMessage }}
          </div>
        </q-card-section>
        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat label="Close" @click="closeDialog" />
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
    displayMessage(
      "Registration successful. Please check you E-Mail to verify your account.",
      "success"
    );

    localStorage.setItem("userId", responseData.userId);

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
/* .text-green {
  color: green;
}

.text-red {
  color: red;
} */

/**
* Page and Card
*/
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

.register-card {
  width: 100%;
  max-width: 400px;
  background-color: var(--secondary-bg-color);
}

.full-width {
  width: 100%;
}

/**
* Custom input field
*/
.custom-q-input .q-field__control {
  background-color: var(--secondary-bg-color); /* bg-color */
  color: var(--accent-color);
}

.custom-q-input .q-field__label {
  color: var(--accent-color); /* label-color */
}

.custom-q-input .q-field--focused .q-field__control {
  border-color: var(
    --accent-color
  ); /* You might want to adjust the border color on focus to match the accent color */
}

.custom-q-input .q-field--focused .q-field__label {
  color: var(--accent-color);
}

.custom-q-input .q-field__native {
  color: var(--primary-text-color); /* Set text color for input */
}

.custom-q-input .q-field__native::placeholder {
  color: var(--primary-text-color); /* Lighter color for placeholder text */
}

/**
* Custom dialog card
*/
.my-dialog-card {
  background-color: var(--secondary-bg-color);
  color: var(--primary-text-color);
}

.dialog-message {
  color: var(--primary-text-color);
}

.dialog-actions {
  color: var(--button-text-color);
}

/* Optionally, if you want to specifically style the flat buttons */
.dialog-actions {
  color: var(--accent-color);
}
</style>
