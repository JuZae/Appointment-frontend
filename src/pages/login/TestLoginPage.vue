<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-form
          @submit.prevent="onSubmitLogin"
          @reset="onReset"
          v-on:keyup.enter="goToOverview"
        >
          <q-input v-model="login.email" label="Email" :rules="emailRules" />
          <q-input
            v-model="login.password"
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
import { storeToRefs } from "pinia";
import AuthStore from "src/stores/authStore";
import UserStore from "src/stores/user";

//Router
const router = useRouter();

//Stores
const authStore = AuthStore.useStore();
const userStore = UserStore.useStore();

//Login status
const status = false;

//Dialog open with message after Login attempt
const isDialogOpen = ref(false);
const message = ref("");

//APIs
const API_LOGIN = "http://localhost:8080/api/auth/login";
const API_GETUSERBYMAIL = "http://localhost:8080/api/user/getOne/";

//LoginDTO that is sent to backend
const login = ref({
  email: "",
  password: "",
});

//Rules
const emailRules = [
  (val) => !!val || "Email is required",
  (val) => /.+@.+\..+/.test(val) || "Email must be valid",
];
const passwordRules = [(val) => !!val || "Password is required"];

const onSubmitLogin = async () => {
  try {
    const response = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login.value),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    //get auth status and check if user is authenticated
    authStore.setAuthStatus(data.status);
    if (authStore.isAuthenticated) {
      //get user info from backend
      getUser(login.value.email);
    }

    //TODO: MAKE THIS A POP UP!
    console.log("MESSAGE:" + data.message);
    checkMessageAndOpenDialog(data);
  } catch (error) {
    console.error("Login error:", error);
  }
};

//get user info by email
const getUser = async (email) => {
  console.log("USERNAME PARAM" + email);
  const URL = API_GETUSERBYMAIL + email;
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    console.log("DATARETURN " + JSON.stringify(data));

    console.log("USERNAMERETURN " + data.username);
    userStore.update(data.username);

    console.log("USERIDRETURN " + data.id);
    userStore.setUserId(data.id);
  } catch (error) {
    console.error("Login error:", error);
  }
};

//Check for Message and open Dialog
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

<!-- <style>
/* General Styles */
body,
html {
  height: 100%;
  margin: 0;
  font-family: "Arial", sans-serif;
  background-color: #1a1a1a; /* JetBrains dark background */
  color: #a9b7c6; /* JetBrains text color */
}

/* Page Layout */
.q-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Card Styles */
.q-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #2b2b2b; /* JetBrains card background */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Form Styles */
.q-form {
  display: flex;
  flex-direction: column;
}

.q-input,
.q-btn {
  margin-bottom: 15px;
  border-color: #3c3f41; /* JetBrains input border */
}

.q-input {
  /* background-color: #2b2b2b; */
  color: #a9b7c6;
}

/* Input focus color */
.q-input:focus {
  border-color: #6897bb; /* JetBrains focus color */
}

/* Button Styles */
.q-btn {
  /* background-color: #1a1a1a; */
  color: #a9b7c6;
  border: 1px solid #3c3f41;
  cursor: pointer;
}

.q-btn:hover {
  background-color: #6897bb; /* JetBrains hover color */
}

/* Link Styles */
.link {
  text-align: center;
  margin-top: 15px;
  color: #6d9cbe; /* JetBrains link color */
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 600px) {
  .q-card {
    margin: 20px;
    box-shadow: none;
  }
}
</style> -->
