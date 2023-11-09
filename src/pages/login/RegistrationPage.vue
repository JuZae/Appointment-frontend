<template>
  <head>
    <title>Registration</title>
    <title>Buttons</title>
  </head>
  <body>
    <h4>Registration</h4>
    <q-dialog v-model="registration" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Anmelden</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="username" filled type="username" hint="Username">
            <template v-slot:append>
              <q-icon name="user" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="password"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            id="abbrechen"
            flat
            v-close-popup
            @click="this.$router.go(0)"
            color="primary"
            no-caps
            >Abbrechen</q-btn
          >
          <RouterLink to="/overviewpage">
            <q-btn
              id="weiter"
              flat
              v-close-popup
              @click="saveUserName(username)"
              color="primary"
              no-caps
              >Weiter</q-btn
            >
          </RouterLink>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </body>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import LStore from "src/stores/user";
import { RouterLink } from "vue-router";

const $my_usern = LStore.useStore();
const { username } = storeToRefs($my_usern);
const registration = ref(true);
const password = ref("");
const isPwd = ref(true);

const saveUserName = (username) => {
  $my_usern.update(username);
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Set a default font-family and background color */
body {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #fff;
  padding: 10px;
}

/* Center the content on the page */
.template-container {
  max-width: 40px;
  margin: auto;
}

input[type="text"],
textarea {
  /* width: auto;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px; */
  margin-top: 10px;
  width: 100%;
  height: 70%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

h4 {
  text-align: center;
  margin-bottom: 20px;
}

/* button {
  display: block;
  position: absolute;
  width: auto;
  padding: 10px;
  margin-bottom: 10px;
  color: #fff;
  background-color: #0056b3;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  right: 10px;
} */
</style>
