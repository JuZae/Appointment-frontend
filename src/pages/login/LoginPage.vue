<template>
  <q-input v-model="username" filled type="username" hint="Username">
    <template v-slot:append>
      <q-icon name="user" />
    </template>
  </q-input>

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
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import LStore from "src/stores/user";
const $my_usern = LStore.useStore();
const { username } = storeToRefs($my_usern);
const password = ref("");
const isPwd = ref(true);
</script>
