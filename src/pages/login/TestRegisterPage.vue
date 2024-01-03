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
            <q-btn label="Register" type="submit" color="primary" />
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
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const register = ref({
  username: "",
  email: "",
  password: "",
});

const router = useRouter();

const emailRules = [
  (val) => !!val || "Email is required",
  (val) => /.+@.+\..+/.test(val) || "Email must be valid",
];

const passwordRules = [
  (val) => !!val || "Password is required",
  (val) => val.length >= 8 || "Password must be at least 8 characters",
];

const onSubmitRegister = () => {
  console.log("Registration data:", register.value);
  // Implement your logic or HTTP request here
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
/* General Styles */
body,
html {
  height: 100%;
  margin: 0;
  font-family: "Arial", sans-serif;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/* Form Styles */
.q-form {
  display: flex;
  flex-direction: column;
}

.q-input {
  margin-bottom: 20px;
}

/* Button Styles */
.q-btn {
  width: 100%;
  margin-top: 10px;
}

/* Link Styles */
.link {
  text-align: center;
  margin-top: 15px;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

/* Responsive Design */
@media (max-width: 600px) {
  .q-card {
    margin: 20px;
    box-shadow: none;
  }
}
</style>
