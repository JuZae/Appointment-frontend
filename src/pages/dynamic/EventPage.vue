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
            label="Send Invite"
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
const EMAIL_API = "http://localhost:8080/sendEmail";

//TODO: Hier noch inputfelder für die Email machen (oder direkt erzeugen)
const emailRequestBody = ref({
  from: "",
  to: guestEmail.value,
  subject: "",
  text: "",
});

const sendDynamicLink = async () => {
  // Implement the logic to generate and send dynamic links to the provided email.
  // You will need to make an API request to your Spring Boot backend to send the email.
  try {
    const response = await fetch(EMAIL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailRequestBody),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log("Response Data:", responseData);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

onMounted(async () => {
  //TODO: Hier hier das jeweilige Appointment holen und dann die Bezeichnung als subject und in den Text den Dynamic Link rein
});
</script>
