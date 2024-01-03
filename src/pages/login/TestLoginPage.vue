<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-form @submit.prevent="onSubmitLogin" @reset="onReset">
          <q-input
            v-model="login.username"
            label="Username"
            :rules="[(val) => !!val || 'Username is required']"
          />
          <q-input
            v-model="login.password"
            type="password"
            label="Password"
            :rules="[(val) => !!val || 'Password is required']"
          />
          <div>
            <q-btn label="Login" type="submit" color="primary" />
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

const login = ref({
  username: "",
  password: "",
});

const router = useRouter();

const onSubmitLogin = () => {
  console.log("Login data:", login.value);
  // Implement your logic or HTTP request here
};

const onReset = () => {
  login.value.username = "";
  login.value.password = "";
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style>
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
</style>
