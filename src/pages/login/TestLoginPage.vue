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
            :rules="[(val) => !!val || 'Password is required']"
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
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import AuthStore from "src/stores/authStore";
import UserStore from "src/stores/user";

const authStore = AuthStore.useStore();

const userStore = UserStore.useStore();

const { authStatusInStore } = storeToRefs(authStore);

const status = false;

const message = "";

const API_LOGIN = "http://localhost:8080/api/auth/login";

const API_GETUSER = "http://localhost:8080/api/user/getOne/";

const login = ref({
  email: "",
  password: "",
});

const emailRules = [
  (val) => !!val || "Email is required",
  (val) => /.+@.+\..+/.test(val) || "Email must be valid",
];

const router = useRouter();

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

    authStore.setAuthStatus(data.status);
    if (authStore.isAuthenticated) {
      getUser(login.value.email);
    }
    //TODO: MAKE THIS A POP UP!
    console.log("MESSAGE:" + data.message);
  } catch (error) {
    console.error("Login error:", error);
  }
};

const getUser = async (username) => {
  console.log("USERNAME PARAM" + username);
  const URL = API_GETUSER + username;
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
    console.log("USERNAMERETURN" + data.username);
    userStore.update(data.username);

    //TODO: MAKE THIS A POP UP!
    console.log("MESSAGE:" + data.message);
  } catch (error) {
    console.error("Login error:", error);
  }
};

const onReset = () => {
  login.value.email = "";
  login.value.password = "";
};

const goToEnter = () => {
  console.log("!!!WORKS!!!");
  router.push("/overviewpage");
};

const goToOverview = () => {
  router.push("/overviewpage");
};

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
