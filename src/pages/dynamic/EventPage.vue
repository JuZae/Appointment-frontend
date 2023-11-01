<template>
  <q-page>
    <q-card>
      <q-card-section>
        <q-form @submit="sendDynamicLink">
          <q-input
            v-model="guestEmail"
            label="Guest Email"
            type="email"
            outlined
            dense
            required
          />
          <q-btn
            label="Send Dynamic Link"
            color="primary"
            type="submit"
            class="q-mt-md"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const guestEmail = ref("");

const sendDynamicLink = () => {
  // Implement the logic to generate and send dynamic links to the provided email.
  // You will need to make an API request to your Spring Boot backend to send the email.
};
</script>
